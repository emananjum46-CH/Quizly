const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { findUserByEmail, createUser } = require('../models/userModel');
const nodemailer = require('nodemailer');

const pool = require('../config/db'); // your DB connection
// Register a new user (student)
const registerUser = (req, res) => {
  const { name, email, password, role } = req.body;

  if (role !== 'student') {
    return res.status(400).json({ message: 'Only students can register through this form' });
  }

  findUserByEmail(email, (err, results) => {
    if (err) return res.status(500).json({ message: 'Server Error' });

    if (results.length > 0) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    createUser({ name, email, password, role }, (err, result) => {
      if (err) return res.status(500).json({ message: 'Failed to register user' });

      res.status(201).json({ message: 'User registered successfully' });
    });
  });
};

// Login a user and generate JWT token
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Find user using promise-based query
    const [user] = await pool.query(
      'SELECT * FROM users WHERE email = ?', 
      [email]
    );

    if (user.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // 2. Compare password asynchronously
    const isPasswordValid = await bcrypt.compare(password, user[0].password);
    
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // 3. Generate JWT
    const token = jwt.sign(
      { userId: user[0].id, role: user[0].role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
console.log("DATABASE USER:", user);
console.log("ROLE FROM DB:", user[0].role);
    // 4. Send response
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user[0].id,
        name: user[0].name,
        email: user[0].email,
        role: user[0].role
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};


const inviteTeacher = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    // Check if user already exists
    const [existingUsers] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate a token
    const token = jwt.sign({ email, role: 'teacher' }, process.env.JWT_SECRET, { 
      expiresIn: '1h' 
    });
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    // Save token in DB
    await pool.execute(
      `INSERT INTO teacher_invites (email, token, expires_at) 
       VALUES (?, ?, ?) 
       ON DUPLICATE KEY UPDATE 
       token = VALUES(token), 
       expires_at = VALUES(expires_at)`,
      [email, token, expiresAt]
    );

    // Configure transporter
  const transporter = nodemailer.createTransport({

    host: "smtp.gmail.com",

    port: 587,

    secure: false,

    auth: {

        user: process.env.EMAIL_USER,

        pass: process.env.EMAIL_PASS

    },

    tls: {

        rejectUnauthorized: false

    }

});
transporter.verify((error, success) => {

    if(error){

        console.log(
        "SMTP connection failed:",
        error.message
        );

    }

    else{

        console.log(
        "SMTP server ready"
        );

    }

});

    // Email content
  const inviteLink = `https://quizly-git-main-quizly-team.vercel.app/register/teacher?token=${token}`;
    
    const mailOptions = {
      from: `"School Portal" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Complete Your Teacher Registration',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #2563eb;">Teacher Invitation</h2>
          <p>You've been invited to join as a teacher!</p>
          <p>Click the link below to complete your registration:</p>
          <a href="${inviteLink}" 
             style="display: inline-block; 
                    padding: 10px 20px; 
                    background-color: #2563eb; 
                    color: white; 
                    text-decoration: none; 
                    border-radius: 5px;">
            Complete Registration
          </a>
          <p style="margin-top: 20px; color: #666;">
            <em>This link expires in 1 hour</em>
          </p>
        </div>
      `
    };

    // Send email
    // Send email
const info = await transporter.sendMail(mailOptions);

console.log(
    "Email sent successfully:",
    info.messageId
);


res.status(200).json({
    success: true,
    message: "Teacher invitation sent successfully"
});


} 
catch (error) {

    console.log("========= EMAIL ERROR =========");

    console.log("Message:", error.message);

    console.log("Code:", error.code);

    console.log("Command:", error.command);

    console.log("===============================");


    res.status(500).json({

        success:false,

        message:"Failed to send invitation",

        error:error.message

    });
}
};


const registerTeacher = async (req, res) => {
  const { token, name, password } = req.body;

  try {
    // Validate input
    if (!name || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Name and password are required' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    // Check existing user
    const [existingUsers] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Teacher already registered'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create teacher
    await pool.execute(
      'INSERT INTO users (email, name, password, role) VALUES (?, ?, ?, ?)',
      [email, name, hashedPassword, 'teacher']
    );

    // Delete used token
    await pool.execute(
      'DELETE FROM teacher_invites WHERE email = ?',
      [email]
    );

    res.status(201).json({
      success: true,
      message: 'Teacher registered successfully'
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    const response = {
      success: false,
      message: 'Registration failed'
    };

    if (error.name === 'TokenExpiredError') {
      response.message = 'Token has expired';
    } else if (error.name === 'JsonWebTokenError') {
      response.message = 'Invalid token';
    }

    res.status(error.statusCode || 500).json(response);
  }
};
const studentRegister = async (req, res) => {
  const connection = await pool.getConnection();
  try {
      await connection.beginTransaction();
      
      const { name, email, password, class_id } = req.body;

      const hashedPassword = bcrypt.hashSync(password, 10);
      // 1. Create student account
      const [userResult] = await connection.query(
          `INSERT INTO users (name, email, password, role)
           VALUES (?, ?, ?, 'student')`,
          [name, email, hashedPassword]
      );

      // 2. Enroll in class
      await connection.query(
          `INSERT INTO class_students (class_id, student_id)
           VALUES (?, ?)`,
          [class_id, userResult.insertId]
      );

      await connection.commit();
      res.json({ success: true, studentId: userResult.insertId });
      
  } catch (err) {
      await connection.rollback();
      res.status(500).json({ 
          success: false,
          message: 'Registration failed',
          error: process.env.NODE_ENV === 'development' ? err.message : null
      });
  } finally {
      connection.release();
  }
};


module.exports = {
  registerUser,
  loginUser,
  inviteTeacher,
  registerTeacher,
  studentRegister,
};
