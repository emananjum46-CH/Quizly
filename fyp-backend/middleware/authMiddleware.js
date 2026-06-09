const jwt = require('jsonwebtoken');

// authMiddleware.js
const authmiddle = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        
        if (!token) {
            return res.status(401).json({ message: "Authentication required" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Verify user exists in database
        const [user] = await pool.query(
            "SELECT id, role FROM users WHERE id = ?",
            [decoded.userId]
        );
        
        if (!user.length) {
            return res.status(401).json({ message: "Invalid user" });
        }

        req.user = user[0];
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
};
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Extract token from Authorization header

  if (!token) {
    return res.status(401).json({ message: 'Access denied, no token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(400).json({ message: 'Invalid token' });

    req.user = decoded; // Attach the decoded user info to the request object
    next();
  });
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden, admin access required' });
  }
  next();
};

const isTeacher = (req, res, next) => {
  if (req.user.role !== 'teacher') {
    return res.status(403).json({ message: 'Forbidden, teacher access required' });
  }
  next();
};

module.exports = { verifyToken, isAdmin, isTeacher , authmiddle };
