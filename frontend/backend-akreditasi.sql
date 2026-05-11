-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: May 11, 2026 at 09:52 PM
-- Server version: 8.0.30
-- PHP Version: 8.3.22

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `backend-akreditasi`
--

-- --------------------------------------------------------

--
-- Table structure for table `1a1_pimpinan_dan_tupoksi`
--

CREATE TABLE `1a1_pimpinan_dan_tupoksi` (
  `id_pimpinan` int NOT NULL,
  `id_pegawai` int NOT NULL,
  `periode_mulai` year NOT NULL,
  `periode_selesai` year NOT NULL,
  `tupoksi` text,
  `sks_jabatan` decimal(4,2) DEFAULT '0.00',
  `id_jafung` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `1a1_pimpinan_dan_tupoksi`
--

INSERT INTO `1a1_pimpinan_dan_tupoksi` (`id_pimpinan`, `id_pegawai`, `periode_mulai`, `periode_selesai`, `tupoksi`, `sks_jabatan`, `id_jafung`, `created_at`, `created_by`, `updated_at`, `updated_by`, `deleted_at`, `deleted_by`) VALUES
(1, 2, 2023, 2024, 'blablabla', '7.00', NULL, '2026-04-15 09:18:08', 3, NULL, NULL, NULL, NULL),
(2, 1, 2024, 2026, 'bla', '0.00', NULL, '2026-04-15 09:19:41', 3, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `1a2_sumber_pendanaan_upps`
--

CREATE TABLE `1a2_sumber_pendanaan_upps` (
  `id_sumber` int NOT NULL,
  `id_prodi` int NOT NULL,
  `nama_sumber` varchar(255) NOT NULL,
  `jumlah_dana` int NOT NULL COMMENT 'Dalam jutaan rupiah',
  `link_bukti` varchar(255) NOT NULL,
  `id_tahun` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `1a2_sumber_pendanaan_upps`
--

INSERT INTO `1a2_sumber_pendanaan_upps` (`id_sumber`, `id_prodi`, `nama_sumber`, `jumlah_dana`, `link_bukti`, `id_tahun`, `created_at`, `created_by`, `updated_at`, `updated_by`, `deleted_at`, `deleted_by`) VALUES
(1, 1, 'SPP Mahasiswa', 15000000, 'https://vsdg', 3, '2026-04-13 12:08:40', 3, NULL, NULL, NULL, NULL),
(2, 1, 'SPP Mahasiswa', 5000000, 'https://ghhjh.gdrive', 2, '2026-04-29 08:01:37', 3, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `1a3_penggunaan_dana_upps`
--

CREATE TABLE `1a3_penggunaan_dana_upps` (
  `id_penggunaan` int NOT NULL,
  `id_prodi` int NOT NULL,
  `nama_penggunaan` varchar(255) NOT NULL COMMENT 'Contoh: Pendidikan, Penelitian, PkM, dll',
  `jumlah_dana` int DEFAULT '0' COMMENT 'Dalam jutaan rupiah',
  `link_bukti` varchar(255) NOT NULL,
  `id_tahun` int NOT NULL COMMENT 'Tahun Akademik (TS)',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `1a3_penggunaan_dana_upps`
--

INSERT INTO `1a3_penggunaan_dana_upps` (`id_penggunaan`, `id_prodi`, `nama_penggunaan`, `jumlah_dana`, `link_bukti`, `id_tahun`, `created_at`, `created_by`, `updated_at`, `updated_by`, `deleted_at`, `deleted_by`) VALUES
(1, 1, 'Lomba Mahasiswa', 3000000, 'https://ghhjh.gdrive', 3, '2026-04-14 05:36:51', 3, '2026-04-21 20:04:58', NULL, NULL, NULL),
(2, 1, 'Lomba Mahasiswa', 2000000, 'https://ghhjh.gdrive', 2, '2026-04-14 05:37:07', 3, '2026-04-21 20:07:54', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `1a4_beban_dtpr`
--

CREATE TABLE `1a4_beban_dtpr` (
  `id_beban_kerja` int NOT NULL,
  `id_dosen` int NOT NULL,
  `id_pimpinan` int DEFAULT NULL,
  `sks_ps_sendiri` decimal(4,2) DEFAULT '0.00',
  `sks_ps_lain` decimal(4,2) DEFAULT '0.00',
  `sks_pt_lain` decimal(4,2) DEFAULT '0.00',
  `sks_penelitian` decimal(4,2) DEFAULT '0.00',
  `sks_pkm` decimal(4,2) DEFAULT '0.00',
  `sks_manajemen_pt_lain` decimal(4,2) DEFAULT '0.00',
  `id_tahun` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `1a4_beban_dtpr`
--

INSERT INTO `1a4_beban_dtpr` (`id_beban_kerja`, `id_dosen`, `id_pimpinan`, `sks_ps_sendiri`, `sks_ps_lain`, `sks_pt_lain`, `sks_penelitian`, `sks_pkm`, `sks_manajemen_pt_lain`, `id_tahun`, `created_at`, `created_by`, `updated_at`, `updated_by`, `deleted_at`, `deleted_by`) VALUES
(1, 2, 1, '1.00', '1.00', '1.00', '1.00', '1.00', '1.00', 1, '2026-04-08 07:02:44', 3, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `1a5_kualifikasi_tendik`
--

CREATE TABLE `1a5_kualifikasi_tendik` (
  `id_1a5` int NOT NULL,
  `id_prodi` int NOT NULL,
  `id_tahun` int NOT NULL,
  `id_tendik` int NOT NULL,
  `pendidikan_snapshot` varchar(50) NOT NULL,
  `jenis_tendik_snapshot` varchar(100) NOT NULL,
  `nama_unit_snapshot` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `1a5_kualifikasi_tendik`
--

INSERT INTO `1a5_kualifikasi_tendik` (`id_1a5`, `id_prodi`, `id_tahun`, `id_tendik`, `pendidikan_snapshot`, `jenis_tendik_snapshot`, `nama_unit_snapshot`, `created_at`, `created_by`, `updated_at`, `updated_by`, `deleted_at`, `deleted_by`) VALUES
(1, 1, 3, 2, 'S1', 'Laboran/Teknisi', 'SISFO', '2026-04-16 06:44:24', 3, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `1b_unit_spmi_dan_sdm`
--

CREATE TABLE `1b_unit_spmi_dan_sdm` (
  `id_unit_spmi` int NOT NULL,
  `jenis_unit` varchar(50) DEFAULT NULL,
  `dokumen_spmi` varchar(255) DEFAULT NULL COMMENT 'Link Dokumen SPMI',
  `jumlah_auditor` int DEFAULT '0',
  `auditor_certified` int DEFAULT '0',
  `auditor_non_certified` int DEFAULT '0',
  `frekuensi_audit` int DEFAULT '0' COMMENT 'Frekuensi Audit per Tahun',
  `bukti_certified_auditor` varchar(255) DEFAULT NULL COMMENT 'Link Bukti Sertifikat',
  `laporan_audit` varchar(255) DEFAULT NULL COMMENT 'Link Laporan Hasil Audit',
  `unit_kerja_id_unit` int NOT NULL,
  `tahun_akademik_id_tahun` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `1b_unit_spmi_dan_sdm`
--

INSERT INTO `1b_unit_spmi_dan_sdm` (`id_unit_spmi`, `jenis_unit`, `dokumen_spmi`, `jumlah_auditor`, `auditor_certified`, `auditor_non_certified`, `frekuensi_audit`, `bukti_certified_auditor`, `laporan_audit`, `unit_kerja_id_unit`, `tahun_akademik_id_tahun`, `created_at`, `created_by`, `updated_at`, `updated_by`, `deleted_at`, `deleted_by`) VALUES
(1, NULL, 'https://drjhgjyu', 2, 1, 1, 1, 'https://drjhgjyu', 'https://drjhgjyu', 2, 1, '2026-04-13 03:52:34', 3, '2026-04-13 04:44:58', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `2a1_data_mahasiswa`
--

CREATE TABLE `2a1_data_mahasiswa` (
  `id_2a1` int UNSIGNED NOT NULL,
  `prodi_id_prodi` int NOT NULL,
  `tahun_akademik_id_tahun` int NOT NULL,
  `daya_tampung` int UNSIGNED DEFAULT '0',
  `pendaftar` int UNSIGNED DEFAULT '0',
  `pendaftar_afirmasi` int UNSIGNED DEFAULT '0',
  `pendaftar_khusus` int UNSIGNED DEFAULT '0',
  `maba_reg_diterima` int UNSIGNED DEFAULT '0',
  `maba_reg_afirmasi` int UNSIGNED DEFAULT '0',
  `maba_reg_khusus` int UNSIGNED DEFAULT '0',
  `maba_rpl_diterima` int UNSIGNED DEFAULT '0',
  `maba_rpl_afirmasi` int UNSIGNED DEFAULT '0',
  `maba_rpl_khusus` int UNSIGNED DEFAULT '0',
  `aktif_reg_diterima` int UNSIGNED DEFAULT '0',
  `aktif_reg_afirmasi` int UNSIGNED DEFAULT '0',
  `aktif_reg_khusus` int UNSIGNED DEFAULT '0',
  `aktif_rpl_diterima` int UNSIGNED DEFAULT '0',
  `aktif_rpl_afirmasi` int UNSIGNED DEFAULT '0',
  `aktif_rpl_khusus` int UNSIGNED DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `pmb_deleted_at` datetime DEFAULT NULL,
  `pmb_deleted_by` int DEFAULT NULL,
  `ala_deleted_at` datetime DEFAULT NULL,
  `ala_deleted_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `2a1_data_mahasiswa`
--

INSERT INTO `2a1_data_mahasiswa` (`id_2a1`, `prodi_id_prodi`, `tahun_akademik_id_tahun`, `daya_tampung`, `pendaftar`, `pendaftar_afirmasi`, `pendaftar_khusus`, `maba_reg_diterima`, `maba_reg_afirmasi`, `maba_reg_khusus`, `maba_rpl_diterima`, `maba_rpl_afirmasi`, `maba_rpl_khusus`, `aktif_reg_diterima`, `aktif_reg_afirmasi`, `aktif_reg_khusus`, `aktif_rpl_diterima`, `aktif_rpl_afirmasi`, `aktif_rpl_khusus`, `created_at`, `created_by`, `updated_at`, `updated_by`, `pmb_deleted_at`, `pmb_deleted_by`, `ala_deleted_at`, `ala_deleted_by`) VALUES
(1, 1, 3, 96, 50, 0, 0, 45, 0, 0, 4, 0, 0, 500, 40, 3, 100, 1, 0, '2026-05-04 08:13:53', 4, '2026-05-05 06:08:20', 3, '2026-05-05 13:08:20', 3, NULL, NULL),
(2, 1, 2, 50, 100, 10, NULL, 30, 5, NULL, 20, 3, NULL, 400, 40, 0, 100, 20, 0, '2026-05-05 03:29:46', 3, '2026-05-11 18:52:57', 1, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `2b1_isi_pembelajaran`
--

CREATE TABLE `2b1_isi_pembelajaran` (
  `id_2b1` int NOT NULL,
  `id_mk` int NOT NULL,
  `id_pl` int NOT NULL,
  `id_tahun` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `2b1_isi_pembelajaran`
--

INSERT INTO `2b1_isi_pembelajaran` (`id_2b1`, `id_mk`, `id_pl`, `id_tahun`, `created_at`, `created_by`, `updated_at`, `updated_by`, `deleted_at`, `deleted_by`) VALUES
(5, 5, 5, 3, '2026-05-12 01:00:00', 3, NULL, NULL, NULL, NULL),
(6, 6, 6, 3, '2026-05-12 01:00:00', 3, NULL, NULL, NULL, NULL),
(7, 7, 7, 2, '2026-05-12 01:00:00', 3, NULL, NULL, NULL, NULL),
(8, 8, 8, 2, '2026-05-12 01:00:00', 3, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `2b2_pemetaan_cpl_pl`
--

CREATE TABLE `2b2_pemetaan_cpl_pl` (
  `id_2b2` int NOT NULL,
  `id_cpl` int NOT NULL,
  `id_pl` int NOT NULL,
  `id_tahun` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `2b2_pemetaan_cpl_pl`
--

INSERT INTO `2b2_pemetaan_cpl_pl` (`id_2b2`, `id_cpl`, `id_pl`, `id_tahun`, `created_at`, `created_by`, `updated_at`, `updated_by`, `deleted_at`, `deleted_by`) VALUES
(8, 2, 5, 7, '2026-05-11 20:51:18', NULL, NULL, NULL, NULL, NULL),
(9, 2, 5, 7, '2026-05-11 20:51:19', NULL, NULL, NULL, NULL, NULL),
(10, 2, 5, 7, '2026-05-11 20:51:19', NULL, NULL, NULL, NULL, NULL),
(11, 2, 5, 7, '2026-05-11 20:51:20', NULL, NULL, NULL, NULL, NULL),
(12, 2, 5, 7, '2026-05-11 20:51:20', NULL, NULL, NULL, NULL, NULL),
(13, 2, 6, 7, '2026-05-11 20:51:21', NULL, NULL, NULL, NULL, NULL),
(14, 2, 5, 7, '2026-05-11 20:51:21', NULL, NULL, NULL, NULL, NULL),
(15, 2, 6, 7, '2026-05-11 20:51:22', NULL, NULL, NULL, NULL, NULL),
(16, 2, 5, 7, '2026-05-11 20:51:23', NULL, NULL, NULL, NULL, NULL),
(17, 1, 5, 7, '2026-05-11 20:53:45', NULL, NULL, NULL, NULL, NULL),
(18, 1, 6, 7, '2026-05-11 20:53:46', NULL, NULL, NULL, NULL, NULL),
(19, 1, 5, 7, '2026-05-11 20:53:46', NULL, NULL, NULL, NULL, NULL),
(20, 1, 6, 7, '2026-05-11 20:53:47', NULL, NULL, NULL, NULL, NULL),
(21, 1, 5, 7, '2026-05-11 20:53:48', NULL, NULL, NULL, NULL, NULL),
(22, 1, 5, 7, '2026-05-11 20:54:37', NULL, NULL, NULL, NULL, NULL),
(23, 1, 5, 7, '2026-05-11 20:54:37', NULL, NULL, NULL, NULL, NULL),
(24, 1, 5, 7, '2026-05-11 20:54:37', NULL, NULL, NULL, NULL, NULL),
(25, 1, 5, 7, '2026-05-11 20:54:38', NULL, NULL, NULL, NULL, NULL),
(26, 1, 6, 7, '2026-05-11 20:54:39', NULL, NULL, NULL, NULL, NULL),
(27, 1, 5, 7, '2026-05-11 20:54:39', NULL, NULL, NULL, NULL, NULL),
(28, 1, 6, 7, '2026-05-11 20:54:39', NULL, NULL, NULL, NULL, NULL),
(29, 1, 5, 7, '2026-05-11 21:01:16', NULL, NULL, NULL, NULL, NULL),
(30, 1, 5, 7, '2026-05-11 21:02:11', NULL, NULL, NULL, NULL, NULL),
(31, 1, 5, 7, '2026-05-11 21:02:12', NULL, NULL, NULL, NULL, NULL),
(32, 1, 6, 7, '2026-05-11 21:02:12', NULL, NULL, NULL, NULL, NULL),
(33, 1, 5, 7, '2026-05-11 21:02:12', NULL, NULL, NULL, NULL, NULL),
(34, 1, 5, 7, '2026-05-11 21:02:32', NULL, NULL, NULL, NULL, NULL),
(35, 1, 5, 7, '2026-05-11 21:02:32', NULL, NULL, NULL, NULL, NULL),
(36, 1, 5, 7, '2026-05-11 21:02:32', NULL, NULL, NULL, NULL, NULL),
(37, 1, 5, 7, '2026-05-11 21:02:33', NULL, NULL, NULL, NULL, NULL),
(38, 1, 5, 7, '2026-05-11 21:02:33', NULL, NULL, NULL, NULL, NULL),
(39, 1, 5, 7, '2026-05-11 21:02:33', NULL, NULL, NULL, NULL, NULL),
(40, 1, 5, 7, '2026-05-11 21:02:33', NULL, NULL, NULL, NULL, NULL),
(41, 1, 5, 7, '2026-05-11 21:02:34', NULL, NULL, NULL, NULL, NULL),
(42, 1, 5, 7, '2026-05-11 21:02:34', NULL, NULL, NULL, NULL, NULL),
(43, 1, 5, 7, '2026-05-11 21:02:35', NULL, NULL, NULL, NULL, NULL),
(44, 1, 5, 7, '2026-05-11 21:02:35', NULL, NULL, NULL, NULL, NULL),
(45, 1, 5, 7, '2026-05-11 21:02:35', NULL, NULL, NULL, NULL, NULL),
(46, 1, 5, 7, '2026-05-11 21:02:39', NULL, NULL, NULL, NULL, NULL),
(47, 1, 5, 7, '2026-05-11 21:02:40', NULL, NULL, NULL, NULL, NULL),
(48, 1, 5, 7, '2026-05-11 21:02:40', NULL, NULL, NULL, NULL, NULL),
(49, 1, 5, 7, '2026-05-11 21:02:40', NULL, NULL, NULL, NULL, NULL),
(50, 1, 5, 7, '2026-05-11 21:02:40', NULL, NULL, NULL, NULL, NULL),
(51, 1, 5, 7, '2026-05-11 21:02:40', NULL, NULL, NULL, NULL, NULL),
(52, 2, 5, 7, '2026-05-11 21:03:29', NULL, NULL, NULL, NULL, NULL),
(53, 1, 5, 7, '2026-05-11 21:04:08', NULL, NULL, NULL, NULL, NULL),
(54, 1, 5, 7, '2026-05-11 21:04:08', NULL, NULL, NULL, NULL, NULL),
(55, 1, 5, 7, '2026-05-11 21:04:08', NULL, NULL, NULL, NULL, NULL),
(56, 1, 5, 7, '2026-05-11 21:04:08', NULL, NULL, NULL, NULL, NULL),
(57, 1, 5, 7, '2026-05-11 21:04:09', NULL, NULL, NULL, NULL, NULL),
(58, 1, 5, 7, '2026-05-11 21:04:09', NULL, NULL, NULL, NULL, NULL),
(59, 1, 5, 7, '2026-05-11 21:04:09', NULL, NULL, NULL, NULL, NULL),
(60, 1, 5, 7, '2026-05-11 21:04:09', NULL, NULL, NULL, NULL, NULL),
(61, 1, 6, 7, '2026-05-11 21:04:14', NULL, NULL, NULL, NULL, NULL),
(62, 1, 5, 7, '2026-05-11 21:04:14', NULL, NULL, NULL, NULL, NULL),
(63, 1, 6, 7, '2026-05-11 21:04:15', NULL, NULL, NULL, NULL, NULL),
(64, 1, 5, 7, '2026-05-11 21:04:15', NULL, NULL, NULL, NULL, NULL),
(65, 1, 6, 7, '2026-05-11 21:04:15', NULL, NULL, NULL, NULL, NULL),
(66, 1, 5, 7, '2026-05-11 21:04:16', NULL, NULL, NULL, NULL, NULL),
(67, 1, 6, 7, '2026-05-11 21:04:16', NULL, NULL, NULL, NULL, NULL),
(68, 1, 5, 7, '2026-05-11 21:04:16', NULL, NULL, NULL, NULL, NULL),
(69, 1, 5, 7, '2026-05-11 21:04:31', NULL, NULL, NULL, NULL, NULL),
(70, 1, 5, 7, '2026-05-11 21:04:40', NULL, NULL, NULL, NULL, NULL),
(71, 1, 5, 7, '2026-05-11 21:04:40', NULL, NULL, NULL, NULL, NULL),
(72, 1, 5, 7, '2026-05-11 21:04:40', NULL, NULL, NULL, NULL, NULL),
(73, 1, 5, 7, '2026-05-11 21:04:41', NULL, NULL, NULL, NULL, NULL),
(74, 1, 5, 7, '2026-05-11 21:04:41', NULL, NULL, NULL, NULL, NULL),
(75, 1, 5, 7, '2026-05-11 21:04:58', NULL, NULL, NULL, NULL, NULL),
(76, 1, 5, 7, '2026-05-11 21:06:02', NULL, NULL, NULL, NULL, NULL),
(77, 1, 5, 7, '2026-05-11 21:06:02', NULL, NULL, NULL, NULL, NULL),
(78, 1, 5, 7, '2026-05-11 21:06:02', NULL, NULL, NULL, NULL, NULL),
(79, 1, 6, 7, '2026-05-11 21:06:03', NULL, NULL, NULL, NULL, NULL),
(80, 1, 6, 7, '2026-05-11 21:06:03', NULL, NULL, NULL, NULL, NULL),
(81, 1, 6, 7, '2026-05-11 21:06:03', NULL, NULL, NULL, NULL, NULL),
(82, 1, 6, 7, '2026-05-11 21:06:07', NULL, NULL, NULL, NULL, NULL),
(83, 1, 6, 7, '2026-05-11 21:06:07', NULL, NULL, NULL, NULL, NULL),
(84, 1, 6, 7, '2026-05-11 21:06:07', NULL, NULL, NULL, NULL, NULL),
(85, 1, 6, 7, '2026-05-11 21:06:08', NULL, NULL, NULL, NULL, NULL),
(86, 1, 6, 7, '2026-05-11 21:06:13', NULL, NULL, NULL, NULL, NULL),
(87, 1, 5, 7, '2026-05-11 21:06:19', NULL, NULL, NULL, NULL, NULL),
(88, 1, 5, 7, '2026-05-11 21:06:19', NULL, NULL, NULL, NULL, NULL),
(89, 1, 5, 7, '2026-05-11 21:06:19', NULL, NULL, NULL, NULL, NULL),
(90, 1, 5, 7, '2026-05-11 21:09:44', NULL, NULL, NULL, NULL, NULL),
(91, 1, 5, 7, '2026-05-11 21:09:52', NULL, NULL, NULL, NULL, NULL),
(92, 1, 5, 7, '2026-05-11 21:09:53', NULL, NULL, NULL, NULL, NULL),
(93, 1, 5, 7, '2026-05-11 21:09:53', NULL, NULL, NULL, NULL, NULL),
(94, 1, 5, 7, '2026-05-11 21:09:53', NULL, NULL, NULL, NULL, NULL),
(95, 1, 5, 7, '2026-05-11 21:09:53', NULL, NULL, NULL, NULL, NULL),
(96, 1, 5, 7, '2026-05-11 21:09:59', NULL, NULL, NULL, NULL, NULL),
(97, 1, 5, 7, '2026-05-11 21:10:00', NULL, NULL, NULL, NULL, NULL),
(98, 1, 5, 7, '2026-05-11 21:10:00', NULL, NULL, NULL, NULL, NULL),
(99, 1, 5, 7, '2026-05-11 21:10:00', NULL, NULL, NULL, NULL, NULL),
(100, 1, 5, 7, '2026-05-11 21:10:00', NULL, NULL, NULL, NULL, NULL),
(101, 1, 5, 7, '2026-05-11 21:10:00', NULL, NULL, NULL, NULL, NULL),
(102, 1, 5, 7, '2026-05-11 21:10:01', NULL, NULL, NULL, NULL, NULL),
(103, 1, 5, 7, '2026-05-11 21:10:01', NULL, NULL, NULL, NULL, NULL),
(104, 1, 5, 7, '2026-05-11 21:10:20', NULL, NULL, NULL, NULL, NULL),
(105, 1, 5, 7, '2026-05-11 21:10:20', NULL, NULL, NULL, NULL, NULL),
(106, 1, 5, 7, '2026-05-11 21:10:21', NULL, NULL, NULL, NULL, NULL),
(107, 1, 5, 7, '2026-05-11 21:10:21', NULL, NULL, NULL, NULL, NULL),
(108, 1, 5, 7, '2026-05-11 21:11:07', NULL, NULL, NULL, NULL, NULL),
(109, 1, 5, 7, '2026-05-11 21:11:18', NULL, NULL, NULL, NULL, NULL),
(110, 1, 5, 7, '2026-05-11 21:11:19', NULL, NULL, NULL, NULL, NULL),
(111, 1, 5, 7, '2026-05-11 21:11:19', NULL, NULL, NULL, NULL, NULL),
(112, 1, 5, 7, '2026-05-11 21:11:19', NULL, NULL, NULL, NULL, NULL),
(113, 1, 5, 7, '2026-05-11 21:11:19', NULL, NULL, NULL, NULL, NULL),
(114, 1, 5, 7, '2026-05-11 21:11:19', NULL, NULL, NULL, NULL, NULL),
(115, 1, 5, 7, '2026-05-11 21:11:20', NULL, NULL, NULL, NULL, NULL),
(116, 1, 5, 7, '2026-05-11 21:13:15', NULL, NULL, NULL, NULL, NULL),
(117, 1, 5, 7, '2026-05-11 21:13:15', NULL, NULL, NULL, NULL, NULL),
(118, 1, 5, 7, '2026-05-11 21:13:15', NULL, NULL, NULL, NULL, NULL),
(119, 1, 5, 7, '2026-05-11 21:13:15', NULL, NULL, NULL, NULL, NULL),
(120, 1, 5, 7, '2026-05-11 21:13:15', NULL, NULL, NULL, NULL, NULL),
(121, 1, 5, 7, '2026-05-11 21:13:16', NULL, NULL, NULL, NULL, NULL),
(122, 1, 5, 7, '2026-05-11 21:14:48', NULL, NULL, NULL, NULL, NULL),
(123, 1, 5, 7, '2026-05-11 21:16:16', NULL, NULL, NULL, NULL, NULL),
(124, 1, 5, 7, '2026-05-11 21:16:16', NULL, NULL, NULL, NULL, NULL),
(125, 1, 5, 7, '2026-05-11 21:16:16', NULL, NULL, NULL, NULL, NULL),
(126, 1, 5, 7, '2026-05-11 21:16:16', NULL, NULL, NULL, NULL, NULL),
(127, 1, 5, 7, '2026-05-11 21:16:16', NULL, NULL, NULL, NULL, NULL),
(128, 1, 5, 7, '2026-05-11 21:16:17', NULL, NULL, NULL, NULL, NULL),
(129, 1, 5, 7, '2026-05-11 21:16:17', NULL, NULL, NULL, NULL, NULL),
(130, 1, 5, 7, '2026-05-11 21:16:18', NULL, NULL, NULL, NULL, NULL),
(131, 1, 5, 7, '2026-05-11 21:16:18', NULL, NULL, NULL, NULL, NULL),
(132, 1, 5, 7, '2026-05-11 21:16:19', NULL, NULL, NULL, NULL, NULL),
(133, 1, 5, 7, '2026-05-11 21:16:19', NULL, NULL, NULL, NULL, NULL),
(134, 1, 5, 7, '2026-05-11 21:16:19', NULL, NULL, NULL, NULL, NULL),
(135, 1, 5, 7, '2026-05-11 21:16:19', NULL, NULL, NULL, NULL, NULL),
(136, 1, 5, 7, '2026-05-11 21:16:19', NULL, NULL, NULL, NULL, NULL),
(137, 1, 5, 7, '2026-05-11 21:16:19', NULL, NULL, NULL, NULL, NULL),
(138, 1, 5, 7, '2026-05-11 21:16:19', NULL, NULL, NULL, NULL, NULL),
(139, 1, 5, 7, '2026-05-11 21:16:20', NULL, NULL, NULL, NULL, NULL),
(140, 1, 5, 7, '2026-05-11 21:16:20', NULL, NULL, NULL, NULL, NULL),
(141, 1, 5, 7, '2026-05-11 21:16:20', NULL, NULL, NULL, NULL, NULL),
(142, 1, 5, 7, '2026-05-11 21:16:20', NULL, NULL, NULL, NULL, NULL),
(143, 1, 5, 7, '2026-05-11 21:16:20', NULL, NULL, NULL, NULL, NULL),
(144, 1, 5, 7, '2026-05-11 21:16:20', NULL, NULL, NULL, NULL, NULL),
(145, 1, 5, 7, '2026-05-11 21:16:21', NULL, NULL, NULL, NULL, NULL),
(146, 1, 5, 7, '2026-05-11 21:16:21', NULL, NULL, NULL, NULL, NULL),
(147, 1, 5, 7, '2026-05-11 21:16:21', NULL, NULL, NULL, NULL, NULL),
(148, 1, 5, 7, '2026-05-11 21:16:21', NULL, NULL, NULL, NULL, NULL),
(149, 1, 5, 7, '2026-05-11 21:16:21', NULL, NULL, NULL, NULL, NULL),
(150, 1, 5, 7, '2026-05-11 21:16:21', NULL, NULL, NULL, NULL, NULL),
(151, 1, 6, 7, '2026-05-11 21:16:22', NULL, NULL, NULL, NULL, NULL),
(152, 1, 5, 7, '2026-05-11 21:16:23', NULL, NULL, NULL, NULL, NULL),
(153, 1, 5, 7, '2026-05-11 21:16:23', NULL, NULL, NULL, NULL, NULL),
(154, 1, 5, 7, '2026-05-11 21:16:23', NULL, NULL, NULL, NULL, NULL),
(155, 1, 5, 7, '2026-05-11 21:16:24', NULL, NULL, NULL, NULL, NULL),
(156, 1, 5, 7, '2026-05-11 21:26:29', NULL, NULL, NULL, NULL, NULL),
(157, 1, 5, 7, '2026-05-11 21:31:33', NULL, NULL, NULL, NULL, NULL),
(158, 1, 5, 7, '2026-05-11 21:32:59', NULL, NULL, NULL, NULL, NULL),
(159, 1, 5, 7, '2026-05-11 21:33:21', NULL, NULL, NULL, NULL, NULL),
(160, 1, 6, 7, '2026-05-11 21:33:24', NULL, NULL, NULL, NULL, NULL),
(161, 1, 5, 7, '2026-05-11 21:34:23', NULL, NULL, NULL, NULL, NULL),
(162, 1, 5, 7, '2026-05-11 21:35:27', NULL, NULL, NULL, NULL, NULL),
(163, 1, 5, 7, '2026-05-11 21:36:15', NULL, NULL, NULL, NULL, NULL),
(164, 1, 5, 7, '2026-05-11 21:36:43', NULL, NULL, NULL, NULL, NULL),
(165, 1, 5, 7, '2026-05-11 21:45:34', NULL, NULL, NULL, NULL, NULL),
(166, 1, 5, 7, '2026-05-11 21:45:48', NULL, NULL, NULL, NULL, NULL),
(167, 1, 5, 7, '2026-05-11 21:46:53', NULL, NULL, NULL, NULL, NULL),
(168, 1, 5, 2, '2026-05-11 21:50:08', NULL, NULL, NULL, NULL, NULL),
(169, 1, 6, 2, '2026-05-11 21:50:20', NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `2b3_peta_pemenuhan_cpl`
--

CREATE TABLE `2b3_peta_pemenuhan_cpl` (
  `id_2b3` int NOT NULL,
  `id_cpl` int NOT NULL,
  `id_cpmk` int NOT NULL,
  `id_mk` int NOT NULL,
  `id_tahun` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `2b4_masa_tunggu`
--

CREATE TABLE `2b4_masa_tunggu` (
  `id_2b4` int NOT NULL,
  `id_prodi` int NOT NULL,
  `id_tahun` int NOT NULL COMMENT 'TS, TS-1, atau TS-2',
  `jumlah_lulusan` int UNSIGNED DEFAULT '0',
  `jumlah_terlacak` int UNSIGNED DEFAULT '0',
  `rata_tunggu` decimal(5,2) DEFAULT '0.00' COMMENT 'Dalam satuan bulan',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `2b4_masa_tunggu`
--

INSERT INTO `2b4_masa_tunggu` (`id_2b4`, `id_prodi`, `id_tahun`, `jumlah_lulusan`, `jumlah_terlacak`, `rata_tunggu`, `created_at`, `created_by`, `updated_at`, `updated_by`, `deleted_at`, `deleted_by`) VALUES
(1, 1, 3, 50, 20, '4.51', '2026-04-21 04:45:44', 3, '2026-04-22 04:19:45', 3, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `2b5_kesesuaian_kerja`
--

CREATE TABLE `2b5_kesesuaian_kerja` (
  `id_2b5` int NOT NULL,
  `id_2b4` int NOT NULL COMMENT 'Relasi ke data masa tunggu TS yang sama',
  `profesi_infokom` int UNSIGNED DEFAULT '0',
  `profesi_non_infokom` int UNSIGNED DEFAULT '0',
  `lingkup_multinasional` int UNSIGNED DEFAULT '0',
  `lingkup_nasional` int UNSIGNED DEFAULT '0',
  `lingkup_wirausaha` int UNSIGNED DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `2b5_kesesuaian_kerja`
--

INSERT INTO `2b5_kesesuaian_kerja` (`id_2b5`, `id_2b4`, `profesi_infokom`, `profesi_non_infokom`, `lingkup_multinasional`, `lingkup_nasional`, `lingkup_wirausaha`, `created_at`, `created_by`, `updated_at`, `updated_by`, `deleted_at`, `deleted_by`) VALUES
(2, 1, 5, 15, 4, 15, 1, '2026-04-22 04:15:32', 3, '2026-04-22 04:20:01', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `2b6_kepuasan_pengguna`
--

CREATE TABLE `2b6_kepuasan_pengguna` (
  `id_2b6` int NOT NULL,
  `id_prodi` int NOT NULL,
  `id_tahun` int NOT NULL,
  `jenis_kemampuan` varchar(100) NOT NULL,
  `sangat_baik` decimal(5,2) DEFAULT '0.00',
  `baik` decimal(5,2) DEFAULT '0.00',
  `cukup` decimal(5,2) DEFAULT '0.00',
  `kurang` decimal(5,2) DEFAULT '0.00',
  `rencana_tindak_lanjut` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `2b6_kepuasan_pengguna`
--

INSERT INTO `2b6_kepuasan_pengguna` (`id_2b6`, `id_prodi`, `id_tahun`, `jenis_kemampuan`, `sangat_baik`, `baik`, `cukup`, `kurang`, `rencana_tindak_lanjut`, `created_at`, `created_by`, `updated_at`, `updated_by`, `deleted_at`, `deleted_by`) VALUES
(1, 1, 3, 'Kerjasama Tim', '50.00', '10.00', '20.00', '20.00', 'eaa', '2026-04-22 07:54:49', 3, NULL, NULL, NULL, NULL),
(2, 1, 3, 'Keahlian di Bidang Prodi', '60.00', '20.00', '5.00', '15.00', 'eaa', '2026-04-22 07:54:49', 3, NULL, NULL, NULL, NULL),
(3, 1, 3, 'Kemampuan Berbahasa Asing (Inggris)', '70.00', '10.00', '10.00', '10.00', 'ea', '2026-04-22 07:54:49', 3, NULL, NULL, NULL, NULL),
(4, 1, 3, 'Kemampuan Berkomunikasi', '50.00', '20.00', '10.00', '20.00', 'eaaaa', '2026-04-22 07:54:49', 3, NULL, NULL, NULL, NULL),
(5, 1, 3, 'Pengembangan Diri', '40.00', '20.00', '20.00', '20.00', 'aaaa', '2026-04-22 07:54:49', 3, NULL, NULL, NULL, NULL),
(6, 1, 3, 'Kepemimpinan', '60.00', '5.00', '15.00', '20.00', 'eee', '2026-04-22 07:54:49', 3, NULL, NULL, NULL, NULL),
(7, 1, 3, 'Etos Kerja', '30.00', '50.00', '10.00', '10.00', 'aaaa', '2026-04-22 07:54:49', 3, '2026-04-22 08:11:14', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `2b6_metadata_lulusan`
--

CREATE TABLE `2b6_metadata_lulusan` (
  `id_metadata` int NOT NULL,
  `id_prodi` int NOT NULL,
  `id_tahun` int NOT NULL,
  `jml_alumni_3_tahun` int UNSIGNED DEFAULT '0',
  `jml_responden` int UNSIGNED DEFAULT '0',
  `jml_mhs_aktif_ts` int UNSIGNED DEFAULT '0',
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `2b6_metadata_lulusan`
--

INSERT INTO `2b6_metadata_lulusan` (`id_metadata`, `id_prodi`, `id_tahun`, `jml_alumni_3_tahun`, `jml_responden`, `jml_mhs_aktif_ts`, `updated_at`) VALUES
(1, 1, 3, 50, 30, 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `2d_ref_sumber_rekognisi`
--

CREATE TABLE `2d_ref_sumber_rekognisi` (
  `id_ref_sumber` int UNSIGNED NOT NULL,
  `nama_sumber` varchar(255) NOT NULL,
  `is_default` tinyint(1) DEFAULT '0' COMMENT '1 jika bawaan LKPS, 0 jika tambahan user',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `2d_ref_sumber_rekognisi`
--

INSERT INTO `2d_ref_sumber_rekognisi` (`id_ref_sumber`, `nama_sumber`, `is_default`, `created_at`) VALUES
(1, 'Masyarakat', 1, '2026-04-24 07:30:06'),
(2, 'Dunia Usaha', 1, '2026-04-24 07:30:06'),
(3, 'Dunia Industri', 1, '2026-04-24 07:30:06'),
(4, 'Dunia Kerja', 1, '2026-04-24 07:30:06');

-- --------------------------------------------------------

--
-- Table structure for table `2d_rekognisi_lulusan`
--

CREATE TABLE `2d_rekognisi_lulusan` (
  `id_2d` int UNSIGNED NOT NULL,
  `id_prodi` int NOT NULL,
  `id_tahun` int NOT NULL,
  `id_ref_sumber` int UNSIGNED NOT NULL,
  `jenis_rekognisi` text NOT NULL,
  `link_bukti` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `2d_rekognisi_lulusan`
--

INSERT INTO `2d_rekognisi_lulusan` (`id_2d`, `id_prodi`, `id_tahun`, `id_ref_sumber`, `jenis_rekognisi`, `link_bukti`, `created_at`, `created_by`, `updated_at`, `updated_by`, `deleted_at`, `deleted_by`) VALUES
(1, 1, 3, 1, 'Koding bersama STIKOM BALI', 'https://ghedug', '2026-04-24 07:47:55', 3, NULL, NULL, NULL, NULL),
(2, 1, 3, 2, 'Koding bersama STIKOM BANDUNG', 'https://ghedug', '2026-04-24 07:49:36', 3, NULL, NULL, NULL, NULL),
(3, 1, 1, 4, 'Koding bersama STIKOM Bnyuwangi', 'https://ghedug', '2026-04-24 07:50:13', 3, '2026-04-24 08:01:25', NULL, '2026-04-24 08:01:25', 3);

-- --------------------------------------------------------

--
-- Table structure for table `3a1_sarana_prasarana_penelitian`
--

CREATE TABLE `3a1_sarana_prasarana_penelitian` (
  `id_3a1` int NOT NULL,
  `id_prodi` int NOT NULL,
  `nama_prasarana` varchar(255) NOT NULL COMMENT 'Diisi nama laboratorium',
  `daya_tampung` int UNSIGNED DEFAULT '0',
  `luas_ruang` decimal(10,2) DEFAULT '0.00' COMMENT 'Dalam satuan m2',
  `status_milik` enum('M','W') NOT NULL DEFAULT 'M',
  `status_lisensi` enum('L','P','T') NOT NULL DEFAULT 'L',
  `perangkat` text COMMENT 'Hard/Soft-ware, bandwidth, device, tool, dll',
  `info_tambahan` text COMMENT 'Untuk mengisi kolom ..... di gambar',
  `link_bukti` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `3a1_sarana_prasarana_penelitian`
--

INSERT INTO `3a1_sarana_prasarana_penelitian` (`id_3a1`, `id_prodi`, `nama_prasarana`, `daya_tampung`, `luas_ruang`, `status_milik`, `status_lisensi`, `perangkat`, `info_tambahan`, `link_bukti`, `created_at`, `created_by`, `updated_at`, `updated_by`, `deleted_at`, `deleted_by`) VALUES
(1, 1, 'Laboratorium AI/Citra', 30, '100.00', 'M', 'L', 'PC HP', 'info info', 'https://ghhjh.gdrive', '2026-04-16 07:59:41', 3, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `3a2_penelitian_dtpr`
--

CREATE TABLE `3a2_penelitian_dtpr` (
  `id_3a2` int NOT NULL,
  `id_dosen` int NOT NULL,
  `id_tahun` int NOT NULL,
  `id_roadmap` int NOT NULL,
  `judul_penelitian` varchar(255) NOT NULL,
  `jumlah_mahasiswa` int DEFAULT '0',
  `jenis_hibah` varchar(100) DEFAULT NULL,
  `sumber` varchar(100) DEFAULT NULL,
  `durasi` int DEFAULT NULL,
  `jumlah_dana` int DEFAULT '0',
  `link_bukti` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `deleted_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `3a3_pengembangan_dtpr`
--

CREATE TABLE `3a3_pengembangan_dtpr` (
  `id_pengembangan` int NOT NULL,
  `id_dosen` int NOT NULL,
  `jenis_pengembangan` varchar(255) DEFAULT NULL,
  `nama_pengembangan` varchar(255) DEFAULT NULL,
  `link_bukti` varchar(255) DEFAULT NULL,
  `id_tahun` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `3a3_pengembangan_dtpr`
--

INSERT INTO `3a3_pengembangan_dtpr` (`id_pengembangan`, `id_dosen`, `jenis_pengembangan`, `nama_pengembangan`, `link_bukti`, `id_tahun`, `created_at`, `created_by`, `updated_at`, `updated_by`, `deleted_at`, `deleted_by`) VALUES
(1, 2, 'sertifikasi auditor', 'auditor nasional indonesia raya', 'https://ghhjh.gdrive', 3, '2026-04-09 03:19:19', 3, '2026-04-09 03:19:41', NULL, NULL, NULL),
(2, 2, 'sertifikasi marah marah', 'auditor marah marah', 'https://ghhjh.gdrive', 2, '2026-04-09 03:25:04', 3, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `3c1_kerjasama_penelitian`
--

CREATE TABLE `3c1_kerjasama_penelitian` (
  `id_3c1` int NOT NULL,
  `id_3a2` int NOT NULL,
  `id_tahun` int NOT NULL,
  `judul_kerjasama` varchar(255) NOT NULL,
  `mitra_kerja_sama` varchar(255) NOT NULL,
  `sumber` varchar(100) DEFAULT NULL,
  `durasi` int DEFAULT NULL,
  `jumlah_dana` int DEFAULT '0',
  `link_bukti` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `deleted_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `3c2_publikasi_penelitian`
--

CREATE TABLE `3c2_publikasi_penelitian` (
  `id_3c2` int NOT NULL,
  `id_3a2` int NOT NULL,
  `id_tahun` int NOT NULL,
  `judul_publikasi` varchar(255) NOT NULL,
  `jenis_publikasi` varchar(100) DEFAULT NULL,
  `link_bukti` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `deleted_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `3c3_perolehan_hki`
--

CREATE TABLE `3c3_perolehan_hki` (
  `id_3c3` int NOT NULL,
  `id_3a2` int NOT NULL,
  `id_tahun` int NOT NULL,
  `judul_hki` varchar(255) NOT NULL,
  `jenis_hki` varchar(100) NOT NULL,
  `link_bukti` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `deleted_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `4a1_sarana_prasarana_pkm`
--

CREATE TABLE `4a1_sarana_prasarana_pkm` (
  `id_4a1` int NOT NULL,
  `id_prodi` int NOT NULL,
  `nama_prasarana` varchar(255) NOT NULL COMMENT 'Diisi nama laboratorium, bengkel, dll',
  `daya_tampung` int UNSIGNED DEFAULT '0',
  `luas_ruang` decimal(10,2) DEFAULT '0.00',
  `status_milik` enum('M','W') NOT NULL DEFAULT 'M',
  `status_lisensi` enum('L','P','T') NOT NULL DEFAULT 'L',
  `perangkat` text COMMENT 'Hard/Soft-ware, bandwidth, device, tool, dll',
  `info_tambahan` text COMMENT 'Untuk mengisi kolom ..... di gambar',
  `link_bukti` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `4a1_sarana_prasarana_pkm`
--

INSERT INTO `4a1_sarana_prasarana_pkm` (`id_4a1`, `id_prodi`, `nama_prasarana`, `daya_tampung`, `luas_ruang`, `status_milik`, `status_lisensi`, `perangkat`, `info_tambahan`, `link_bukti`, `created_at`, `created_by`, `updated_at`, `updated_by`, `deleted_at`, `deleted_by`) VALUES
(1, 1, 'Laboratorium Basis Data', 30, '50.00', 'M', 'L', 'Meja dan Kursi', '', 'https://ghhjh.gdrive', '2026-04-16 08:31:42', 3, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `4a2_pkm_dtpr`
--

CREATE TABLE `4a2_pkm_dtpr` (
  `id_4a2` int NOT NULL,
  `id_dosen` int NOT NULL,
  `id_tahun` int NOT NULL,
  `id_roadmap` int NOT NULL,
  `judul_pkm` varchar(255) NOT NULL,
  `jumlah_mahasiswa` int DEFAULT '0',
  `jenis_hibah` varchar(100) DEFAULT NULL,
  `sumber` varchar(100) DEFAULT NULL,
  `durasi` int DEFAULT NULL,
  `jumlah_dana` int DEFAULT '0',
  `link_bukti` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `deleted_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `4c1_kerjasama_pkm`
--

CREATE TABLE `4c1_kerjasama_pkm` (
  `id_4c1` int NOT NULL,
  `id_4a2` int NOT NULL,
  `id_tahun` int NOT NULL,
  `judul_kerjasama` varchar(255) NOT NULL,
  `mitra_kerja_sama` varchar(255) NOT NULL,
  `sumber` varchar(100) DEFAULT NULL,
  `durasi` int DEFAULT NULL,
  `jumlah_dana` int DEFAULT '0',
  `link_bukti` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `deleted_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `4c2_diseminasi_hasil_pkm`
--

CREATE TABLE `4c2_diseminasi_hasil_pkm` (
  `id_4c2` int NOT NULL,
  `id_4a2` int NOT NULL,
  `id_tahun` int NOT NULL,
  `judul_diseminasi` varchar(255) NOT NULL,
  `tingkat_diseminasi` varchar(100) DEFAULT NULL,
  `link_bukti` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `deleted_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `4c3_perolehan_hki_pkm`
--

CREATE TABLE `4c3_perolehan_hki_pkm` (
  `id_4c3` int NOT NULL,
  `id_4a2` int NOT NULL,
  `id_tahun` int NOT NULL,
  `judul_hki` varchar(255) NOT NULL,
  `jenis_hki` varchar(100) NOT NULL,
  `link_bukti` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `deleted_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `5_2_sarana_prasarana_pendidikan`
--

CREATE TABLE `5_2_sarana_prasarana_pendidikan` (
  `id_5_2` int NOT NULL,
  `id_prodi` int NOT NULL,
  `nama_prasarana` varchar(255) NOT NULL COMMENT 'Ruang kelas, Lab, Perpustakaan, dsb',
  `daya_tampung` int UNSIGNED DEFAULT '0',
  `luas_ruang` decimal(10,2) DEFAULT '0.00',
  `status_milik` enum('M','W') NOT NULL DEFAULT 'M',
  `status_lisensi` enum('L','P','T') NOT NULL DEFAULT 'L',
  `perangkat` text COMMENT 'Hard/Soft-ware, bandwidth, device, tool, dll',
  `info_tambahan` text COMMENT 'Untuk mengisi kolom ..... di gambar',
  `link_bukti` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `5_2_sarana_prasarana_pendidikan`
--

INSERT INTO `5_2_sarana_prasarana_pendidikan` (`id_5_2`, `id_prodi`, `nama_prasarana`, `daya_tampung`, `luas_ruang`, `status_milik`, `status_lisensi`, `perangkat`, `info_tambahan`, `link_bukti`, `created_at`, `created_by`, `updated_at`, `updated_by`, `deleted_at`, `deleted_by`) VALUES
(1, 1, 'Laboratorium Pemrograman', 50, '200.00', 'M', 'L', 'Proyektor', '', 'https://ghhjh.gdrive', '2026-04-16 09:13:10', 3, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `6_visi_misi`
--

CREATE TABLE `6_visi_misi` (
  `id_vm` int NOT NULL,
  `id_prodi` int NOT NULL,
  `visi_pt` text,
  `misi_pt` text,
  `visi_upps` text,
  `misi_upps` text,
  `visi_keilmuan_ps` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `6_visi_misi`
--

INSERT INTO `6_visi_misi` (`id_vm`, `id_prodi`, `visi_pt`, `misi_pt`, `visi_upps`, `misi_upps`, `visi_keilmuan_ps`, `created_at`, `created_by`, `updated_at`, `updated_by`, `deleted_at`, `deleted_by`) VALUES
(1, 1, 'blablabla', 'blablabla', 'blabla', 'blabla', 'blabla', '2026-04-09 08:38:21', 3, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `dosen`
--

CREATE TABLE `dosen` (
  `id_dosen` int NOT NULL,
  `id_pegawai` int NOT NULL,
  `nidn` varchar(20) DEFAULT NULL,
  `nuptk` varchar(20) DEFAULT NULL,
  `id_prodi` int DEFAULT NULL,
  `perguruan_tinggi` varchar(150) DEFAULT 'STIKOM PGRI Banyuwangi',
  `id_jabatan_fungsional` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `dosen`
--

INSERT INTO `dosen` (`id_dosen`, `id_pegawai`, `nidn`, `nuptk`, `id_prodi`, `perguruan_tinggi`, `id_jabatan_fungsional`) VALUES
(1, 1, '0701018001', 'NUPTK001', 1, 'STIKOM PGRI Banyuwangi', 2),
(2, 2, '0702028502', 'NUPTK002', 1, 'STIKOM PGRI Banyuwangi', 2);

-- --------------------------------------------------------

--
-- Table structure for table `jabatan_fungsional`
--

CREATE TABLE `jabatan_fungsional` (
  `id_jafung` int NOT NULL,
  `nama_jafung` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `jabatan_fungsional`
--

INSERT INTO `jabatan_fungsional` (`id_jafung`, `nama_jafung`) VALUES
(1, 'Asisten Ahli'),
(2, 'Lektor'),
(3, 'Lektor Kepala');

-- --------------------------------------------------------

--
-- Table structure for table `jabatan_struktural`
--

CREATE TABLE `jabatan_struktural` (
  `id_jabatan_struktural` int NOT NULL,
  `nama_jabatan` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `jabatan_struktural`
--

INSERT INTO `jabatan_struktural` (`id_jabatan_struktural`, `nama_jabatan`) VALUES
(1, 'Ketua'),
(2, 'Staff');

-- --------------------------------------------------------

--
-- Table structure for table `master_cpl`
--

CREATE TABLE `master_cpl` (
  `id_cpl` int NOT NULL,
  `id_prodi` int NOT NULL,
  `kode_cpl` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `deskripsi_cpl` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `master_cpl`
--

INSERT INTO `master_cpl` (`id_cpl`, `id_prodi`, `kode_cpl`, `deskripsi_cpl`) VALUES
(1, 1, 'CPL-01', 'Mampu merancang dan mengembangkan perangkat lunak berkualitas'),
(2, 1, 'CPL-02', 'Mampu menganalisis kebutuhan sistem dan desain arsitektur perangkat lunak'),
(3, 2, 'CPL-03', 'Mampu mengelola sistem informasi berbasis komputer'),
(4, 2, 'CPL-04', 'Mampu menganalisis proses bisnis dan mengimplementasikan solusi TI'),
(5, 1, 'CPL-05', 'Mampu menerapkan konsep basis data tingkat lanjut'),
(6, 1, 'CPL-06', 'Mampu mengelola proyek perangkat lunak dengan metode agile'),
(7, 1, 'CPL-07', 'Mampu merancang antarmuka pengguna yang interaktif (UI/UX)'),
(8, 1, 'CPL-08', 'Mampu mengimplementasikan kecerdasan buatan dalam aplikasi'),
(9, 1, 'CPL-09', 'Mampu menjaga keamanan dan privasi data aplikasi'),
(10, 1, 'CPL-10', 'Mampu melakukan pengujian dan penjaminan kualitas perangkat lunak'),
(11, 1, 'CPL-11', 'Mampu mengelola infrastruktur jaringan dan komputasi awan'),
(12, 1, 'CPL-12', 'Mampu memecahkan masalah komputasi kompleks dengan algoritma efisien'),
(13, 1, 'CPL-13', 'Mampu menggunakan teknologi big data untuk analisis data'),
(14, 1, 'CPL-14', 'Mampu menerapkan etika profesi dalam bidang teknologi informasi'),
(15, 2, 'CPL-15', 'Mampu merumuskan strategi bisnis berbasis teknologi informasi'),
(16, 2, 'CPL-16', 'Mampu mengaudit sistem informasi perusahaan'),
(17, 2, 'CPL-17', 'Mampu mengelola tata kelola TI dengan standar industri (COBIT/ITIL)'),
(18, 2, 'CPL-18', 'Mampu merancang sistem ERP untuk efisiensi bisnis'),
(19, 2, 'CPL-19', 'Mampu menganalisis tren bisnis digital dan e-commerce'),
(20, 2, 'CPL-20', 'Mampu menerapkan sistem pendukung keputusan untuk manajemen'),
(21, 2, 'CPL-21', 'Mampu mengelola hubungan pelanggan (CRM) menggunakan teknologi'),
(22, 2, 'CPL-22', 'Mampu melakukan analisis risiko sistem informasi'),
(23, 2, 'CPL-23', 'Mampu menyusun rencana kesinambungan bisnis (BCP)'),
(24, 2, 'CPL-24', 'Mampu berkomunikasi secara efektif di lingkungan profesional');

-- --------------------------------------------------------

--
-- Table structure for table `master_cpmk`
--

CREATE TABLE `master_cpmk` (
  `id_cpmk` int NOT NULL,
  `id_prodi` int NOT NULL,
  `kode_cpmk` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `deskripsi_cpmk` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `master_mata_kuliah`
--

CREATE TABLE `master_mata_kuliah` (
  `id_mk` int NOT NULL,
  `id_prodi` int NOT NULL,
  `kode_mk` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `nama_mk` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `sks` int NOT NULL,
  `semester` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `master_mata_kuliah`
--

INSERT INTO `master_mata_kuliah` (`id_mk`, `id_prodi`, `kode_mk`, `nama_mk`, `sks`, `semester`) VALUES
(1, 1, 'IF101', 'Algoritma dan Pemrograman', 3, 1),
(2, 1, 'IF102', 'Struktur Data', 3, 2),
(3, 2, 'MI101', 'Pengantar Manajemen', 3, 1),
(4, 2, 'MI102', 'Sistem Informasi Manajemen', 3, 2),
(5, 1, 'IF101', 'Algoritma dan Pemrograman', 3, 1),
(6, 1, 'IF102', 'Struktur Data', 3, 2),
(7, 2, 'MI101', 'Pengantar Manajemen', 3, 1),
(8, 2, 'MI102', 'Sistem Informasi Manajemen', 3, 2);

-- --------------------------------------------------------

--
-- Table structure for table `master_profil_lulusan`
--

CREATE TABLE `master_profil_lulusan` (
  `id_pl` int NOT NULL,
  `id_prodi` int NOT NULL,
  `kode_pl` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `deskripsi_pl` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `master_profil_lulusan`
--

INSERT INTO `master_profil_lulusan` (`id_pl`, `id_prodi`, `kode_pl`, `deskripsi_pl`) VALUES
(5, 1, 'PL001', 'Mampu mengembangkan perangkat lunak'),
(6, 1, 'PL002', 'Mampu mengamankan sistem jaringan'),
(7, 2, 'PL003', 'Mampu mengelola sistem informasi'),
(8, 2, 'PL004', 'Mampu menganalisis kebutuhan bisnis'),
(9, 1, 'PL005', 'Software Engineer / Programmer'),
(10, 1, 'PL006', 'System Analyst / Systems Engineer'),
(11, 1, 'PL007', 'Database Administrator'),
(12, 1, 'PL008', 'Network Administrator'),
(13, 1, 'PL009', 'UI/UX Designer'),
(14, 1, 'PL010', 'Data Scientist / Data Analyst'),
(15, 1, 'PL011', 'DevOps Engineer'),
(16, 1, 'PL012', 'Cloud Solutions Architect'),
(17, 1, 'PL013', 'Artificial Intelligence Engineer'),
(18, 1, 'PL014', 'Cyber Security Specialist'),
(19, 2, 'PL015', 'IT Project Manager'),
(20, 2, 'PL016', 'Business Analyst'),
(21, 2, 'PL017', 'IT Consultant / Auditor'),
(22, 2, 'PL018', 'ERP Specialist'),
(23, 2, 'PL019', 'IT Support / Helpdesk Supervisor'),
(24, 2, 'PL020', 'E-Commerce Manager'),
(25, 2, 'PL021', 'Digital Marketing Strategist'),
(26, 2, 'PL022', 'IS/IT Manager'),
(27, 2, 'PL023', 'Risk Management Analyst'),
(28, 2, 'PL024', 'IT Compliance Officer');

-- --------------------------------------------------------

--
-- Table structure for table `master_sks_jabatan`
--

CREATE TABLE `master_sks_jabatan` (
  `id_sks_jabatan` int NOT NULL,
  `nama_pencarian` varchar(100) DEFAULT NULL,
  `sks` decimal(4,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `master_sks_jabatan`
--

INSERT INTO `master_sks_jabatan` (`id_sks_jabatan`, `nama_pencarian`, `sks`) VALUES
(1, 'Ketua STIKOM', '12.00'),
(2, 'Wakil Ketua STIKOM', '10.00'),
(3, 'Ketua Jurusan', '8.00'),
(4, 'Sekretaris Jurusan', '7.00'),
(5, 'Ketua Prodi', '7.00'),
(6, 'Sekretaris Prodi', '5.00'),
(7, 'Kepala Bagian', '4.00'),
(8, 'Kepala Sub Bagian', '2.00'),
(9, 'Ketua TPM', '4.00'),
(10, 'Staf', '0.00'),
(11, 'Non Struktural', '0.00');

-- --------------------------------------------------------

--
-- Table structure for table `pegawai`
--

CREATE TABLE `pegawai` (
  `id_pegawai` int NOT NULL,
  `nama_lengkap` varchar(255) NOT NULL,
  `nikp` varchar(50) DEFAULT NULL,
  `id_unit` int DEFAULT NULL,
  `id_jabatan_struktural` int DEFAULT NULL,
  `pendidikan_terakhir` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `pegawai`
--

INSERT INTO `pegawai` (`id_pegawai`, `nama_lengkap`, `nikp`, `id_unit`, `id_jabatan_struktural`, `pendidikan_terakhir`) VALUES
(1, 'Erdiyanto, M.Kom.', 'NIKP.001.2024', 1, 1, 'S2'),
(2, 'Rhegysa, M.T.', 'NIKP.002.2024', 9, 1, 'S2'),
(3, 'Budi Santoso, S.Kom.', 'NIKP.003.2024', 5, 2, 'S1');

-- --------------------------------------------------------

--
-- Table structure for table `prodi`
--

CREATE TABLE `prodi` (
  `id_prodi` int NOT NULL,
  `nama_prodi` varchar(100) NOT NULL,
  `id_unit` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `prodi`
--

INSERT INTO `prodi` (`id_prodi`, `nama_prodi`, `id_unit`) VALUES
(1, 'Teknik Informatika', 9),
(2, 'Manajemen Informatika', 9);

-- --------------------------------------------------------

--
-- Table structure for table `roadmap_lppm`
--

CREATE TABLE `roadmap_lppm` (
  `id_roadmap` int NOT NULL,
  `id_prodi` int NOT NULL,
  `id_tahun` int NOT NULL,
  `jenis_roadmap` varchar(100) NOT NULL,
  `link_dokumen` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `deleted_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tahun_akademik`
--

CREATE TABLE `tahun_akademik` (
  `id_tahun` int NOT NULL,
  `tahun` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `tahun_akademik`
--

INSERT INTO `tahun_akademik` (`id_tahun`, `tahun`) VALUES
(1, 2020),
(2, 2021),
(3, 2022),
(4, 2023),
(5, 2024),
(6, 2025),
(7, 2026),
(8, 2027),
(9, 2028),
(10, 2029),
(11, 2030),
(12, 2031),
(13, 2032),
(14, 2033),
(15, 2034),
(16, 2035),
(17, 2036),
(18, 2037),
(19, 2038),
(20, 2039),
(21, 2040),
(22, 2041),
(23, 2042),
(24, 2043),
(25, 2044),
(26, 2045),
(27, 2046),
(28, 2047),
(29, 2048),
(30, 2049),
(31, 2050),
(32, 2051),
(33, 2052),
(34, 2053),
(35, 2054),
(36, 2055),
(37, 2056),
(38, 2057),
(39, 2058),
(40, 2059),
(41, 2060),
(42, 2061),
(43, 2062),
(44, 2063),
(45, 2064),
(46, 2065),
(47, 2066),
(48, 2067),
(49, 2068),
(50, 2069),
(51, 2070),
(52, 2071),
(53, 2072),
(54, 2073),
(55, 2074),
(56, 2075),
(57, 2076),
(58, 2077),
(59, 2078),
(60, 2079),
(61, 2080),
(62, 2081),
(63, 2082),
(64, 2083),
(65, 2084),
(66, 2085),
(67, 2086),
(68, 2087),
(69, 2088),
(70, 2089),
(71, 2090),
(72, 2091),
(73, 2092),
(74, 2093),
(75, 2094),
(76, 2095),
(77, 2096),
(78, 2097),
(79, 2098),
(80, 2099),
(81, 2100);

-- --------------------------------------------------------

--
-- Table structure for table `tenaga_kependidikan`
--

CREATE TABLE `tenaga_kependidikan` (
  `id_tendik` int NOT NULL,
  `id_pegawai` int NOT NULL,
  `jenis_tendik` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `tenaga_kependidikan`
--

INSERT INTO `tenaga_kependidikan` (`id_tendik`, `id_pegawai`, `jenis_tendik`) VALUES
(2, 3, 'Laboran/Teknisi');

-- --------------------------------------------------------

--
-- Table structure for table `unit_kerja`
--

CREATE TABLE `unit_kerja` (
  `id_unit` int NOT NULL,
  `nama_unit` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `unit_kerja`
--

INSERT INTO `unit_kerja` (`id_unit`, `nama_unit`) VALUES
(1, 'UPPS'),
(2, 'TPM'),
(3, 'PMB'),
(4, 'SARPRAS'),
(5, 'SISFO'),
(6, 'ALA'),
(7, 'WAKET 2'),
(8, 'KEUANGAN'),
(9, 'PRODI'),
(10, 'KEMAHASISWAAN'),
(11, 'LPPM'),
(12, 'KEPEGAWAIAN'),
(13, 'ADMIN');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id_user` int NOT NULL,
  `id_unit` int NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id_user`, `id_unit`, `username`, `password`) VALUES
(1, 5, 'sisfo', '$2a$12$OV4aMPsI8KpzgyuLtbn.heVQiSsrYqfFliGmfOPd4BvlbUY.B.oa6'),
(2, 11, 'lppm', '$2a$12$OV4aMPsI8KpzgyuLtbn.heVQiSsrYqfFliGmfOPd4BvlbUY.B.oa6'),
(3, 13, 'admin', '$2a$12$OV4aMPsI8KpzgyuLtbn.heVQiSsrYqfFliGmfOPd4BvlbUY.B.oa6'),
(4, 3, 'pmb', '$2a$12$OV4aMPsI8KpzgyuLtbn.heVQiSsrYqfFliGmfOPd4BvlbUY.B.oa6'),
(5, 6, 'ala', '$2a$12$OV4aMPsI8KpzgyuLtbn.heVQiSsrYqfFliGmfOPd4BvlbUY.B.oa6');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `1a1_pimpinan_dan_tupoksi`
--
ALTER TABLE `1a1_pimpinan_dan_tupoksi`
  ADD PRIMARY KEY (`id_pimpinan`),
  ADD KEY `id_pegawai` (`id_pegawai`),
  ADD KEY `fk_1a1_jafung` (`id_jafung`);

--
-- Indexes for table `1a2_sumber_pendanaan_upps`
--
ALTER TABLE `1a2_sumber_pendanaan_upps`
  ADD PRIMARY KEY (`id_sumber`),
  ADD KEY `fk_1a2_tahun` (`id_tahun`);

--
-- Indexes for table `1a3_penggunaan_dana_upps`
--
ALTER TABLE `1a3_penggunaan_dana_upps`
  ADD PRIMARY KEY (`id_penggunaan`),
  ADD KEY `fk_1a3_tahun` (`id_tahun`);

--
-- Indexes for table `1a4_beban_dtpr`
--
ALTER TABLE `1a4_beban_dtpr`
  ADD PRIMARY KEY (`id_beban_kerja`),
  ADD KEY `id_dosen` (`id_dosen`),
  ADD KEY `id_pimpinan` (`id_pimpinan`),
  ADD KEY `id_tahun` (`id_tahun`);

--
-- Indexes for table `1a5_kualifikasi_tendik`
--
ALTER TABLE `1a5_kualifikasi_tendik`
  ADD PRIMARY KEY (`id_1a5`),
  ADD KEY `fk_1a5_prodi` (`id_prodi`),
  ADD KEY `fk_1a5_tahun` (`id_tahun`),
  ADD KEY `fk_1a5_tendik` (`id_tendik`);

--
-- Indexes for table `1b_unit_spmi_dan_sdm`
--
ALTER TABLE `1b_unit_spmi_dan_sdm`
  ADD PRIMARY KEY (`id_unit_spmi`),
  ADD KEY `fk_spmi_unit` (`unit_kerja_id_unit`),
  ADD KEY `fk_spmi_tahun` (`tahun_akademik_id_tahun`);

--
-- Indexes for table `2a1_data_mahasiswa`
--
ALTER TABLE `2a1_data_mahasiswa`
  ADD PRIMARY KEY (`id_2a1`),
  ADD UNIQUE KEY `idx_prodi_tahun` (`prodi_id_prodi`,`tahun_akademik_id_tahun`),
  ADD UNIQUE KEY `idx_unique_prodi_tahun` (`prodi_id_prodi`,`tahun_akademik_id_tahun`),
  ADD KEY `idx_2a1_prodi_tahun` (`prodi_id_prodi`,`tahun_akademik_id_tahun`),
  ADD KEY `fk_2a1_tahun` (`tahun_akademik_id_tahun`);

--
-- Indexes for table `2b1_isi_pembelajaran`
--
ALTER TABLE `2b1_isi_pembelajaran`
  ADD PRIMARY KEY (`id_2b1`),
  ADD KEY `fk_2b1_mk` (`id_mk`),
  ADD KEY `fk_2b1_pl` (`id_pl`),
  ADD KEY `fk_2b1_tahun` (`id_tahun`);

--
-- Indexes for table `2b2_pemetaan_cpl_pl`
--
ALTER TABLE `2b2_pemetaan_cpl_pl`
  ADD PRIMARY KEY (`id_2b2`),
  ADD KEY `fk_2b2_cpl` (`id_cpl`),
  ADD KEY `fk_2b2_pl` (`id_pl`),
  ADD KEY `fk_2b2_tahun` (`id_tahun`);

--
-- Indexes for table `2b3_peta_pemenuhan_cpl`
--
ALTER TABLE `2b3_peta_pemenuhan_cpl`
  ADD PRIMARY KEY (`id_2b3`),
  ADD KEY `fk_2b3_cpl` (`id_cpl`),
  ADD KEY `fk_2b3_cpmk` (`id_cpmk`),
  ADD KEY `fk_2b3_mk` (`id_mk`),
  ADD KEY `fk_2b3_tahun` (`id_tahun`);

--
-- Indexes for table `2b4_masa_tunggu`
--
ALTER TABLE `2b4_masa_tunggu`
  ADD PRIMARY KEY (`id_2b4`),
  ADD KEY `fk_2b4_prodi` (`id_prodi`),
  ADD KEY `fk_2b4_tahun` (`id_tahun`);

--
-- Indexes for table `2b5_kesesuaian_kerja`
--
ALTER TABLE `2b5_kesesuaian_kerja`
  ADD PRIMARY KEY (`id_2b5`),
  ADD KEY `fk_2b5_to_2b4` (`id_2b4`);

--
-- Indexes for table `2b6_kepuasan_pengguna`
--
ALTER TABLE `2b6_kepuasan_pengguna`
  ADD PRIMARY KEY (`id_2b6`);

--
-- Indexes for table `2b6_metadata_lulusan`
--
ALTER TABLE `2b6_metadata_lulusan`
  ADD PRIMARY KEY (`id_metadata`);

--
-- Indexes for table `2d_ref_sumber_rekognisi`
--
ALTER TABLE `2d_ref_sumber_rekognisi`
  ADD PRIMARY KEY (`id_ref_sumber`);

--
-- Indexes for table `2d_rekognisi_lulusan`
--
ALTER TABLE `2d_rekognisi_lulusan`
  ADD PRIMARY KEY (`id_2d`),
  ADD KEY `fk_2d_prodi_idx` (`id_prodi`),
  ADD KEY `fk_2d_tahun_idx` (`id_tahun`),
  ADD KEY `fk_2d_sumber_idx` (`id_ref_sumber`);

--
-- Indexes for table `3a1_sarana_prasarana_penelitian`
--
ALTER TABLE `3a1_sarana_prasarana_penelitian`
  ADD PRIMARY KEY (`id_3a1`),
  ADD KEY `fk_3a1_prodi` (`id_prodi`);

--
-- Indexes for table `3a2_penelitian_dtpr`
--
ALTER TABLE `3a2_penelitian_dtpr`
  ADD PRIMARY KEY (`id_3a2`),
  ADD KEY `fk_3a2_roadmap` (`id_roadmap`);

--
-- Indexes for table `3a3_pengembangan_dtpr`
--
ALTER TABLE `3a3_pengembangan_dtpr`
  ADD PRIMARY KEY (`id_pengembangan`),
  ADD KEY `id_dosen` (`id_dosen`),
  ADD KEY `id_tahun` (`id_tahun`);

--
-- Indexes for table `3c1_kerjasama_penelitian`
--
ALTER TABLE `3c1_kerjasama_penelitian`
  ADD PRIMARY KEY (`id_3c1`),
  ADD KEY `id_3a2` (`id_3a2`);

--
-- Indexes for table `3c2_publikasi_penelitian`
--
ALTER TABLE `3c2_publikasi_penelitian`
  ADD PRIMARY KEY (`id_3c2`),
  ADD KEY `id_3a2` (`id_3a2`);

--
-- Indexes for table `3c3_perolehan_hki`
--
ALTER TABLE `3c3_perolehan_hki`
  ADD PRIMARY KEY (`id_3c3`),
  ADD KEY `id_3a2` (`id_3a2`);

--
-- Indexes for table `4a1_sarana_prasarana_pkm`
--
ALTER TABLE `4a1_sarana_prasarana_pkm`
  ADD PRIMARY KEY (`id_4a1`),
  ADD KEY `fk_4a1_prodi` (`id_prodi`);

--
-- Indexes for table `4a2_pkm_dtpr`
--
ALTER TABLE `4a2_pkm_dtpr`
  ADD PRIMARY KEY (`id_4a2`),
  ADD KEY `fk_4a2_roadmap` (`id_roadmap`);

--
-- Indexes for table `4c1_kerjasama_pkm`
--
ALTER TABLE `4c1_kerjasama_pkm`
  ADD PRIMARY KEY (`id_4c1`),
  ADD KEY `id_4a2` (`id_4a2`);

--
-- Indexes for table `4c2_diseminasi_hasil_pkm`
--
ALTER TABLE `4c2_diseminasi_hasil_pkm`
  ADD PRIMARY KEY (`id_4c2`),
  ADD KEY `id_4a2` (`id_4a2`);

--
-- Indexes for table `4c3_perolehan_hki_pkm`
--
ALTER TABLE `4c3_perolehan_hki_pkm`
  ADD PRIMARY KEY (`id_4c3`),
  ADD KEY `id_4a2` (`id_4a2`);

--
-- Indexes for table `5_2_sarana_prasarana_pendidikan`
--
ALTER TABLE `5_2_sarana_prasarana_pendidikan`
  ADD PRIMARY KEY (`id_5_2`),
  ADD KEY `fk_5_2_prodi` (`id_prodi`);

--
-- Indexes for table `6_visi_misi`
--
ALTER TABLE `6_visi_misi`
  ADD PRIMARY KEY (`id_vm`),
  ADD KEY `id_prodi` (`id_prodi`);

--
-- Indexes for table `dosen`
--
ALTER TABLE `dosen`
  ADD PRIMARY KEY (`id_dosen`),
  ADD UNIQUE KEY `nidn` (`nidn`),
  ADD UNIQUE KEY `nuptk` (`nuptk`),
  ADD KEY `id_pegawai` (`id_pegawai`),
  ADD KEY `id_prodi` (`id_prodi`),
  ADD KEY `id_jabatan_fungsional` (`id_jabatan_fungsional`);

--
-- Indexes for table `jabatan_fungsional`
--
ALTER TABLE `jabatan_fungsional`
  ADD PRIMARY KEY (`id_jafung`);

--
-- Indexes for table `jabatan_struktural`
--
ALTER TABLE `jabatan_struktural`
  ADD PRIMARY KEY (`id_jabatan_struktural`);

--
-- Indexes for table `master_cpl`
--
ALTER TABLE `master_cpl`
  ADD PRIMARY KEY (`id_cpl`),
  ADD KEY `fk_cpl_prodi` (`id_prodi`);

--
-- Indexes for table `master_cpmk`
--
ALTER TABLE `master_cpmk`
  ADD PRIMARY KEY (`id_cpmk`),
  ADD KEY `fk_cpmk_prodi` (`id_prodi`);

--
-- Indexes for table `master_mata_kuliah`
--
ALTER TABLE `master_mata_kuliah`
  ADD PRIMARY KEY (`id_mk`),
  ADD KEY `fk_mk_prodi` (`id_prodi`);

--
-- Indexes for table `master_profil_lulusan`
--
ALTER TABLE `master_profil_lulusan`
  ADD PRIMARY KEY (`id_pl`),
  ADD KEY `fk_pl_prodi` (`id_prodi`);

--
-- Indexes for table `master_sks_jabatan`
--
ALTER TABLE `master_sks_jabatan`
  ADD PRIMARY KEY (`id_sks_jabatan`),
  ADD UNIQUE KEY `nama_pencarian` (`nama_pencarian`);

--
-- Indexes for table `pegawai`
--
ALTER TABLE `pegawai`
  ADD PRIMARY KEY (`id_pegawai`),
  ADD UNIQUE KEY `nikp` (`nikp`),
  ADD KEY `id_unit` (`id_unit`),
  ADD KEY `id_jabatan_struktural` (`id_jabatan_struktural`);

--
-- Indexes for table `prodi`
--
ALTER TABLE `prodi`
  ADD PRIMARY KEY (`id_prodi`),
  ADD KEY `id_unit` (`id_unit`);

--
-- Indexes for table `roadmap_lppm`
--
ALTER TABLE `roadmap_lppm`
  ADD PRIMARY KEY (`id_roadmap`);

--
-- Indexes for table `tahun_akademik`
--
ALTER TABLE `tahun_akademik`
  ADD PRIMARY KEY (`id_tahun`);

--
-- Indexes for table `tenaga_kependidikan`
--
ALTER TABLE `tenaga_kependidikan`
  ADD PRIMARY KEY (`id_tendik`),
  ADD KEY `id_pegawai` (`id_pegawai`);

--
-- Indexes for table `unit_kerja`
--
ALTER TABLE `unit_kerja`
  ADD PRIMARY KEY (`id_unit`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_user`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `id_unit` (`id_unit`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `1a1_pimpinan_dan_tupoksi`
--
ALTER TABLE `1a1_pimpinan_dan_tupoksi`
  MODIFY `id_pimpinan` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `1a2_sumber_pendanaan_upps`
--
ALTER TABLE `1a2_sumber_pendanaan_upps`
  MODIFY `id_sumber` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `1a3_penggunaan_dana_upps`
--
ALTER TABLE `1a3_penggunaan_dana_upps`
  MODIFY `id_penggunaan` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `1a4_beban_dtpr`
--
ALTER TABLE `1a4_beban_dtpr`
  MODIFY `id_beban_kerja` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `1a5_kualifikasi_tendik`
--
ALTER TABLE `1a5_kualifikasi_tendik`
  MODIFY `id_1a5` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `1b_unit_spmi_dan_sdm`
--
ALTER TABLE `1b_unit_spmi_dan_sdm`
  MODIFY `id_unit_spmi` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `2a1_data_mahasiswa`
--
ALTER TABLE `2a1_data_mahasiswa`
  MODIFY `id_2a1` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `2b1_isi_pembelajaran`
--
ALTER TABLE `2b1_isi_pembelajaran`
  MODIFY `id_2b1` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `2b2_pemetaan_cpl_pl`
--
ALTER TABLE `2b2_pemetaan_cpl_pl`
  MODIFY `id_2b2` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=170;

--
-- AUTO_INCREMENT for table `2b3_peta_pemenuhan_cpl`
--
ALTER TABLE `2b3_peta_pemenuhan_cpl`
  MODIFY `id_2b3` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `2b4_masa_tunggu`
--
ALTER TABLE `2b4_masa_tunggu`
  MODIFY `id_2b4` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `2b5_kesesuaian_kerja`
--
ALTER TABLE `2b5_kesesuaian_kerja`
  MODIFY `id_2b5` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `2b6_kepuasan_pengguna`
--
ALTER TABLE `2b6_kepuasan_pengguna`
  MODIFY `id_2b6` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `2b6_metadata_lulusan`
--
ALTER TABLE `2b6_metadata_lulusan`
  MODIFY `id_metadata` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `2d_ref_sumber_rekognisi`
--
ALTER TABLE `2d_ref_sumber_rekognisi`
  MODIFY `id_ref_sumber` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `2d_rekognisi_lulusan`
--
ALTER TABLE `2d_rekognisi_lulusan`
  MODIFY `id_2d` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `3a1_sarana_prasarana_penelitian`
--
ALTER TABLE `3a1_sarana_prasarana_penelitian`
  MODIFY `id_3a1` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `3a2_penelitian_dtpr`
--
ALTER TABLE `3a2_penelitian_dtpr`
  MODIFY `id_3a2` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `3a3_pengembangan_dtpr`
--
ALTER TABLE `3a3_pengembangan_dtpr`
  MODIFY `id_pengembangan` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `3c1_kerjasama_penelitian`
--
ALTER TABLE `3c1_kerjasama_penelitian`
  MODIFY `id_3c1` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `3c2_publikasi_penelitian`
--
ALTER TABLE `3c2_publikasi_penelitian`
  MODIFY `id_3c2` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `3c3_perolehan_hki`
--
ALTER TABLE `3c3_perolehan_hki`
  MODIFY `id_3c3` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `4a1_sarana_prasarana_pkm`
--
ALTER TABLE `4a1_sarana_prasarana_pkm`
  MODIFY `id_4a1` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `4a2_pkm_dtpr`
--
ALTER TABLE `4a2_pkm_dtpr`
  MODIFY `id_4a2` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `4c1_kerjasama_pkm`
--
ALTER TABLE `4c1_kerjasama_pkm`
  MODIFY `id_4c1` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `4c2_diseminasi_hasil_pkm`
--
ALTER TABLE `4c2_diseminasi_hasil_pkm`
  MODIFY `id_4c2` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `4c3_perolehan_hki_pkm`
--
ALTER TABLE `4c3_perolehan_hki_pkm`
  MODIFY `id_4c3` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `5_2_sarana_prasarana_pendidikan`
--
ALTER TABLE `5_2_sarana_prasarana_pendidikan`
  MODIFY `id_5_2` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `6_visi_misi`
--
ALTER TABLE `6_visi_misi`
  MODIFY `id_vm` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `dosen`
--
ALTER TABLE `dosen`
  MODIFY `id_dosen` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `jabatan_fungsional`
--
ALTER TABLE `jabatan_fungsional`
  MODIFY `id_jafung` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `jabatan_struktural`
--
ALTER TABLE `jabatan_struktural`
  MODIFY `id_jabatan_struktural` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `master_cpl`
--
ALTER TABLE `master_cpl`
  MODIFY `id_cpl` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `master_cpmk`
--
ALTER TABLE `master_cpmk`
  MODIFY `id_cpmk` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `master_mata_kuliah`
--
ALTER TABLE `master_mata_kuliah`
  MODIFY `id_mk` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `master_profil_lulusan`
--
ALTER TABLE `master_profil_lulusan`
  MODIFY `id_pl` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `master_sks_jabatan`
--
ALTER TABLE `master_sks_jabatan`
  MODIFY `id_sks_jabatan` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `pegawai`
--
ALTER TABLE `pegawai`
  MODIFY `id_pegawai` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `prodi`
--
ALTER TABLE `prodi`
  MODIFY `id_prodi` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `roadmap_lppm`
--
ALTER TABLE `roadmap_lppm`
  MODIFY `id_roadmap` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tahun_akademik`
--
ALTER TABLE `tahun_akademik`
  MODIFY `id_tahun` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=82;

--
-- AUTO_INCREMENT for table `tenaga_kependidikan`
--
ALTER TABLE `tenaga_kependidikan`
  MODIFY `id_tendik` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `unit_kerja`
--
ALTER TABLE `unit_kerja`
  MODIFY `id_unit` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id_user` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `1a1_pimpinan_dan_tupoksi`
--
ALTER TABLE `1a1_pimpinan_dan_tupoksi`
  ADD CONSTRAINT `1a1_pimpinan_dan_tupoksi_ibfk_1` FOREIGN KEY (`id_pegawai`) REFERENCES `pegawai` (`id_pegawai`),
  ADD CONSTRAINT `fk_1a1_jafung` FOREIGN KEY (`id_jafung`) REFERENCES `jabatan_fungsional` (`id_jafung`);

--
-- Constraints for table `1a2_sumber_pendanaan_upps`
--
ALTER TABLE `1a2_sumber_pendanaan_upps`
  ADD CONSTRAINT `fk_1a2_tahun` FOREIGN KEY (`id_tahun`) REFERENCES `tahun_akademik` (`id_tahun`);

--
-- Constraints for table `1a3_penggunaan_dana_upps`
--
ALTER TABLE `1a3_penggunaan_dana_upps`
  ADD CONSTRAINT `fk_1a3_tahun` FOREIGN KEY (`id_tahun`) REFERENCES `tahun_akademik` (`id_tahun`);

--
-- Constraints for table `1a4_beban_dtpr`
--
ALTER TABLE `1a4_beban_dtpr`
  ADD CONSTRAINT `1a4_beban_dtpr_ibfk_1` FOREIGN KEY (`id_dosen`) REFERENCES `dosen` (`id_dosen`),
  ADD CONSTRAINT `1a4_beban_dtpr_ibfk_2` FOREIGN KEY (`id_pimpinan`) REFERENCES `1a1_pimpinan_dan_tupoksi` (`id_pimpinan`),
  ADD CONSTRAINT `1a4_beban_dtpr_ibfk_3` FOREIGN KEY (`id_tahun`) REFERENCES `tahun_akademik` (`id_tahun`);

--
-- Constraints for table `1a5_kualifikasi_tendik`
--
ALTER TABLE `1a5_kualifikasi_tendik`
  ADD CONSTRAINT `fk_1a5_prodi` FOREIGN KEY (`id_prodi`) REFERENCES `prodi` (`id_prodi`),
  ADD CONSTRAINT `fk_1a5_tahun` FOREIGN KEY (`id_tahun`) REFERENCES `tahun_akademik` (`id_tahun`),
  ADD CONSTRAINT `fk_1a5_tendik` FOREIGN KEY (`id_tendik`) REFERENCES `tenaga_kependidikan` (`id_tendik`);

--
-- Constraints for table `1b_unit_spmi_dan_sdm`
--
ALTER TABLE `1b_unit_spmi_dan_sdm`
  ADD CONSTRAINT `fk_spmi_tahun` FOREIGN KEY (`tahun_akademik_id_tahun`) REFERENCES `tahun_akademik` (`id_tahun`),
  ADD CONSTRAINT `fk_spmi_unit` FOREIGN KEY (`unit_kerja_id_unit`) REFERENCES `unit_kerja` (`id_unit`);

--
-- Constraints for table `2a1_data_mahasiswa`
--
ALTER TABLE `2a1_data_mahasiswa`
  ADD CONSTRAINT `fk_2a1_prodi` FOREIGN KEY (`prodi_id_prodi`) REFERENCES `prodi` (`id_prodi`),
  ADD CONSTRAINT `fk_2a1_tahun` FOREIGN KEY (`tahun_akademik_id_tahun`) REFERENCES `tahun_akademik` (`id_tahun`);

--
-- Constraints for table `2b1_isi_pembelajaran`
--
ALTER TABLE `2b1_isi_pembelajaran`
  ADD CONSTRAINT `fk_2b1_mk` FOREIGN KEY (`id_mk`) REFERENCES `master_mata_kuliah` (`id_mk`),
  ADD CONSTRAINT `fk_2b1_pl` FOREIGN KEY (`id_pl`) REFERENCES `master_profil_lulusan` (`id_pl`),
  ADD CONSTRAINT `fk_2b1_tahun` FOREIGN KEY (`id_tahun`) REFERENCES `tahun_akademik` (`id_tahun`);

--
-- Constraints for table `2b2_pemetaan_cpl_pl`
--
ALTER TABLE `2b2_pemetaan_cpl_pl`
  ADD CONSTRAINT `fk_2b2_cpl` FOREIGN KEY (`id_cpl`) REFERENCES `master_cpl` (`id_cpl`),
  ADD CONSTRAINT `fk_2b2_pl` FOREIGN KEY (`id_pl`) REFERENCES `master_profil_lulusan` (`id_pl`),
  ADD CONSTRAINT `fk_2b2_tahun` FOREIGN KEY (`id_tahun`) REFERENCES `tahun_akademik` (`id_tahun`);

--
-- Constraints for table `2b3_peta_pemenuhan_cpl`
--
ALTER TABLE `2b3_peta_pemenuhan_cpl`
  ADD CONSTRAINT `fk_2b3_cpl` FOREIGN KEY (`id_cpl`) REFERENCES `master_cpl` (`id_cpl`),
  ADD CONSTRAINT `fk_2b3_cpmk` FOREIGN KEY (`id_cpmk`) REFERENCES `master_cpmk` (`id_cpmk`),
  ADD CONSTRAINT `fk_2b3_mk` FOREIGN KEY (`id_mk`) REFERENCES `master_mata_kuliah` (`id_mk`),
  ADD CONSTRAINT `fk_2b3_tahun` FOREIGN KEY (`id_tahun`) REFERENCES `tahun_akademik` (`id_tahun`);

--
-- Constraints for table `2b4_masa_tunggu`
--
ALTER TABLE `2b4_masa_tunggu`
  ADD CONSTRAINT `fk_2b4_prodi` FOREIGN KEY (`id_prodi`) REFERENCES `prodi` (`id_prodi`),
  ADD CONSTRAINT `fk_2b4_tahun` FOREIGN KEY (`id_tahun`) REFERENCES `tahun_akademik` (`id_tahun`);

--
-- Constraints for table `2b5_kesesuaian_kerja`
--
ALTER TABLE `2b5_kesesuaian_kerja`
  ADD CONSTRAINT `fk_2b5_to_2b4` FOREIGN KEY (`id_2b4`) REFERENCES `2b4_masa_tunggu` (`id_2b4`) ON DELETE CASCADE;

--
-- Constraints for table `2d_rekognisi_lulusan`
--
ALTER TABLE `2d_rekognisi_lulusan`
  ADD CONSTRAINT `fk_2d_prodi` FOREIGN KEY (`id_prodi`) REFERENCES `prodi` (`id_prodi`),
  ADD CONSTRAINT `fk_2d_sumber` FOREIGN KEY (`id_ref_sumber`) REFERENCES `2d_ref_sumber_rekognisi` (`id_ref_sumber`),
  ADD CONSTRAINT `fk_2d_tahun` FOREIGN KEY (`id_tahun`) REFERENCES `tahun_akademik` (`id_tahun`);

--
-- Constraints for table `3a1_sarana_prasarana_penelitian`
--
ALTER TABLE `3a1_sarana_prasarana_penelitian`
  ADD CONSTRAINT `fk_3a1_prodi` FOREIGN KEY (`id_prodi`) REFERENCES `prodi` (`id_prodi`);

--
-- Constraints for table `3a2_penelitian_dtpr`
--
ALTER TABLE `3a2_penelitian_dtpr`
  ADD CONSTRAINT `fk_3a2_roadmap` FOREIGN KEY (`id_roadmap`) REFERENCES `roadmap_lppm` (`id_roadmap`) ON UPDATE CASCADE;

--
-- Constraints for table `3a3_pengembangan_dtpr`
--
ALTER TABLE `3a3_pengembangan_dtpr`
  ADD CONSTRAINT `3a3_pengembangan_dtpr_ibfk_1` FOREIGN KEY (`id_dosen`) REFERENCES `dosen` (`id_dosen`),
  ADD CONSTRAINT `3a3_pengembangan_dtpr_ibfk_2` FOREIGN KEY (`id_tahun`) REFERENCES `tahun_akademik` (`id_tahun`);

--
-- Constraints for table `3c1_kerjasama_penelitian`
--
ALTER TABLE `3c1_kerjasama_penelitian`
  ADD CONSTRAINT `3c1_kerjasama_penelitian_ibfk_1` FOREIGN KEY (`id_3a2`) REFERENCES `3a2_penelitian_dtpr` (`id_3a2`) ON DELETE CASCADE;

--
-- Constraints for table `3c2_publikasi_penelitian`
--
ALTER TABLE `3c2_publikasi_penelitian`
  ADD CONSTRAINT `3c2_publikasi_penelitian_ibfk_1` FOREIGN KEY (`id_3a2`) REFERENCES `3a2_penelitian_dtpr` (`id_3a2`) ON DELETE CASCADE;

--
-- Constraints for table `3c3_perolehan_hki`
--
ALTER TABLE `3c3_perolehan_hki`
  ADD CONSTRAINT `3c3_perolehan_hki_ibfk_1` FOREIGN KEY (`id_3a2`) REFERENCES `3a2_penelitian_dtpr` (`id_3a2`) ON DELETE CASCADE;

--
-- Constraints for table `4a1_sarana_prasarana_pkm`
--
ALTER TABLE `4a1_sarana_prasarana_pkm`
  ADD CONSTRAINT `fk_4a1_prodi` FOREIGN KEY (`id_prodi`) REFERENCES `prodi` (`id_prodi`);

--
-- Constraints for table `4a2_pkm_dtpr`
--
ALTER TABLE `4a2_pkm_dtpr`
  ADD CONSTRAINT `fk_4a2_roadmap` FOREIGN KEY (`id_roadmap`) REFERENCES `roadmap_lppm` (`id_roadmap`) ON UPDATE CASCADE;

--
-- Constraints for table `4c1_kerjasama_pkm`
--
ALTER TABLE `4c1_kerjasama_pkm`
  ADD CONSTRAINT `4c1_kerjasama_pkm_ibfk_1` FOREIGN KEY (`id_4a2`) REFERENCES `4a2_pkm_dtpr` (`id_4a2`) ON DELETE CASCADE;

--
-- Constraints for table `4c2_diseminasi_hasil_pkm`
--
ALTER TABLE `4c2_diseminasi_hasil_pkm`
  ADD CONSTRAINT `4c2_diseminasi_hasil_pkm_ibfk_1` FOREIGN KEY (`id_4a2`) REFERENCES `4a2_pkm_dtpr` (`id_4a2`) ON DELETE CASCADE;

--
-- Constraints for table `4c3_perolehan_hki_pkm`
--
ALTER TABLE `4c3_perolehan_hki_pkm`
  ADD CONSTRAINT `4c3_perolehan_hki_pkm_ibfk_1` FOREIGN KEY (`id_4a2`) REFERENCES `4a2_pkm_dtpr` (`id_4a2`) ON DELETE CASCADE;

--
-- Constraints for table `5_2_sarana_prasarana_pendidikan`
--
ALTER TABLE `5_2_sarana_prasarana_pendidikan`
  ADD CONSTRAINT `fk_5_2_prodi` FOREIGN KEY (`id_prodi`) REFERENCES `prodi` (`id_prodi`);

--
-- Constraints for table `6_visi_misi`
--
ALTER TABLE `6_visi_misi`
  ADD CONSTRAINT `6_visi_misi_ibfk_1` FOREIGN KEY (`id_prodi`) REFERENCES `prodi` (`id_prodi`);

--
-- Constraints for table `dosen`
--
ALTER TABLE `dosen`
  ADD CONSTRAINT `dosen_ibfk_1` FOREIGN KEY (`id_pegawai`) REFERENCES `pegawai` (`id_pegawai`),
  ADD CONSTRAINT `dosen_ibfk_2` FOREIGN KEY (`id_prodi`) REFERENCES `prodi` (`id_prodi`),
  ADD CONSTRAINT `dosen_ibfk_3` FOREIGN KEY (`id_jabatan_fungsional`) REFERENCES `jabatan_fungsional` (`id_jafung`);

--
-- Constraints for table `master_cpl`
--
ALTER TABLE `master_cpl`
  ADD CONSTRAINT `fk_cpl_prodi` FOREIGN KEY (`id_prodi`) REFERENCES `prodi` (`id_prodi`);

--
-- Constraints for table `master_cpmk`
--
ALTER TABLE `master_cpmk`
  ADD CONSTRAINT `fk_cpmk_prodi` FOREIGN KEY (`id_prodi`) REFERENCES `prodi` (`id_prodi`);

--
-- Constraints for table `master_mata_kuliah`
--
ALTER TABLE `master_mata_kuliah`
  ADD CONSTRAINT `fk_mk_prodi` FOREIGN KEY (`id_prodi`) REFERENCES `prodi` (`id_prodi`);

--
-- Constraints for table `master_profil_lulusan`
--
ALTER TABLE `master_profil_lulusan`
  ADD CONSTRAINT `fk_pl_prodi` FOREIGN KEY (`id_prodi`) REFERENCES `prodi` (`id_prodi`);

--
-- Constraints for table `pegawai`
--
ALTER TABLE `pegawai`
  ADD CONSTRAINT `pegawai_ibfk_1` FOREIGN KEY (`id_unit`) REFERENCES `unit_kerja` (`id_unit`),
  ADD CONSTRAINT `pegawai_ibfk_2` FOREIGN KEY (`id_jabatan_struktural`) REFERENCES `jabatan_struktural` (`id_jabatan_struktural`);

--
-- Constraints for table `prodi`
--
ALTER TABLE `prodi`
  ADD CONSTRAINT `prodi_ibfk_1` FOREIGN KEY (`id_unit`) REFERENCES `unit_kerja` (`id_unit`);

--
-- Constraints for table `tenaga_kependidikan`
--
ALTER TABLE `tenaga_kependidikan`
  ADD CONSTRAINT `tenaga_kependidikan_ibfk_1` FOREIGN KEY (`id_pegawai`) REFERENCES `pegawai` (`id_pegawai`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`id_unit`) REFERENCES `unit_kerja` (`id_unit`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
