-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Czas generowania: 06 Sty 2022, 03:46
-- Wersja serwera: 10.4.21-MariaDB
-- Wersja PHP: 8.0.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Baza danych: `dyplomowa_app`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `answers`
--

CREATE TABLE `answers` (
  `answer_id` text COLLATE utf8_polish_ci NOT NULL,
  `answer_name` text COLLATE utf8_polish_ci DEFAULT NULL,
  `answer_type` text COLLATE utf8_polish_ci NOT NULL,
  `answer_correct` tinyint(1) NOT NULL,
  `answer_addon` text COLLATE utf8_polish_ci DEFAULT NULL,
  `answer_addon_src` text COLLATE utf8_polish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Zrzut danych tabeli `answers`
--

INSERT INTO `answers` (`answer_id`, `answer_name`, `answer_type`, `answer_correct`, `answer_addon`, `answer_addon_src`) VALUES
('a1c0f909-3715-46ea-9adc-53756a637153', '', '', 0, NULL, ''),
('c888879b-7c89-4230-9840-6e66fd406dff', '', '', 0, NULL, ''),
('d6515880-b3ad-4e18-a5df-07e97e811eb0', '', 'with_audio', 0, NULL, 'static/uploads/audio/29-12-2021/penguinmusic-modern-chillout-12641.mp3'),
('e9fcbdb2-ed43-48cd-8b46-1c0142ea7939', 'A to jest zajebisty test tego pytania, zaznaczaj :)', 'text_one', 0, NULL, ''),
('d6970aa5-459e-42ba-8c9f-f321930b6cd7', '', 'with_image', 1, NULL, 'static/uploads/images/29-12-2021/Anno.jpg'),
('011afee9-94ba-46e0-b571-410ef7b05907', 'Grę Anno', 'text_one', 1, NULL, ''),
('33a166fc-7564-4045-815d-50a3e36ffa82', 'Grę Mario Bros', 'text_one', 0, NULL, ''),
('8e66f59f-b1d0-4031-89b8-40b805dd7818', 'Film o piratach', 'text_one', 0, NULL, ''),
('748d8bd6-f385-4c72-8d62-3485987b4eac', 'Wizualizację bitew wodnych', 'text_one', 0, NULL, ''),
('ad87edc8-cb99-4e43-a83c-616abeaed21c', 'Darmowy punkt', 'text_one', 1, NULL, ''),
('b2b9cf3e-52c1-4b19-b8f0-01e93cb2b58e', 'Zła odpowiedź', 'text_one', 0, NULL, ''),
('009a13c1-80cf-4817-9746-df26f8b4386b', 'Zła Odpowiedź', 'text_one', 0, NULL, ''),
('aef9127f-9a5f-4eba-83db-a4f0672e6ecc', 'Zła odpowiedź', 'text_one', 0, NULL, ''),
('b811294f-14f2-4e7e-b897-7d6dafca476c', 'muzykę', 'text_one', 1, NULL, ''),
('a526c3b0-3caf-4722-b4e6-68d24e553a23', 'szum morza', 'text_one', 0, NULL, ''),
('d4697039-c411-472a-b4db-eedf6bb439e4', 'kłótnię', 'text_one', 0, NULL, ''),
('0afc311c-bc98-405a-a5e8-58f58cc152e6', 'pracę silnika', 'text_one', 0, NULL, '');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `questions`
--

CREATE TABLE `questions` (
  `question_id` text COLLATE utf8_polish_ci NOT NULL,
  `question_name` text COLLATE utf8_polish_ci NOT NULL,
  `question_score` int(11) NOT NULL,
  `question_time` time NOT NULL,
  `question_type` text COLLATE utf8_polish_ci NOT NULL,
  `question_addon` text COLLATE utf8_polish_ci DEFAULT NULL,
  `question_addon_src` text COLLATE utf8_polish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Zrzut danych tabeli `questions`
--

INSERT INTO `questions` (`question_id`, `question_name`, `question_score`, `question_time`, `question_type`, `question_addon`, `question_addon_src`) VALUES
('c8c7f016-c258-458f-81e9-ed693de0f539', 'Ile ssaków jest na ziemi?', 0, '00:00:00', 'text_one', NULL, ''),
('b316e722-588d-4311-b7bc-1db082122d81', '', 0, '00:00:00', 'text_one', NULL, ''),
('a5f9b3ac-8d90-4fe5-83d2-47b7bf6b0f64', 'asd', 1, '18:38:00', 'with_audio', NULL, 'static/uploads/audio/29-12-2021/penguinmusic-modern-chillout-12641.mp3'),
('12546613-ce0b-4f3e-8c37-0c5f24fe4e60', 'Co przedstawia powyższy obraz?', 1, '00:20:00', 'with_image', NULL, 'static/uploads/images/04-01-2022/Anno.jpg'),
('56279050-aaf6-4851-8cdc-c5ea3cd536f3', 'Pytanie bonusowe, odpowiedź darmowy punkt jest poprawna . :)', 1, '00:20:00', 'text_one', NULL, ''),
('37787cff-4b2f-486c-b302-6f3ce133cbf2', 'Co słychać w powyższym pliku audio?', 1, '02:00:00', 'with_audio', NULL, 'static/uploads/audio/04-01-2022/embrace-12278.mp3');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `questions_answers`
--

CREATE TABLE `questions_answers` (
  `question_id` text COLLATE utf8_polish_ci NOT NULL,
  `answer_id` text COLLATE utf8_polish_ci NOT NULL,
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Zrzut danych tabeli `questions_answers`
--

INSERT INTO `questions_answers` (`question_id`, `answer_id`, `id`) VALUES
('c8c7f016-c258-458f-81e9-ed693de0f539', 'd6515880-b3ad-4e18-a5df-07e97e811eb0', 82),
('c8c7f016-c258-458f-81e9-ed693de0f539', 'e9fcbdb2-ed43-48cd-8b46-1c0142ea7939', 83),
('a5f9b3ac-8d90-4fe5-83d2-47b7bf6b0f64', 'd6970aa5-459e-42ba-8c9f-f321930b6cd7', 84),
('12546613-ce0b-4f3e-8c37-0c5f24fe4e60', '011afee9-94ba-46e0-b571-410ef7b05907', 85),
('12546613-ce0b-4f3e-8c37-0c5f24fe4e60', '33a166fc-7564-4045-815d-50a3e36ffa82', 86),
('12546613-ce0b-4f3e-8c37-0c5f24fe4e60', '8e66f59f-b1d0-4031-89b8-40b805dd7818', 87),
('12546613-ce0b-4f3e-8c37-0c5f24fe4e60', '748d8bd6-f385-4c72-8d62-3485987b4eac', 88),
('56279050-aaf6-4851-8cdc-c5ea3cd536f3', 'ad87edc8-cb99-4e43-a83c-616abeaed21c', 89),
('56279050-aaf6-4851-8cdc-c5ea3cd536f3', 'b2b9cf3e-52c1-4b19-b8f0-01e93cb2b58e', 90),
('56279050-aaf6-4851-8cdc-c5ea3cd536f3', '009a13c1-80cf-4817-9746-df26f8b4386b', 91),
('56279050-aaf6-4851-8cdc-c5ea3cd536f3', 'aef9127f-9a5f-4eba-83db-a4f0672e6ecc', 92),
('37787cff-4b2f-486c-b302-6f3ce133cbf2', 'b811294f-14f2-4e7e-b897-7d6dafca476c', 93),
('37787cff-4b2f-486c-b302-6f3ce133cbf2', 'a526c3b0-3caf-4722-b4e6-68d24e553a23', 94),
('37787cff-4b2f-486c-b302-6f3ce133cbf2', 'd4697039-c411-472a-b4db-eedf6bb439e4', 95),
('37787cff-4b2f-486c-b302-6f3ce133cbf2', '0afc311c-bc98-405a-a5e8-58f58cc152e6', 96);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `tests`
--

CREATE TABLE `tests` (
  `test_id` text COLLATE utf8_polish_ci DEFAULT NULL,
  `test_date` datetime NOT NULL,
  `test_name` text COLLATE utf8_polish_ci NOT NULL,
  `test_code` text COLLATE utf8_polish_ci NOT NULL,
  `test_points_total` int(11) NOT NULL,
  `test_type` text COLLATE utf8_polish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Zrzut danych tabeli `tests`
--

INSERT INTO `tests` (`test_id`, `test_date`, `test_name`, `test_code`, `test_points_total`, `test_type`) VALUES
('75e5e262-df4a-4aa7-afda-8d6f121ba676', '2021-12-17 16:29:00', 'asd', 'ee8659a8487e24cc', 0, 'PUBLIC'),
('75e5e262-df4a-4aa7-afda-8d6f121ba677', '2021-12-17 16:29:00', 'asd', 'ee8659a8487e24cd', 0, 'PUBLIC'),
('54df2b2d-4a70-4419-8a30-28e4c55652a4', '2021-12-25 20:05:00', 'xz', 'ecde26e6216ca0b0', 0, 'PRIVATE'),
('39951ab5-5921-4add-8388-f39de45ca7f8', '2021-12-16 17:17:00', 'asd', 'bde924aa87af51b4', 0, 'PUBLIC'),
('609bef83-12f6-4af2-a1f2-b31c78f1cb7c', '2021-12-17 17:27:00', 'sad', 'ec9f4138846043cf', 0, 'PUBLIC'),
('3c0f47d8-2aa9-48d1-a594-d7e8630522e9', '0000-00-00 00:00:00', '', 'c49cf0689b1e7004', 0, 'PUBLIC'),
('3ba74f82-ee3d-4cf8-8b7f-fde2b5103175', '2022-01-19 09:55:00', 'Podsumowanie działu', '2b6c6ac657333289', 0, 'PUBLIC');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `tests_questions`
--

CREATE TABLE `tests_questions` (
  `test_id` text COLLATE utf8_polish_ci NOT NULL,
  `question_id` text COLLATE utf8_polish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Zrzut danych tabeli `tests_questions`
--

INSERT INTO `tests_questions` (`test_id`, `question_id`) VALUES
('1b24383d-9cb1-4ba5-a234-822e024c9e59', '1'),
('75e5e262-df4a-4aa7-afda-8d6f121ba676', 'c8c7f016-c258-458f-81e9-ed693de0f539'),
('609bef83-12f6-4af2-a1f2-b31c78f1cb7c', 'b316e722-588d-4311-b7bc-1db082122d81'),
('75e5e262-df4a-4aa7-afda-8d6f121ba676', 'a5f9b3ac-8d90-4fe5-83d2-47b7bf6b0f64'),
('3ba74f82-ee3d-4cf8-8b7f-fde2b5103175', '12546613-ce0b-4f3e-8c37-0c5f24fe4e60'),
('3ba74f82-ee3d-4cf8-8b7f-fde2b5103175', '56279050-aaf6-4851-8cdc-c5ea3cd536f3'),
('3ba74f82-ee3d-4cf8-8b7f-fde2b5103175', '37787cff-4b2f-486c-b302-6f3ce133cbf2');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `test_participants`
--

CREATE TABLE `test_participants` (
  `id` int(11) NOT NULL,
  `user_id` text COLLATE utf8_polish_ci NOT NULL,
  `test_id` text COLLATE utf8_polish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Zrzut danych tabeli `test_participants`
--

INSERT INTO `test_participants` (`id`, `user_id`, `test_id`) VALUES
(3, '35d0f941-6c2e-4436-90d5-b6a858d242c2', '75e5e262-df4a-4aa7-afda-8d6f121ba676'),
(5, '35d0f941-6c2e-4436-90d5-b6a858d242c2', '3ba74f82-ee3d-4cf8-8b7f-fde2b5103175');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `users`
--

CREATE TABLE `users` (
  `user_id` text COLLATE utf8_polish_ci NOT NULL,
  `user_email` text COLLATE utf8_polish_ci NOT NULL,
  `user_full_name` text COLLATE utf8_polish_ci NOT NULL,
  `user_created_at` datetime NOT NULL,
  `user_role` text COLLATE utf8_polish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Zrzut danych tabeli `users`
--

INSERT INTO `users` (`user_id`, `user_email`, `user_full_name`, `user_created_at`, `user_role`) VALUES
('35d0f941-6c2e-4436-90d5-b6a858d242c2', 'jaroslawkudzia73@gmail.com', 'Jarosław', '2021-12-10 07:28:45', '[\"USER\"]');

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `answers`
--
ALTER TABLE `answers`
  ADD UNIQUE KEY `answer_id` (`answer_id`) USING HASH;

--
-- Indeksy dla tabeli `questions`
--
ALTER TABLE `questions`
  ADD UNIQUE KEY `question_id` (`question_id`) USING HASH;

--
-- Indeksy dla tabeli `questions_answers`
--
ALTER TABLE `questions_answers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `answer_id_2` (`answer_id`) USING HASH,
  ADD KEY `question_id` (`question_id`(1024)),
  ADD KEY `answer_id` (`answer_id`(1024));

--
-- Indeksy dla tabeli `tests`
--
ALTER TABLE `tests`
  ADD UNIQUE KEY `test_code` (`test_code`) USING HASH,
  ADD UNIQUE KEY `test_id` (`test_id`) USING HASH;

--
-- Indeksy dla tabeli `tests_questions`
--
ALTER TABLE `tests_questions`
  ADD UNIQUE KEY `question_id_2` (`question_id`) USING HASH,
  ADD KEY `test_id` (`test_id`(1024)),
  ADD KEY `question_id` (`question_id`(1024));

--
-- Indeksy dla tabeli `test_participants`
--
ALTER TABLE `test_participants`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`(100)),
  ADD UNIQUE KEY `user_email` (`user_email`(100));

--
-- AUTO_INCREMENT dla zrzuconych tabel
--

--
-- AUTO_INCREMENT dla tabeli `questions_answers`
--
ALTER TABLE `questions_answers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=97;

--
-- AUTO_INCREMENT dla tabeli `test_participants`
--
ALTER TABLE `test_participants`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
