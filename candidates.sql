-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jul 03, 2020 at 01:21 AM
-- Server version: 8.0.18
-- PHP Version: 7.3.17

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `candidates`
--

-- --------------------------------------------------------

--
-- Table structure for table `partycandidates`
--

CREATE TABLE `partycandidates` (
  `Acronym` varchar(10) COLLATE utf8mb4_general_ci NOT NULL,
  `candidate_name` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `partycandidates`
--

INSERT INTO `partycandidates` (`Acronym`, `candidate_name`) VALUES
('A', 'Oba'),
('AA', 'yugfgfj'),
('AAC', 'ksjdksj'),
('ADC', 'jhshdsj'),
('ADP', 'jhvjuuo'),
('APC', 'kjsjkdsihjk'),
('APGA', NULL),
('APM', NULL),
('APP', 'jhfdjhfd'),
('BP', NULL),
('LP', NULL),
('NNPP', 'jhjhjhjhj'),
('NRM', NULL),
('PDP', 'iwueiw'),
('PRP', NULL),
('SDP', 'Ydjjb'),
('YPP', NULL),
('ZLP', 'hjhjj');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `partycandidates`
--
ALTER TABLE `partycandidates`
  ADD PRIMARY KEY (`Acronym`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
