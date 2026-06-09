-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 09, 2026 at 09:43 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `quiz`
--

-- --------------------------------------------------------

--
-- Table structure for table `ai_generation_logs`
--

CREATE TABLE `ai_generation_logs` (
  `id` int(11) NOT NULL,
  `teacher_id` int(11) DEFAULT NULL,
  `quiz_id` int(11) DEFAULT NULL,
  `source_type` enum('pdf','text','slide','topic') DEFAULT NULL,
  `input_summary` text DEFAULT NULL,
  `generated_questions` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `assigned_teachers`
--

CREATE TABLE `assigned_teachers` (
  `id` int(11) NOT NULL,
  `class_id` int(11) NOT NULL,
  `teacher_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `assigned_teachers`
--

INSERT INTO `assigned_teachers` (`id`, `class_id`, `teacher_id`, `created_at`) VALUES
(1, 1, 3, '2025-04-19 14:41:09'),
(2, 2, 3, '2025-07-02 05:14:52');

-- --------------------------------------------------------

--
-- Table structure for table `classes`
--

CREATE TABLE `classes` (
  `id` int(11) NOT NULL,
  `class_name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `classes`
--

INSERT INTO `classes` (`id`, `class_name`, `created_at`) VALUES
(1, 'BSCS (Morning)', '2025-04-19 16:24:32'),
(2, 'BSCS - Evening', '2025-07-02 05:14:34');

-- --------------------------------------------------------

--
-- Table structure for table `class_quizzes`
--

CREATE TABLE `class_quizzes` (
  `id` int(11) NOT NULL,
  `class_id` int(11) NOT NULL,
  `quiz_id` int(11) NOT NULL,
  `assigned_by` int(11) NOT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  `is_attempted` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `class_quizzes`
--

INSERT INTO `class_quizzes` (`id`, `class_id`, `quiz_id`, `assigned_by`, `start_time`, `end_time`, `is_attempted`) VALUES
(1, 1, 1, 3, '2025-07-08 02:00:00', '2025-07-08 03:00:00', 1),
(2, 1, 21, 3, '2025-07-08 02:19:00', '2025-07-08 03:20:00', 1),
(3, 1, 2, 3, '2025-07-08 02:55:00', '2025-07-08 03:55:00', 1),
(4, 1, 21, 3, '2025-07-08 03:16:00', '2025-07-08 04:16:00', 1);

-- --------------------------------------------------------

--
-- Table structure for table `class_students`
--

CREATE TABLE `class_students` (
  `id` int(11) NOT NULL,
  `class_id` int(11) DEFAULT NULL,
  `student_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `class_students`
--

INSERT INTO `class_students` (`id`, `class_id`, `student_id`) VALUES
(1, 1, 4),
(2, 1, 5),
(3, 1, 6),
(4, 1, 17),
(5, 1, 18),
(6, 2, 19),
(7, 1, 20),
(8, 1, 52),
(9, 1, 53);

-- --------------------------------------------------------

--
-- Table structure for table `options`
--

CREATE TABLE `options` (
  `id` int(11) NOT NULL,
  `question_id` int(11) DEFAULT NULL,
  `option_text` text DEFAULT NULL,
  `is_correct` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `options`
--

INSERT INTO `options` (`id`, `question_id`, `option_text`, `is_correct`) VALUES
(1, 2, 'Readability', 0),
(2, 2, 'Extendibility', 1),
(3, 2, 'Modularity', 0),
(4, 2, 'Speed', 0),
(5, 3, 'True', 1),
(6, 3, 'False', 0),
(7, 4, 'To draw smooth lines between two endpoints', 0),
(8, 4, 'To calculate pixel positions along a line', 1),
(9, 4, 'To generate random deflection voltages', 0),
(10, 4, 'To optimize multiplication operations', 0),
(11, 5, 'True', 1),
(12, 5, 'False', 0),
(13, 8, 'Speed', 0),
(14, 8, 'Readability', 0),
(15, 8, 'Extendibility', 1),
(16, 8, 'Reliability', 0),
(17, 9, 'True', 0),
(18, 9, 'False', 1),
(19, 11, 'Speed', 0),
(20, 11, 'Reliability', 0),
(21, 11, 'Readability', 1),
(22, 11, 'Modularity', 0),
(23, 12, 'True', 0),
(24, 12, 'False', 1),
(25, 14, 'End users only', 0),
(26, 14, 'Computer professionals only', 0),
(27, 14, 'Both end users and computer professionals', 1),
(28, 14, 'None of the above', 0),
(29, 15, 'True', 0),
(30, 15, 'False', 1),
(31, 16, 'pa', 0),
(32, 16, 'paki', 0),
(33, 16, 'pakistani', 0),
(34, 16, 'pakitan', 1),
(35, 17, 'True', 1),
(36, 17, 'False', 0),
(37, 19, 'asdf', 0),
(38, 20, 'Not Nulll', 0),
(39, 20, 'Unique', 0),
(40, 20, 'Not Duplicate', 0),
(41, 20, 'All of the abover', 1),
(42, 21, 'Primary Key of a table', 1),
(43, 21, 'Composite Key', 0),
(44, 21, 'Second Column of same Table', 0),
(45, 21, 'None of the above', 0),
(46, 22, 'Quiz App', 1),
(47, 22, 'Smart App', 0),
(48, 22, 'Doc Management System', 0),
(49, 22, 'Library Management System', 0),
(50, 23, 'React.js', 0),
(51, 23, 'Node.js', 0),
(52, 23, 'Express.js', 0),
(53, 23, 'All of the above', 1),
(54, 24, 'afd', 0),
(55, 25, 'sdf', 0),
(56, 26, '21', 0),
(57, 27, 'True', 1),
(58, 27, 'False', 0),
(59, 28, 'True', 1),
(60, 28, 'False', 0),
(61, 29, 'True', 1),
(62, 29, 'False', 0),
(63, 30, 'True', 1),
(64, 30, 'False', 0),
(65, 31, 'True', 1),
(66, 31, 'False', 0),
(67, 32, 'asdf', 0),
(68, 34, 'End users', 0),
(69, 34, 'Computer professionals', 1),
(70, 34, 'Software developers', 0),
(71, 34, 'Project managers', 0),
(72, 35, 'True', 0),
(73, 35, 'False', 1);

-- --------------------------------------------------------

--
-- Table structure for table `questions`
--

CREATE TABLE `questions` (
  `id` int(11) NOT NULL,
  `quiz_id` int(11) DEFAULT NULL,
  `question_text` text DEFAULT NULL,
  `question_type` enum('mcq','true_false','short_answer') DEFAULT NULL,
  `difficulty_level` enum('easy','medium','hard') DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `time_limit` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `questions`
--

INSERT INTO `questions` (`id`, `quiz_id`, `question_text`, `question_type`, `difficulty_level`, `created_at`, `time_limit`) VALUES
(1, 1, 'What is software quality best described as?', 'short_answer', 'easy', '2025-04-26 20:18:40', NULL),
(2, 1, 'Which of the following is an external quality factor in software?', 'mcq', 'medium', '2025-04-26 20:18:40', NULL),
(3, 1, 'True or False: Internal factors in software quality are perceptible only to computer professionals.', 'true_false', 'easy', '2025-04-26 20:18:40', NULL),
(4, 2, 'What is the purpose of the DDA Method in computer graphics?', 'mcq', 'medium', '2025-04-28 11:32:32', NULL),
(5, 2, 'True or False: The Bresenham Line Algorithm is more efficient than the DDA Method.', 'true_false', 'easy', '2025-04-28 11:32:32', NULL),
(6, 2, 'Explain the decision parameter di in the Bresenham Line Algorithm.', 'short_answer', 'hard', '2025-04-28 11:32:32', NULL),
(7, 3, 'What is software quality best described as?', 'short_answer', 'easy', '2025-04-29 20:26:29', NULL),
(8, 3, 'Which of the following is NOT an external quality factor in software?', 'mcq', 'medium', '2025-04-29 20:26:29', NULL),
(9, 3, 'True or False: Internal quality factors are only perceptible to computer professionals.', 'true_false', 'easy', '2025-04-29 20:26:29', NULL),
(10, 4, 'What is software quality best described as?', 'short_answer', 'easy', '2025-04-29 20:27:38', NULL),
(11, 4, 'Which of the following is NOT an external quality factor?', 'mcq', 'medium', '2025-04-29 20:27:38', NULL),
(12, 4, 'True or False: Internal quality factors are perceptible only to computer professionals.', 'true_false', 'easy', '2025-04-29 20:27:38', NULL),
(13, 5, 'What is software quality best described as?', 'short_answer', 'easy', '2025-04-29 20:28:53', NULL),
(14, 5, 'External quality factors of software are perceptible to:', 'mcq', 'medium', '2025-04-29 20:28:53', NULL),
(15, 5, 'True or False: Internal quality factors of software are visible to end users.', 'true_false', 'easy', '2025-04-29 20:28:53', NULL),
(16, 9, 'pakistan', 'mcq', 'easy', '2025-04-29 20:53:21', NULL),
(17, 9, 'true', 'true_false', 'easy', '2025-04-29 20:53:21', NULL),
(18, 9, 'Define pakistan', 'short_answer', 'easy', '2025-04-29 20:53:21', NULL),
(19, 10, 'asdf', 'mcq', 'easy', '2025-04-29 20:54:16', NULL),
(20, 11, 'What is Primary Key', 'mcq', 'medium', '2025-07-02 08:41:25', NULL),
(21, 11, 'Foreign Key', 'mcq', 'easy', '2025-07-02 08:41:25', NULL),
(22, 12, 'What is your project', 'mcq', 'easy', '2025-07-02 09:19:20', NULL),
(23, 12, 'What did you choose?', 'mcq', 'easy', '2025-07-02 09:19:20', NULL),
(24, 13, 'asdf', 'mcq', 'easy', '2025-07-02 10:00:38', NULL),
(25, 14, 'asdf', 'mcq', 'easy', '2025-07-02 10:01:54', NULL),
(26, 15, 'asdf', 'mcq', 'easy', '2025-07-02 10:04:07', 90),
(27, 16, 'test', 'true_false', 'easy', '2025-07-02 10:19:42', 59),
(28, 18, 'Name is Fasee Hamad?', 'true_false', 'hard', '2025-07-02 10:38:53', 60),
(29, 19, 'My Name is faseeh', 'true_false', 'easy', '2025-07-02 10:47:36', 35),
(30, 19, 'Class is BSCS', 'true_false', 'easy', '2025-07-02 10:47:36', 60),
(31, 19, 'Section is Evening', 'true_false', 'easy', '2025-07-02 10:47:36', 60),
(32, 20, 'dfs', 'mcq', 'easy', '2025-07-07 20:46:45', 110),
(33, 21, 'What are the two different sorts of qualities described in software quality engineering?', 'short_answer', 'easy', '2025-07-07 20:53:43', 180),
(34, 21, 'External quality factors in software quality engineering are perceptible to:', 'mcq', 'medium', '2025-07-07 20:53:43', 60),
(35, 21, 'True or False: Internal quality factors in software quality engineering are only perceptible to computer professionals.', 'true_false', 'easy', '2025-07-07 20:53:43', 60),
(36, 22, 'heasdf', 'short_answer', 'easy', '2025-07-07 20:54:30', 105);

-- --------------------------------------------------------

--
-- Table structure for table `quizzes`
--

CREATE TABLE `quizzes` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `quizzes`
--

INSERT INTO `quizzes` (`id`, `title`, `description`, `created_by`, `created_at`) VALUES
(1, 'Software Quality Engineering Quiz', 'Test your knowledge on software quality engineering concepts.', 3, '2025-04-26 20:18:40'),
(2, 'Computer Graphics Quiz', 'Test your knowledge on computer graphics concepts.', 3, '2025-04-28 11:32:32'),
(3, 'Software Quality Engineering Quiz', 'Test your knowledge on software quality engineering concepts.', 3, '2025-04-29 20:26:29'),
(4, 'Software Quality Engineering Quiz', 'Test your knowledge on software quality engineering.', 3, '2025-04-29 20:27:38'),
(5, 'Software Quality Engineering Quiz', 'Test your knowledge on software quality engineering concepts.', 3, '2025-04-29 20:28:53'),
(6, 'Quiz 12', 'adsdf', 3, '2025-04-29 20:33:53'),
(7, 'Quiz 12', 'adsdf', 3, '2025-04-29 20:35:03'),
(8, 'Quiz 12', 'adsdf', 3, '2025-04-29 20:35:46'),
(9, 'Quiz 12', 'adsdf', 3, '2025-04-29 20:53:21'),
(10, 'adf', 'asf', 3, '2025-04-29 20:54:16'),
(11, 'Quiz#1- Database Systems', 'Quiz#1 for Database Systems', 3, '2025-07-02 08:41:25'),
(12, 'Testing Quiz 2', 'Testing', 3, '2025-07-02 09:19:20'),
(13, 'asdf', 'asdfasdf', 3, '2025-07-02 10:00:38'),
(14, 'asd', 'asdf', 3, '2025-07-02 10:01:54'),
(15, 'asdasdf', 'sadf', 3, '2025-07-02 10:04:07'),
(16, 'testing', 'testing', 3, '2025-07-02 10:19:42'),
(17, 'Testing', 'Testinggg', 3, '2025-07-02 10:38:10'),
(18, 'My Profile', 'Profile', 3, '2025-07-02 10:38:53'),
(19, 'My Profile#2', 'Testing System', 3, '2025-07-02 10:47:36'),
(20, 'df', 'dsfg', 3, '2025-07-07 20:46:45'),
(21, 'Software Quality Engineering Quiz', 'Test your knowledge on software quality engineering.', 3, '2025-07-07 20:53:43'),
(22, 'ted', 'sadf', 3, '2025-07-07 20:54:30');

-- --------------------------------------------------------

--
-- Table structure for table `quiz_analytics`
--

CREATE TABLE `quiz_analytics` (
  `id` int(11) NOT NULL,
  `class_id` int(11) DEFAULT NULL,
  `topic_id` int(11) DEFAULT NULL,
  `average_score` float DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `quiz_assignments`
--

CREATE TABLE `quiz_assignments` (
  `id` int(11) NOT NULL,
  `quiz_id` int(11) DEFAULT NULL,
  `student_id` int(11) DEFAULT NULL,
  `assigned_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `started_at` timestamp NULL DEFAULT NULL,
  `submitted_at` timestamp NULL DEFAULT NULL,
  `timer` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `quiz_attempts`
--

CREATE TABLE `quiz_attempts` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `quiz_id` int(11) NOT NULL,
  `class_id` int(11) NOT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime DEFAULT NULL,
  `score` int(11) DEFAULT NULL,
  `status` enum('in_progress','completed','expired') DEFAULT 'in_progress'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `quiz_results`
--

CREATE TABLE `quiz_results` (
  `id` int(11) NOT NULL,
  `quiz_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `score` decimal(5,2) NOT NULL,
  `total_questions` int(11) NOT NULL,
  `max_score` int(11) NOT NULL,
  `details` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`details`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('attempted','not_attempted') DEFAULT 'not_attempted'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `quiz_results`
--

INSERT INTO `quiz_results` (`id`, `quiz_id`, `student_id`, `score`, `total_questions`, `max_score`, `details`, `created_at`, `status`) VALUES
(1, 1, 4, 2.00, 3, 7, '[{\"question_id\":1,\"question_type\":\"short_answer\",\"score\":1,\"max_score\":5,\"feedback\":\"The answer provided is incorrect. Software quality is best described as the degree to which a software product meets specified requirements and customer expectations.\",\"student_answer\":\"ANythina\"},{\"question_id\":2,\"question_type\":\"mcq\",\"score\":1,\"max_score\":1},{\"question_id\":3,\"question_type\":\"true_false\",\"score\":0,\"max_score\":1}]', '2025-04-27 21:41:02', 'attempted'),
(3, 2, 4, 3.00, 3, 7, '[{\"question_id\":4,\"question_type\":\"mcq\",\"score\":1,\"max_score\":1},{\"question_id\":5,\"question_type\":\"true_false\",\"score\":1,\"max_score\":1},{\"question_id\":6,\"question_type\":\"short_answer\",\"score\":1,\"max_score\":5,\"feedback\":\"The answer provided is not accurate or complete. Please provide a correct explanation of the decision parameter di in the Bresenham Line Algorithm.\",\"student_answer\":\"Auashdfsabf\"}]', '2025-04-28 11:35:26', 'attempted'),
(4, 2, 4, 3.00, 3, 7, '[{\"question_id\":4,\"question_type\":\"mcq\",\"score\":1,\"max_score\":1},{\"question_id\":5,\"question_type\":\"true_false\",\"score\":1,\"max_score\":1},{\"question_id\":6,\"question_type\":\"short_answer\",\"score\":1,\"max_score\":5,\"feedback\":\"The student\'s answer is incomplete and does not provide an accurate explanation of the decision parameter di in the Bresenham Line Algorithm. Please provide a more detailed and accurate explanation.\",\"student_answer\":\"sdfvbsdhfv\"}]', '2025-04-28 11:36:51', 'attempted'),
(5, 1, 4, 0.00, 3, 7, '[]', '2025-04-29 21:38:39', 'attempted'),
(6, 1, 4, 0.00, 3, 7, '[]', '2025-04-29 21:38:59', 'attempted'),
(7, 1, 4, 0.00, 3, 7, '[]', '2025-04-29 21:39:02', 'attempted'),
(8, 1, 4, 0.00, 3, 7, '[]', '2025-04-29 21:39:21', 'attempted'),
(9, 1, 4, 0.00, 3, 7, '[]', '2025-04-29 21:39:26', 'attempted'),
(10, 1, 4, 0.00, 3, 7, '[]', '2025-04-29 21:39:35', 'attempted'),
(11, 1, 4, 3.00, 3, 7, '[{\"question_id\":1,\"question_type\":\"short_answer\",\"score\":1,\"max_score\":5,\"feedback\":\"The answer provided is too vague and incomplete. Software quality is best described as the degree to which a software product meets specified requirements and customer expectations.\",\"student_answer\":\"a\"},{\"question_id\":2,\"question_type\":\"mcq\",\"score\":1,\"max_score\":1},{\"question_id\":3,\"question_type\":\"true_false\",\"score\":1,\"max_score\":1}]', '2025-04-29 21:40:40', 'attempted'),
(12, 1, 4, 1.00, 3, 7, '[{\"question_id\":1,\"question_type\":\"short_answer\",\"score\":1,\"max_score\":5,\"feedback\":\"The answer provided is too vague and incomplete. Software quality is best described as the degree to which a software product meets specified requirements and satisfies the needs or expectations of its users.\",\"student_answer\":\"a\"}]', '2025-04-29 21:40:50', 'attempted'),
(13, 1, 4, 0.00, 3, 7, '[]', '2025-04-29 21:52:28', 'attempted'),
(14, 1, 4, 0.00, 3, 7, '[]', '2025-04-29 21:52:32', 'attempted'),
(15, 11, 52, 2.00, 2, 2, '[{\"question_id\":20,\"question_type\":\"mcq\",\"score\":1,\"max_score\":1},{\"question_id\":21,\"question_type\":\"mcq\",\"score\":1,\"max_score\":1}]', '2025-07-02 09:06:52', 'attempted'),
(16, 15, 52, 0.00, 1, 1, '[{\"question_id\":26,\"question_type\":\"mcq\",\"score\":0,\"max_score\":1}]', '2025-07-02 10:09:00', 'attempted'),
(17, 15, 52, 0.00, 1, 1, '[{\"question_id\":26,\"question_type\":\"mcq\",\"score\":0,\"max_score\":1}]', '2025-07-02 10:17:26', 'attempted'),
(18, 16, 52, 0.00, 1, 1, '[]', '2025-07-02 10:21:15', 'attempted'),
(19, 16, 52, 0.00, 1, 1, '[]', '2025-07-02 10:21:15', 'attempted'),
(20, 1, 4, 0.00, 3, 7, '[]', '2025-07-07 21:08:24', 'attempted'),
(21, 1, 4, 0.00, 3, 7, '[]', '2025-07-07 21:08:24', 'attempted'),
(22, 21, 4, 1.00, 3, 7, '[{\"question_id\":33,\"question_type\":\"short_answer\",\"score\":1,\"max_score\":5,\"feedback\":\"The student answer is incorrect and incomplete. The two different sorts of qualities described in software quality engineering are functional quality and structural quality.\",\"student_answer\":\"hasdf\"}]', '2025-07-07 21:21:09', 'attempted'),
(23, 21, 4, 1.00, 3, 7, '[{\"question_id\":33,\"question_type\":\"short_answer\",\"score\":1,\"max_score\":5,\"feedback\":\"The answer provided is not accurate or complete. Please provide a more detailed response.\",\"student_answer\":\"hk\"}]', '2025-07-07 21:22:34', 'attempted'),
(24, 21, 4, 1.00, 3, 7, '[{\"question_id\":33,\"question_type\":\"short_answer\",\"score\":1,\"max_score\":5,\"feedback\":\"The answer provided is incomplete and incorrect. Please provide a more accurate and complete response.\",\"student_answer\":\"asg\"}]', '2025-07-07 21:28:49', 'attempted'),
(25, 21, 4, 0.00, 3, 7, '[{\"question_id\":33,\"question_type\":\"short_answer\",\"score\":0,\"max_score\":5,\"feedback\":\"The answer provided is completely irrelevant and does not address the question about the two different sorts of qualities in software quality engineering.\",\"student_answer\":\"asdf\"},{\"question_id\":34,\"question_type\":\"mcq\",\"score\":0,\"max_score\":1},{\"question_id\":35,\"question_type\":\"true_false\",\"score\":0,\"max_score\":1}]', '2025-07-07 21:33:17', 'attempted'),
(26, 21, 4, 0.00, 3, 7, '[{\"question_id\":33,\"question_type\":\"short_answer\",\"score\":0,\"max_score\":5,\"feedback\":\"The answer provided is completely irrelevant and nonsensical. It does not address the question about the two different sorts of qualities in software quality engineering.\",\"student_answer\":\"sdfa\"},{\"question_id\":34,\"question_type\":\"mcq\",\"score\":0,\"max_score\":1},{\"question_id\":35,\"question_type\":\"true_false\",\"score\":0,\"max_score\":1}]', '2025-07-07 21:34:01', 'attempted'),
(27, 21, 4, 1.00, 3, 7, '[{\"question_id\":33,\"question_type\":\"short_answer\",\"score\":1,\"max_score\":5,\"feedback\":\"The answer is partially relevant as it mentions aspects related to software quality but fails to correctly identify the two different sorts of qualities described in software quality engineering, which are typically functional and non-functional qualities. The response lacks accuracy and completeness in addressing the specific question asked.\",\"student_answer\":\"a software quality should contain all the proper quality including user end testing and implementing\"},{\"question_id\":34,\"question_type\":\"mcq\",\"score\":0,\"max_score\":1},{\"question_id\":35,\"question_type\":\"true_false\",\"score\":0,\"max_score\":1}]', '2025-07-07 21:34:49', 'attempted'),
(28, 21, 4, 2.00, 3, 7, '[{\"question_id\":33,\"question_type\":\"short_answer\",\"score\":0,\"max_score\":5,\"feedback\":\"The answer provided is completely irrelevant and nonsensical. It does not address the question about the two different sorts of qualities described in software quality engineering.\",\"student_answer\":\"asg\"},{\"question_id\":34,\"question_type\":\"mcq\",\"score\":1,\"max_score\":1},{\"question_id\":35,\"question_type\":\"true_false\",\"score\":1,\"max_score\":1}]', '2025-07-07 21:35:05', 'attempted'),
(29, 21, 4, 0.00, 3, 7, '[{\"question_id\":33,\"question_type\":\"short_answer\",\"score\":0,\"max_score\":5,\"feedback\":\"The answer provided is completely irrelevant and nonsensical. It does not address the question regarding the two different sorts of qualities in software quality engineering.\",\"student_answer\":\"asdf\"},{\"question_id\":34,\"question_type\":\"mcq\",\"score\":0,\"max_score\":1},{\"question_id\":35,\"question_type\":\"true_false\",\"score\":0,\"max_score\":1}]', '2025-07-07 22:05:07', 'attempted'),
(30, 21, 4, 0.00, 3, 7, '[{\"question_id\":33,\"question_type\":\"short_answer\",\"score\":0,\"max_score\":5,\"feedback\":\"The answer provided is completely irrelevant and nonsensical. It does not address the question about the two different sorts of qualities in software quality engineering.\",\"student_answer\":\"asdf\"},{\"question_id\":34,\"question_type\":\"mcq\",\"score\":0,\"max_score\":1},{\"question_id\":35,\"question_type\":\"true_false\",\"score\":0,\"max_score\":1}]', '2025-07-07 22:11:28', 'attempted'),
(31, 2, 4, 1.00, 3, 7, '[{\"question_id\":4,\"question_type\":\"mcq\",\"score\":0,\"max_score\":1},{\"question_id\":5,\"question_type\":\"true_false\",\"score\":1,\"max_score\":1},{\"question_id\":6,\"question_type\":\"short_answer\",\"score\":0,\"max_score\":5,\"feedback\":\"The answer provided is completely irrelevant and nonsensical. It does not address the question about the decision parameter di in the Bresenham Line Algorithm.\",\"student_answer\":\"asdf\"}]', '2025-07-07 22:12:09', 'attempted'),
(32, 2, 4, 1.00, 3, 7, '[{\"question_id\":4,\"question_type\":\"mcq\",\"score\":0,\"max_score\":1},{\"question_id\":5,\"question_type\":\"true_false\",\"score\":1,\"max_score\":1},{\"question_id\":6,\"question_type\":\"short_answer\",\"score\":0,\"max_score\":5,\"feedback\":\"The answer provided is completely irrelevant and nonsensical. It does not address the decision parameter di in the Bresenham Line Algorithm at all.\",\"student_answer\":\"SDad\"}]', '2025-07-07 22:13:27', 'attempted'),
(33, 2, 4, 1.00, 3, 7, '[{\"question_id\":4,\"question_type\":\"mcq\",\"score\":0,\"max_score\":1},{\"question_id\":5,\"question_type\":\"true_false\",\"score\":1,\"max_score\":1},{\"question_id\":6,\"question_type\":\"short_answer\",\"score\":0,\"max_score\":5,\"feedback\":\"The answer provided is completely irrelevant and nonsensical. It does not address the question about the decision parameter di in the Bresenham Line Algorithm.\",\"student_answer\":\"afdsf\"}]', '2025-07-07 22:14:09', 'attempted'),
(34, 2, 4, 1.00, 3, 7, '[{\"question_id\":4,\"question_type\":\"mcq\",\"score\":0,\"max_score\":1},{\"question_id\":5,\"question_type\":\"true_false\",\"score\":1,\"max_score\":1},{\"question_id\":6,\"question_type\":\"short_answer\",\"score\":0,\"max_score\":5,\"feedback\":\"The answer provided is completely irrelevant and nonsensical. It does not address the question regarding the decision parameter di in the Bresenham Line Algorithm.\",\"student_answer\":\"afds\"}]', '2025-07-07 22:15:17', 'attempted'),
(35, 2, 4, 1.00, 3, 7, '[{\"question_id\":4,\"question_type\":\"mcq\",\"score\":0,\"max_score\":1},{\"question_id\":5,\"question_type\":\"true_false\",\"score\":1,\"max_score\":1},{\"question_id\":6,\"question_type\":\"short_answer\",\"score\":0,\"max_score\":5,\"feedback\":\"The answer provided is completely irrelevant and nonsensical. It does not address the question regarding the decision parameter di in the Bresenham Line Algorithm.\",\"student_answer\":\"adsfz\"}]', '2025-07-07 22:16:11', 'attempted'),
(36, 21, 4, 2.00, 3, 7, '[{\"question_id\":33,\"question_type\":\"short_answer\",\"score\":0,\"max_score\":5,\"feedback\":\"The answer provided is completely irrelevant and nonsensical. It does not address the question regarding the two different sorts of qualities in software quality engineering.\",\"student_answer\":\"sdfasf\"},{\"question_id\":34,\"question_type\":\"mcq\",\"score\":1,\"max_score\":1},{\"question_id\":35,\"question_type\":\"true_false\",\"score\":1,\"max_score\":1}]', '2025-07-07 22:17:15', 'attempted');

-- --------------------------------------------------------

--
-- Table structure for table `quiz_warnings`
--

CREATE TABLE `quiz_warnings` (
  `id` int(11) NOT NULL,
  `assignment_id` int(11) DEFAULT NULL,
  `warning_type` enum('focus_switch','screenshot_attempt','copy_paste_attempt') DEFAULT NULL,
  `warning_time` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `student_answers`
--

CREATE TABLE `student_answers` (
  `id` int(11) NOT NULL,
  `assignment_id` int(11) DEFAULT NULL,
  `question_id` int(11) DEFAULT NULL,
  `selected_option_id` int(11) DEFAULT NULL,
  `subjective_answer` text DEFAULT NULL,
  `is_correct` tinyint(1) DEFAULT NULL,
  `marks_awarded` float DEFAULT NULL,
  `evaluated` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `teacher_invites`
--

CREATE TABLE `teacher_invites` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `teacher_invites`
--

INSERT INTO `teacher_invites` (`id`, `email`, `token`, `expires_at`, `created_at`) VALUES
(1, 'ssab8910@gmail.com', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNzYWI4OTEwQGdtYWlsLmNvbSIsInJvbGUiOiJ0ZWFjaGVyIiwiaWF0IjoxNzQ0MjgyNTU2LCJleHAiOjE3NDQyODYxNTZ9.8k9haQAcf_GrdTdMDjFmJGRV3KKGXzEjvxdaikDAWa8', '2025-04-10 16:55:56', '2025-04-10 10:52:40'),
(4, 'mdabd1522@gmail.com', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1kYWJkMTUyMkBnbWFpbC5jb20iLCJyb2xlIjoidGVhY2hlciIsImlhdCI6MTc1MTQ0NTI4MywiZXhwIjoxNzUxNDQ4ODgzfQ.5XUkusRDT-4-8myYjM9V3Czi9PhtqAGsOiQV3KHgJTI', '2025-07-02 14:34:43', '2025-07-02 08:34:43');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('teacher','student','admin') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `created_at`) VALUES
(1, 'John', 'john@example.com', '$2b$10$LeljaecgOo0.eAY7a0/0welNknxE8ESFrutcxi/zH.zwgONFlR8Gy', 'student', '2025-04-08 10:27:44'),
(2, 'Admin', 'admin@gmail.com', '$2y$10$Hmsz1seSgXGorM2Rhn/rUeIwjhU0WZ40HiKV/1/gIlDlfVPaQ97Fu', 'admin', '2025-04-10 10:07:05'),
(3, 'Sheikh', 'ssab8910@gmail.com', '$2b$10$CRYl1nGIwUM1SVUErpCQIuEuMNitni4nSKAgrlrVRCnTHOdw8o7de', 'teacher', '2025-04-10 11:48:52'),
(4, 'Abdullah', 'mdabd1552@gmail.com', '$2b$10$M.mFp7oZCxbMqNWRV8nbAOMbZNeBz0NXfKAmKyVkeH.MWpuYU4xlC', 'student', '2025-04-20 11:05:47'),
(5, 'Testing ', 'testing@gmail.com', 'admin@123', 'student', '2025-04-20 11:08:15'),
(6, 'Testing1', 'testing1@gmail.com', '$2b$10$M.mFp7oZCxbMqNWRV8nbAOMbZNeBz0NXfKAmKyVkeH.MWpuYU4xlC', 'student', '2025-04-20 11:08:55'),
(7, 'tester', 'tester006900@gmail.com', '$2b$10$xLZAlE2jCS443dCD8j.lSOZI0d8yOiJuA8EwLTj9ofN7VadBhbEUC', 'teacher', '2025-04-29 20:03:12'),
(17, 'test', 'test@gmail.com', '$2b$10$1862QgaL7EHgQCYW9KcByuYf4aW4U8hHDFfmvnnt5vMVeMKDPICCS', 'student', '2025-06-30 22:57:45'),
(18, 'Testtt', 'testinggg@gmail.com', '$2b$10$RREZ9/LBjs/q6lNpKBePn.C5SD5wC4bPgjLyjTwfAbdZaACNals32', 'student', '2025-07-02 05:13:18'),
(19, 'Wed', 'wed@gmail.com', '$2b$10$BBt5hhNmKyEYvb127ckuSeeahI2ENu13KWDzLJZol2nHtviK.JlGa', 'student', '2025-07-02 05:17:51'),
(20, 'Faseeh test', 'agaseeh270@gmail.com', '$2b$10$mrkxnALEWrQGVsTEduFhZe6ThKkfG6Ez2Xh70YYh62GKIxOhkXCJy', 'student', '2025-07-02 08:46:30'),
(52, 'VA Test', 'vateam@rmmarketing.ca', '$2b$10$7nQuesZ31fGrHSToLZXHTeYpDk0ojmy/0gb/ytbC3eXEAYVAtzzpy', 'student', '2025-07-02 08:58:42'),
(53, 'Va Test', 'thehelpdesk89@gmail.com', '$2b$10$p78n3Z0/lj760jGXHdKMS.5JE/H69yk0Xvtay7N6739P9MRe8Ulm2', 'student', '2025-07-02 09:01:24');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `ai_generation_logs`
--
ALTER TABLE `ai_generation_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `teacher_id` (`teacher_id`),
  ADD KEY `quiz_id` (`quiz_id`);

--
-- Indexes for table `assigned_teachers`
--
ALTER TABLE `assigned_teachers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_assignment` (`class_id`,`teacher_id`),
  ADD KEY `teacher_id` (`teacher_id`);

--
-- Indexes for table `classes`
--
ALTER TABLE `classes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `class_quizzes`
--
ALTER TABLE `class_quizzes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `class_id` (`class_id`),
  ADD KEY `quiz_id` (`quiz_id`),
  ADD KEY `assigned_by` (`assigned_by`);

--
-- Indexes for table `class_students`
--
ALTER TABLE `class_students`
  ADD PRIMARY KEY (`id`),
  ADD KEY `class_id` (`class_id`),
  ADD KEY `student_id` (`student_id`);

--
-- Indexes for table `options`
--
ALTER TABLE `options`
  ADD PRIMARY KEY (`id`),
  ADD KEY `question_id` (`question_id`);

--
-- Indexes for table `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `quiz_id` (`quiz_id`);

--
-- Indexes for table `quizzes`
--
ALTER TABLE `quizzes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `quiz_analytics`
--
ALTER TABLE `quiz_analytics`
  ADD PRIMARY KEY (`id`),
  ADD KEY `class_id` (`class_id`),
  ADD KEY `topic_id` (`topic_id`);

--
-- Indexes for table `quiz_assignments`
--
ALTER TABLE `quiz_assignments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `quiz_id` (`quiz_id`),
  ADD KEY `student_id` (`student_id`);

--
-- Indexes for table `quiz_attempts`
--
ALTER TABLE `quiz_attempts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `quiz_id` (`quiz_id`),
  ADD KEY `class_id` (`class_id`);

--
-- Indexes for table `quiz_results`
--
ALTER TABLE `quiz_results`
  ADD PRIMARY KEY (`id`),
  ADD KEY `quiz_id` (`quiz_id`),
  ADD KEY `student_id` (`student_id`);

--
-- Indexes for table `quiz_warnings`
--
ALTER TABLE `quiz_warnings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `assignment_id` (`assignment_id`);

--
-- Indexes for table `student_answers`
--
ALTER TABLE `student_answers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `assignment_id` (`assignment_id`),
  ADD KEY `question_id` (`question_id`),
  ADD KEY `selected_option_id` (`selected_option_id`);

--
-- Indexes for table `teacher_invites`
--
ALTER TABLE `teacher_invites`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `ai_generation_logs`
--
ALTER TABLE `ai_generation_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `assigned_teachers`
--
ALTER TABLE `assigned_teachers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `classes`
--
ALTER TABLE `classes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `class_quizzes`
--
ALTER TABLE `class_quizzes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `class_students`
--
ALTER TABLE `class_students`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `options`
--
ALTER TABLE `options`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=74;

--
-- AUTO_INCREMENT for table `questions`
--
ALTER TABLE `questions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `quizzes`
--
ALTER TABLE `quizzes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `quiz_analytics`
--
ALTER TABLE `quiz_analytics`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `quiz_assignments`
--
ALTER TABLE `quiz_assignments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `quiz_attempts`
--
ALTER TABLE `quiz_attempts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `quiz_results`
--
ALTER TABLE `quiz_results`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `quiz_warnings`
--
ALTER TABLE `quiz_warnings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `student_answers`
--
ALTER TABLE `student_answers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `teacher_invites`
--
ALTER TABLE `teacher_invites`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `ai_generation_logs`
--
ALTER TABLE `ai_generation_logs`
  ADD CONSTRAINT `ai_generation_logs_ibfk_1` FOREIGN KEY (`teacher_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `ai_generation_logs_ibfk_2` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`);

--
-- Constraints for table `assigned_teachers`
--
ALTER TABLE `assigned_teachers`
  ADD CONSTRAINT `assigned_teachers_ibfk_1` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`),
  ADD CONSTRAINT `assigned_teachers_ibfk_2` FOREIGN KEY (`teacher_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `class_quizzes`
--
ALTER TABLE `class_quizzes`
  ADD CONSTRAINT `class_quizzes_ibfk_1` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`),
  ADD CONSTRAINT `class_quizzes_ibfk_2` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`),
  ADD CONSTRAINT `class_quizzes_ibfk_3` FOREIGN KEY (`assigned_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `class_students`
--
ALTER TABLE `class_students`
  ADD CONSTRAINT `class_students_ibfk_1` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`),
  ADD CONSTRAINT `class_students_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `options`
--
ALTER TABLE `options`
  ADD CONSTRAINT `options_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`);

--
-- Constraints for table `questions`
--
ALTER TABLE `questions`
  ADD CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`);

--
-- Constraints for table `quizzes`
--
ALTER TABLE `quizzes`
  ADD CONSTRAINT `quizzes_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `quiz_analytics`
--
ALTER TABLE `quiz_analytics`
  ADD CONSTRAINT `quiz_analytics_ibfk_1` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`),
  ADD CONSTRAINT `quiz_analytics_ibfk_2` FOREIGN KEY (`topic_id`) REFERENCES `topics` (`id`);

--
-- Constraints for table `quiz_assignments`
--
ALTER TABLE `quiz_assignments`
  ADD CONSTRAINT `quiz_assignments_ibfk_1` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`),
  ADD CONSTRAINT `quiz_assignments_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `quiz_attempts`
--
ALTER TABLE `quiz_attempts`
  ADD CONSTRAINT `quiz_attempts_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `quiz_attempts_ibfk_2` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`),
  ADD CONSTRAINT `quiz_attempts_ibfk_3` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`);

--
-- Constraints for table `quiz_results`
--
ALTER TABLE `quiz_results`
  ADD CONSTRAINT `quiz_results_ibfk_1` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`),
  ADD CONSTRAINT `quiz_results_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `quiz_warnings`
--
ALTER TABLE `quiz_warnings`
  ADD CONSTRAINT `quiz_warnings_ibfk_1` FOREIGN KEY (`assignment_id`) REFERENCES `quiz_assignments` (`id`);

--
-- Constraints for table `student_answers`
--
ALTER TABLE `student_answers`
  ADD CONSTRAINT `student_answers_ibfk_1` FOREIGN KEY (`assignment_id`) REFERENCES `quiz_assignments` (`id`),
  ADD CONSTRAINT `student_answers_ibfk_2` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`),
  ADD CONSTRAINT `student_answers_ibfk_3` FOREIGN KEY (`selected_option_id`) REFERENCES `options` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
