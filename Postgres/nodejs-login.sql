-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Feb 20, 2022 at 07:45 PM
-- Server version: 5.7.24
-- PHP Version: 7.4.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `nodejs-login`
--

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `Recommended` text,
  `Watchlist` text,
  `profile_img` varchar(255) DEFAULT NULL,
  `Joined` text NOT NULL,
  `Verfication` varchar(4202) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `Recommended`, `Watchlist`, `profile_img`, `Joined`, `Verfication`) VALUES
(24, 'Omar Ahmad', 'wafsal@txtg.site', '$2a$08$CtFsV64Zr5GtFG8hqYs0bO5N1pJ1tZxZaU8NJg0l5ZJo0UeXG1lXq', NULL, NULL, 'logo_128x128.png', '17-11-2021', NULL),
(25, '123', '123@gmail.com', '$2a$08$WLJ4y3FnCRNzx6vVBIOD1eN5Iq9j1xr9CnT0hV.jenyR2CLsMYBCy', NULL, NULL, NULL, '17-11-2021', NULL),
(28, 'Omar Ahmad', 'omar.dreke654@gmail.com', '$2a$08$vA/p.MRZM/LazasqtaZD1uAWzybPgYczSq.tyO/kjYquckunuX.Tu', '[\"106651\",\"93405\",\"38182\",\"67198\",\"580\",\"1429\",\"85937\",\"6\",\"97890\",\"94664\",\"82596\",\"115036\",\"77169\",\"88329\",\"80986\"]', '[\"71712\",\"94605\",\"106651\",\"113987\",\"88329\",\"93405\",\"38182\",\"1855\",\"580\",\"94664\",\"82596\",\"115036\"]', 'Omen_artwork.png', '4-0-2022', 'verifed'),
(29, 'Åmar Ahmad', 'uahmed.4010s@gmailya.com', '$2a$08$BU3QTtr4RBLIJC4q5vj/..YwiXq6XbYmaqAUT7CxLxaG7K2.h4HeW', '[\"106651\",\"93405\",\"38182\",\"67198\",\"580\",\"1429\",\"85937\",\"6\",\"97890\",\"94664\",\"82596\",\"115036\",\"77169\",\"88329\",\"80986\",\"110492\"]', '[\"71712\",\"94605\",\"106651\",\"113987\",\"88329\",\"93405\",\"38182\",\"1855\",\"580\",\"94664\",\"82596\",\"115036\",\"1434\",\"110492\"]', NULL, '22-0-2022', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
