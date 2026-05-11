-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Waktu pembuatan: 29 Apr 2026 pada 09.29
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

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
-- Struktur dari tabel `1a1_pimpinan_dan_tupoksi`
--

CREATE TABLE `1a1_pimpinan_dan_tupoksi` (
  `id_pimpinan` int(11) NOT NULL,
  `id_pegawai` int(11) NOT NULL,
  `periode_mulai` year(4) NOT NULL,
  `periode_selesai` year(4) NOT NULL,
  `tupoksi` text DEFAULT NULL,
  `sks_jabatan` decimal(4,2) DEFAULT 0.00,
  `id_jafung` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `updated_by` int(11) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data untuk tabel `1a1_pimpinan_dan_tupoksi`
--

INSERT INTO `1a1_pimpinan_dan_tupoksi` (`id_pimpinan`, `id_pegawai`, `periode_mulai`, `periode_selesai`, `tupoksi`, `sks_jabatan`, `id_jafung`, `created_at`, `created_by`, `updated_at`, `updated_by`, `deleted_at`, `deleted_by`) VALUES
(1, 1, '2022', '2026', 'Menyusun dan mengembangkan kurikulum program studi', 10.00, 1, '2026-04-29 07:11:31', NULL, NULL, NULL, NULL, NULL),
(2, 2, '2023', '2026', 'Melakukan penelitian dan publikasi ilmiah', 8.00, 2, '2026-04-29 07:11:31', NULL, NULL, NULL, NULL, NULL),
(3, 3, '2022', '2025', 'Menangani administrasi akademik dan kemahasiswaan', 6.00, 3, '2026-04-29 07:11:31', NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `1a2_sumber_pendanaan_upps`
--

CREATE TABLE `1a2_sumber_pendanaan_upps` (
  `id_sumber` int(11) NOT NULL,
  `id_prodi` int(11) NOT NULL,
  `nama_sumber` varchar(255) NOT NULL,
  `jumlah_dana` int(11) NOT NULL COMMENT 'Dalam jutaan rupiah',
  `link_bukti` varchar(255) NOT NULL,
  `id_tahun` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `updated_by` int(11) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `1a2_sumber_pendanaan_upps`
--

INSERT INTO `1a2_sumber_pendanaan_upps` (`id_sumber`, `id_prodi`, `nama_sumber`, `jumlah_dana`, `link_bukti`, `id_tahun`, `created_at`, `created_by`, `updated_at`, `updated_by`, `deleted_at`, `deleted_by`) VALUES
(1, 1, 'SPP Mahasiswa (SPP, UKT)', 1500, 'https://gdrive.link/bukti-dana-1', 1, '2026-04-29 07:11:31', NULL, NULL, NULL, NULL, NULL),
(2, 1, 'Yayasan PT', 500, 'https://gdrive.link/bukti-dana-2', 1, '2026-04-29 07:11:31', NULL, NULL, NULL, NULL, NULL),
(3, 1, 'SPP Mahasiswa (SPP, UKT)', 1800, 'https://gdrive.link/bukti-dana-3', 2, '2026-04-29 07:11:31', NULL, NULL, NULL, NULL, NULL),
(4, 1, 'Yayasan PT', 600, 'https://gdrive.link/bukti-dana-4', 2, '2026-04-29 07:11:31', NULL, NULL, NULL, NULL, NULL),
(5, 1, 'SPP Mahasiswa (SPP, UKT)', 2100, 'https://gdrive.link/bukti-dana-5', 3, '2026-04-29 07:11:31', NULL, NULL, NULL, NULL, NULL),
(6, 1, 'Yayasan PT', 750, 'https://gdrive.link/bukti-dana-6', 3, '2026-04-29 07:11:31', NULL, NULL, NULL, NULL, NULL),
(7, 2, 'SPP Mahasiswa (SPP, UKT)', 1200, 'https://gdrive.link/bukti-dana-7', 1, '2026-04-29 07:11:31', NULL, NULL, NULL, NULL, NULL),
(8, 2, 'Yayasan PT', 400, 'https://gdrive.link/bukti-dana-8', 1, '2026-04-29 07:11:31', NULL, NULL, NULL, NULL, NULL),
(9, 2, 'SPP Mahasiswa (SPP, UKT)', 1400, 'https://gdrive.link/bukti-dana-9', 2, '2026-04-29 07:11:31', NULL, NULL, NULL, NULL, NULL),
(10, 2, 'Yayasan PT', 500, 'https://gdrive.link/bukti-dana-10', 2, '2026-04-29 07:11:31', NULL, NULL, NULL, NULL, NULL),
(11, 2, 'SPP Mahasiswa (SPP, UKT)', 1600, 'https://gdrive.link/bukti-dana-11', 3, '2026-04-29 07:11:31', NULL, NULL, NULL, NULL, NULL),
(12, 2, 'Yayasan PT', 650, 'https://gdrive.link/bukti-dana-12', 3, '2026-04-29 07:11:31', NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `1a3_penggunaan_dana_upps`
--

CREATE TABLE `1a3_penggunaan_dana_upps` (
  `id_penggunaan` int(11) NOT NULL,
  `id_prodi` int(11) NOT NULL,
  `nama_penggunaan` varchar(255) NOT NULL COMMENT 'Contoh: Pendidikan, Penelitian, PkM, dll',
  `jumlah_dana` int(11) DEFAULT 0 COMMENT 'Dalam jutaan rupiah',
  `link_bukti` varchar(255) NOT NULL,
  `id_tahun` int(11) NOT NULL COMMENT 'Tahun Akademik (TS)',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `updated_by` int(11) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `1a3_penggunaan_dana_upps`
--

INSERT INTO `1a3_penggunaan_dana_upps` (`id_penggunaan`, `id_prodi`, `nama_penggunaan`, `jumlah_dana`, `link_bukti`, `id_tahun`, `created_at`, `created_by`, `updated_at`, `updated_by`, `deleted_at`, `deleted_by`) VALUES
(1, 1, 'Pendidikan', 800, 'https://gdrive.link/penggunaan-1-2022', 1, '2026-04-29 07:11:31', NULL, NULL, NULL, NULL, NULL),
(2, 1, 'Penelitian', 250, 'https://gdrive.link/penggunaan-2-2022', 1, '2026-04-29 07:11:31', NULL, NULL, NULL, NULL, NULL),
(3, 1, 'Pengabdian kepada Masyarakat (PkM)', 120, 'https://gdrive.link/penggunaan-3-2022', 1, '2026-04-29 07:11:31', NULL, NULL, NULL, NULL, NULL),
(4, 2, 'Pendidikan', 600, 'https://gdrive.link/penggunaan-4-2022', 1, '2026-04-29 07:11:31', NULL, NULL, NULL, NULL, NULL),
(5, 2, 'Penelitian', 200, 'https://gdrive.link/penggunaan-5-2022', 1, '2026-04-29 07:11:31', NULL, NULL, NULL, NULL, NULL),
(6, 2, 'Pengabdian kepada Masyarakat (PkM)', 100, 'https://gdrive.link/penggunaan-6-2022', 1, '2026-04-29 07:11:31', NULL, NULL, NULL, NULL, NULL),
(7, 1, 'Pendidikan', 900, 'https://gdrive.link/penggunaan-1-2023', 2, '2026-04-29 07:11:31', NULL, NULL, NULL, NULL, NULL),
(8, 1, 'Penelitian', 280, 'https://gdrive.link/penggunaan-2-2023', 2, '2026-04-29 07:11:31', NULL, NULL, NULL, NULL, NULL),
(9, 1, 'Pengabdian kepada Masyarakat (PkM)', 135, 'https://gdrive.link/penggunaan-3-2023', 2, '2026-04-29 07:11:31', NULL, NULL, NULL, NULL, NULL),
(10, 2, 'Pendidikan', 650, 'https://gdrive.link/penggunaan-4-2023', 2, '2026-04-29 07:11:31', NULL, NULL, NULL, NULL, NULL),
(11, 2, 'Penelitian', 220, 'https://gdrive.link/penggunaan-5-2023', 2, '2026-04-29 07:11:31', NULL, NULL, NULL, NULL, NULL),
(12, 2, 'Pengabdian kepada Masyarakat (PkM)', 110, 'https://gdrive.link/penggunaan-6-2023', 2, '2026-04-29 07:11:31', NULL, NULL, NULL, NULL, NULL),
(13, 1, 'Pendidikan', 1000, 'https://gdrive.link/penggunaan-1', 3, '2026-04-29 07:11:31', NULL, NULL, NULL, NULL, NULL),
(14, 1, 'Penelitian', 300, 'https://gdrive.link/penggunaan-2', 3, '2026-04-29 07:11:31', NULL, NULL, NULL, NULL, NULL),
(15, 1, 'Pengabdian kepada Masyarakat (PkM)', 150, 'https://gdrive.link/penggunaan-3', 3, '2026-04-29 07:11:31', NULL, NULL, NULL, NULL, NULL),
(16, 2, 'Pendidikan', 700, 'https://gdrive.link/penggunaan-4', 3, '2026-04-29 07:11:31', NULL, NULL, NULL, NULL, NULL),
(17, 2, 'Penelitian', 250, 'https://gdrive.link/penggunaan-5', 3, '2026-04-29 07:11:31', NULL, NULL, NULL, NULL, NULL),
(18, 2, 'Pengabdian kepada Masyarakat (PkM)', 120, 'https://gdrive.link/penggunaan-6', 3, '2026-04-29 07:11:31', NULL, NULL, NULL, NULL, NULL),
(19, 1, 'Pendidikan', 1100, 'https://gdrive.link/penggunaan-1-2025', 4, '2026-04-29 07:11:31', NULL, NULL, NULL, NULL, NULL),
(20, 1, 'Penelitian', 320, 'https://gdrive.link/penggunaan-2-2025', 4, '2026-04-29 07:11:31', NULL, NULL, NULL, NULL, NULL),
(21, 1, 'Pengabdian kepada Masyarakat (PkM)', 160, 'https://gdrive.link/penggunaan-3-2025', 4, '2026-04-29 07:11:31', NULL, NULL, NULL, NULL, NULL),
(22, 2, 'Pendidikan', 750, 'https://gdrive.link/penggunaan-4-2025', 4, '2026-04-29 07:11:31', NULL, NULL, NULL, NULL, NULL),
(23, 2, 'Penelitian', 270, 'https://gdrive.link/penggunaan-5-2025', 4, '2026-04-29 07:11:31', NULL, NULL, NULL, NULL, NULL),
(24, 2, 'Pengabdian kepada Masyarakat (PkM)', 130, 'https://gdrive.link/penggunaan-6-2025', 4, '2026-04-29 07:11:31', NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `1a4_beban_dtpr`
--

CREATE TABLE `1a4_beban_dtpr` (
  `id_beban_kerja` int(11) NOT NULL,
  `id_dosen` int(11) NOT NULL,
  `id_pimpinan` int(11) DEFAULT NULL,
  `sks_ps_sendiri` decimal(4,2) DEFAULT 0.00,
  `sks_ps_lain` decimal(4,2) DEFAULT 0.00,
  `sks_pt_lain` decimal(4,2) DEFAULT 0.00,
  `sks_penelitian` decimal(4,2) DEFAULT 0.00,
  `sks_pkm` decimal(4,2) DEFAULT 0.00,
  `sks_manajemen_pt_lain` decimal(4,2) DEFAULT 0.00,
  `id_tahun` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `updated_by` int(11) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data untuk tabel `1a4_beban_dtpr`
--

INSERT INTO `1a4_beban_dtpr` (`id_beban_kerja`, `id_dosen`, `id_pimpinan`, `sks_ps_sendiri`, `sks_ps_lain`, `sks_pt_lain`, `sks_penelitian`, `sks_pkm`, `sks_manajemen_pt_lain`, `id_tahun`, `created_at`, `created_by`, `updated_at`, `updated_by`, `deleted_at`, `deleted_by`) VALUES
(1, 1, 1, 8.00, 2.00, 1.00, 3.00, 2.00, 1.00, 1, '2026-04-29 07:11:32', NULL, NULL, NULL, NULL, NULL),
(2, 2, 2, 6.00, 3.00, 1.00, 4.00, 1.00, 2.00, 1, '2026-04-29 07:11:32', NULL, NULL, NULL, NULL, NULL),
(3, 3, 3, 7.00, 2.00, 1.00, 3.00, 2.00, 1.00, 1, '2026-04-29 07:11:32', NULL, NULL, NULL, NULL, NULL),
(4, 1, 1, 6.00, 2.00, 1.00, 3.00, 1.00, 2.00, 2, '2026-04-29 07:11:32', NULL, NULL, NULL, NULL, NULL),
(5, 2, 2, 5.00, 3.00, 1.00, 4.00, 1.00, 2.00, 2, '2026-04-29 07:11:32', NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `1a5_kualifikasi_tendik`
--

CREATE TABLE `1a5_kualifikasi_tendik` (
  `id_1a5` int(11) NOT NULL,
  `id_prodi` int(11) NOT NULL,
  `id_tahun` int(11) NOT NULL,
  `id_tendik` int(11) NOT NULL,
  `pendidikan_snapshot` varchar(50) NOT NULL,
  `jenis_tendik_snapshot` varchar(100) NOT NULL,
  `nama_unit_snapshot` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `updated_by` int(11) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `1a5_kualifikasi_tendik`
--

INSERT INTO `1a5_kualifikasi_tendik` (`id_1a5`, `id_prodi`, `id_tahun`, `id_tendik`, `pendidikan_snapshot`, `jenis_tendik_snapshot`, `nama_unit_snapshot`, `created_at`, `created_by`, `updated_at`, `updated_by`, `deleted_at`, `deleted_by`) VALUES
(1, 1, 1, 1, 'S1 Teknik Informatika', 'Laboran / Teknisi IT', 'Unit Teknologi Informasi', '2026-04-29 07:11:32', NULL, NULL, NULL, NULL, NULL),
(2, 1, 1, 2, 'S1 Teknik Informatika', 'Administrasi Akademik', 'Unit Administrasi Akademik', '2026-04-29 07:11:32', NULL, NULL, NULL, NULL, NULL),
(3, 1, 1, 3, 'S1 Teknik Informatika', 'Laboran / Teknisi IT', 'Unit Teknologi Informasi', '2026-04-29 07:11:32', NULL, NULL, NULL, NULL, NULL),
(4, 1, 2, 1, 'S1 Teknik Informatika', 'Laboran / Teknisi IT', 'Unit Teknologi Informasi', '2026-04-29 07:11:32', NULL, NULL, NULL, NULL, NULL),
(5, 1, 2, 2, 'S1 Teknik Informatika', 'Administrasi Akademik', 'Unit Administrasi Akademik', '2026-04-29 07:11:32', NULL, NULL, NULL, NULL, NULL),
(6, 1, 2, 3, 'S1 Teknik Informatika', 'Laboran / Teknisi IT', 'Unit Teknologi Informasi', '2026-04-29 07:11:32', NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `1b_unit_spmi_dan_sdm`
--

CREATE TABLE `1b_unit_spmi_dan_sdm` (
  `id_unit_spmi` int(11) NOT NULL,
  `jenis_unit` varchar(50) DEFAULT NULL,
  `dokumen_spmi` varchar(255) DEFAULT NULL COMMENT 'Link Dokumen SPMI',
  `jumlah_auditor` int(11) DEFAULT 0,
  `auditor_certified` int(11) DEFAULT 0,
  `auditor_non_certified` int(11) DEFAULT 0,
  `frekuensi_audit` int(11) DEFAULT 0 COMMENT 'Frekuensi Audit per Tahun',
  `bukti_certified_auditor` varchar(255) DEFAULT NULL COMMENT 'Link Bukti Sertifikat',
  `laporan_audit` varchar(255) DEFAULT NULL COMMENT 'Link Laporan Hasil Audit',
  `id_unit` int(11) NOT NULL,
  `id_tahun` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `updated_by` int(11) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data untuk tabel `1b_unit_spmi_dan_sdm`
--

INSERT INTO `1b_unit_spmi_dan_sdm` (`id_unit_spmi`, `jenis_unit`, `dokumen_spmi`, `jumlah_auditor`, `auditor_certified`, `auditor_non_certified`, `frekuensi_audit`, `bukti_certified_auditor`, `laporan_audit`, `id_unit`, `id_tahun`, `created_at`, `created_by`, `updated_at`, `updated_by`, `deleted_at`, `deleted_by`) VALUES
(1, 'Unit Penjaminan Mutu Internal', 'https://gdrive.link/dokumen-spmi-1', 5, 3, 2, 2, 'https://gdrive.link/sertifikat-auditor-1', 'https://gdrive.link/laporan-audit-1', 1, 1, '2026-04-29 07:11:32', NULL, NULL, NULL, NULL, NULL),
(2, 'Unit Pengembangan Karir', 'https://gdrive.link/dokumen-spmi-2', 3, 2, 1, 2, 'https://gdrive.link/sertifikat-auditor-2', 'https://gdrive.link/laporan-audit-2', 1, 1, '2026-04-29 07:11:32', NULL, NULL, NULL, NULL, NULL),
(3, 'Unit Penjaminan Mutu Internal', 'https://gdrive.link/dokumen-spmi-3', 6, 4, 2, 2, 'https://gdrive.link/sertifikat-auditor-3', 'https://gdrive.link/laporan-audit-3', 1, 2, '2026-04-29 07:11:32', NULL, NULL, NULL, NULL, NULL),
(4, 'Unit Pengembangan Karir', 'https://gdrive.link/dokumen-spmi-4', 4, 3, 1, 2, 'https://gdrive.link/sertifikat-auditor-4', 'https://gdrive.link/laporan-audit-4', 1, 2, '2026-04-29 07:11:32', NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `2a1_data_mahasiswa`
--

CREATE TABLE `2a1_data_mahasiswa` (
  `id_2a1` int(10) UNSIGNED NOT NULL,
  `prodi_id_prodi` int(11) NOT NULL,
  `tahun_akademik_id_tahun` int(11) NOT NULL,
  `daya_tampung` int(10) UNSIGNED DEFAULT 0,
  `pendaftar` int(10) UNSIGNED DEFAULT 0,
  `pendaftar_afirmasi` int(10) UNSIGNED DEFAULT 0,
  `pendaftar_khusus` int(10) UNSIGNED DEFAULT 0,
  `maba_reg_diterima` int(10) UNSIGNED DEFAULT 0,
  `maba_reg_afirmasi` int(10) UNSIGNED DEFAULT 0,
  `maba_reg_khusus` int(10) UNSIGNED DEFAULT 0,
  `maba_rpl_diterima` int(10) UNSIGNED DEFAULT 0,
  `maba_rpl_afirmasi` int(10) UNSIGNED DEFAULT 0,
  `maba_rpl_khusus` int(10) UNSIGNED DEFAULT 0,
  `aktif_reg_diterima` int(10) UNSIGNED DEFAULT 0,
  `aktif_reg_afirmasi` int(10) UNSIGNED DEFAULT 0,
  `aktif_reg_khusus` int(10) UNSIGNED DEFAULT 0,
  `aktif_rpl_diterima` int(10) UNSIGNED DEFAULT 0,
  `aktif_rpl_afirmasi` int(10) UNSIGNED DEFAULT 0,
  `aktif_rpl_khusus` int(10) UNSIGNED DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `updated_by` int(11) DEFAULT NULL,
  `pmb_deleted_at` datetime DEFAULT NULL,
  `pmb_deleted_by` int(11) DEFAULT NULL,
  `ala_deleted_at` datetime DEFAULT NULL,
  `ala_deleted_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `2a1_data_mahasiswa`
--

INSERT INTO `2a1_data_mahasiswa` (`id_2a1`, `prodi_id_prodi`, `tahun_akademik_id_tahun`, `daya_tampung`, `pendaftar`, `pendaftar_afirmasi`, `pendaftar_khusus`, `maba_reg_diterima`, `maba_reg_afirmasi`, `maba_reg_khusus`, `maba_rpl_diterima`, `maba_rpl_afirmasi`, `maba_rpl_khusus`, `aktif_reg_diterima`, `aktif_reg_afirmasi`, `aktif_reg_khusus`, `aktif_rpl_diterima`, `aktif_rpl_afirmasi`, `aktif_rpl_khusus`, `created_at`, `created_by`, `updated_at`, `updated_by`, `pmb_deleted_at`, `pmb_deleted_by`, `ala_deleted_at`, `ala_deleted_by`) VALUES
(1, 1, 4, 150, 200, 0, 0, 120, 0, 0, 0, 0, 0, 450, 0, 0, 0, 0, 0, '2026-04-29 07:18:52', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(2, 1, 5, 150, 210, 0, 0, 130, 0, 0, 0, 0, 0, 480, 0, 0, 0, 0, 0, '2026-04-29 07:18:52', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(3, 2, 4, 100, 120, 0, 0, 80, 0, 0, 0, 0, 0, 280, 0, 0, 0, 0, 0, '2026-04-29 07:18:52', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(4, 3, 5, 80, 95, 0, 0, 60, 0, 0, 0, 0, 0, 60, 0, 0, 0, 0, 0, '2026-04-29 07:18:52', NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `2b1_isi_pembelajaran`
--

CREATE TABLE `2b1_isi_pembelajaran` (
  `id_2b1` int(11) NOT NULL,
  `id_mk` int(11) NOT NULL,
  `id_pl` int(11) NOT NULL,
  `id_tahun` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `updated_by` int(11) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `2b1_isi_pembelajaran`
--

INSERT INTO `2b1_isi_pembelajaran` (`id_2b1`, `id_mk`, `id_pl`, `id_tahun`, `created_at`, `created_by`, `updated_at`, `updated_by`, `deleted_at`, `deleted_by`) VALUES
(1, 4, 5, 4, '2026-04-29 07:20:37', NULL, NULL, NULL, NULL, NULL),
(2, 6, 5, 4, '2026-04-29 07:20:37', NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `2b2_pemetaan_cpl_pl`
--

CREATE TABLE `2b2_pemetaan_cpl_pl` (
  `id_2b2` int(11) NOT NULL,
  `id_cpl` int(11) NOT NULL,
  `id_pl` int(11) NOT NULL,
  `id_tahun` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `updated_by` int(11) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `2b2_pemetaan_cpl_pl`
--

INSERT INTO `2b2_pemetaan_cpl_pl` (`id_2b2`, `id_cpl`, `id_pl`, `id_tahun`, `created_at`, `created_by`, `updated_at`, `updated_by`, `deleted_at`, `deleted_by`) VALUES
(1, 3, 5, 4, '2026-04-29 07:20:37', NULL, NULL, NULL, NULL, NULL),
(2, 4, 5, 4, '2026-04-29 07:20:37', NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `2b3_peta_pemenuhan_cpl`
--

CREATE TABLE `2b3_peta_pemenuhan_cpl` (
  `id_2b3` int(11) NOT NULL,
  `id_cpl` int(11) NOT NULL,
  `id_cpmk` int(11) NOT NULL,
  `id_mk` int(11) NOT NULL,
  `id_tahun` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `updated_by` int(11) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `2b3_peta_pemenuhan_cpl`
--

INSERT INTO `2b3_peta_pemenuhan_cpl` (`id_2b3`, `id_cpl`, `id_cpmk`, `id_mk`, `id_tahun`, `created_at`, `created_by`, `updated_at`, `updated_by`, `deleted_at`, `deleted_by`) VALUES
(1, 3, 3, 4, 4, '2026-04-29 07:20:37', NULL, NULL, NULL, NULL, NULL),
(2, 4, 4, 6, 4, '2026-04-29 07:20:37', NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `2b4_masa_tunggu`
--

CREATE TABLE `2b4_masa_tunggu` (
  `id_2b4` int(11) NOT NULL,
  `id_prodi` int(11) NOT NULL,
  `id_tahun` int(11) NOT NULL COMMENT 'TS, TS-1, atau TS-2',
  `jumlah_lulusan` int(10) UNSIGNED DEFAULT 0,
  `jumlah_terlacak` int(10) UNSIGNED DEFAULT 0,
  `rata_tunggu` decimal(5,2) DEFAULT 0.00 COMMENT 'Dalam satuan bulan',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `updated_by` int(11) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `2b4_masa_tunggu`
--

INSERT INTO `2b4_masa_tunggu` (`id_2b4`, `id_prodi`, `id_tahun`, `jumlah_lulusan`, `jumlah_terlacak`, `rata_tunggu`, `created_at`, `created_by`, `updated_at`, `updated_by`, `deleted_at`, `deleted_by`) VALUES
(1, 1, 3, 80, 75, 3.50, '2026-04-29 07:19:05', NULL, NULL, NULL, NULL, NULL),
(2, 2, 3, 40, 35, 4.20, '2026-04-29 07:19:05', NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `2b5_kesesuaian_kerja`
--

CREATE TABLE `2b5_kesesuaian_kerja` (
  `id_2b5` int(11) NOT NULL,
  `id_2b4` int(11) NOT NULL COMMENT 'Relasi ke data masa tunggu TS yang sama',
  `profesi_infokom` int(10) UNSIGNED DEFAULT 0,
  `profesi_non_infokom` int(10) UNSIGNED DEFAULT 0,
  `lingkup_multinasional` int(10) UNSIGNED DEFAULT 0,
  `lingkup_nasional` int(10) UNSIGNED DEFAULT 0,
  `lingkup_wirausaha` int(10) UNSIGNED DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `updated_by` int(11) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `2b5_kesesuaian_kerja`
--

INSERT INTO `2b5_kesesuaian_kerja` (`id_2b5`, `id_2b4`, `profesi_infokom`, `profesi_non_infokom`, `lingkup_multinasional`, `lingkup_nasional`, `lingkup_wirausaha`, `created_at`, `created_by`, `updated_at`, `updated_by`, `deleted_at`, `deleted_by`) VALUES
(1, 1, 60, 15, 10, 50, 15, '2026-04-29 07:19:05', NULL, NULL, NULL, NULL, NULL),
(2, 2, 25, 10, 5, 20, 10, '2026-04-29 07:19:05', NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `2b6_kepuasan_pengguna`
--

CREATE TABLE `2b6_kepuasan_pengguna` (
  `id_2b6` int(11) NOT NULL,
  `id_prodi` int(11) NOT NULL,
  `id_tahun` int(11) NOT NULL,
  `jenis_kemampuan` varchar(100) NOT NULL,
  `sangat_baik` int(10) UNSIGNED DEFAULT 0,
  `baik` int(10) UNSIGNED DEFAULT 0,
  `cukup` int(10) UNSIGNED DEFAULT 0,
  `kurang` int(10) UNSIGNED DEFAULT 0,
  `rencana_tindak_lanjut` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `2b6_kepuasan_pengguna`
--

INSERT INTO `2b6_kepuasan_pengguna` (`id_2b6`, `id_prodi`, `id_tahun`, `jenis_kemampuan`, `sangat_baik`, `baik`, `cukup`, `kurang`, `rencana_tindak_lanjut`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 4, 'Etika', 50, 20, 5, 0, NULL, '2026-04-29 07:19:23', NULL, NULL),
(2, 1, 4, 'Keahlian Bidang Ilmu', 45, 25, 5, 0, NULL, '2026-04-29 07:19:23', NULL, NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `2b6_metadata_lulusan`
--

CREATE TABLE `2b6_metadata_lulusan` (
  `id_metadata` int(11) NOT NULL,
  `id_prodi` int(11) NOT NULL,
  `id_tahun` int(11) NOT NULL,
  `jml_alumni_3_tahun` int(10) UNSIGNED DEFAULT 0,
  `jml_responden` int(10) UNSIGNED DEFAULT 0,
  `jml_mhs_aktif_ts` int(10) UNSIGNED DEFAULT 0,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `2d_ref_sumber_rekognisi`
--

CREATE TABLE `2d_ref_sumber_rekognisi` (
  `id_ref_sumber` int(10) UNSIGNED NOT NULL,
  `nama_sumber` varchar(255) NOT NULL,
  `is_default` tinyint(1) DEFAULT 0 COMMENT '1 jika bawaan LKPS, 0 jika tambahan user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `2d_ref_sumber_rekognisi`
--

INSERT INTO `2d_ref_sumber_rekognisi` (`id_ref_sumber`, `nama_sumber`, `is_default`, `created_at`) VALUES
(1, 'Masyarakat', 1, '2026-04-28 06:24:26'),
(2, 'Dunia Usaha', 1, '2026-04-28 06:24:26'),
(3, 'Dunia Industri', 1, '2026-04-28 06:24:26'),
(4, 'Dunia Kerja', 1, '2026-04-28 06:24:26');

-- --------------------------------------------------------

--
-- Struktur dari tabel `2d_rekognisi_lulusan`
--

CREATE TABLE `2d_rekognisi_lulusan` (
  `id_2d` int(10) UNSIGNED NOT NULL,
  `id_prodi` int(11) NOT NULL,
  `id_tahun` int(11) NOT NULL,
  `id_ref_sumber` int(10) UNSIGNED NOT NULL,
  `jenis_rekognisi` text NOT NULL,
  `link_bukti` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `updated_by` int(11) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `2d_rekognisi_lulusan`
--

INSERT INTO `2d_rekognisi_lulusan` (`id_2d`, `id_prodi`, `id_tahun`, `id_ref_sumber`, `jenis_rekognisi`, `link_bukti`, `created_at`, `created_by`, `updated_at`, `updated_by`, `deleted_at`, `deleted_by`) VALUES
(1, 1, 4, 3, 'Sertifikasi Internasional AWS Solution Architect', 'https://gdrive.link/bukti-rekognisi-1', '2026-04-29 07:19:23', NULL, NULL, NULL, NULL, NULL),
(2, 2, 5, 2, 'Juara 1 Lomba Startup Nasional', 'https://gdrive.link/bukti-rekognisi-2', '2026-04-29 07:19:23', NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `3a1_sarana_prasarana_penelitian`
--

CREATE TABLE `3a1_sarana_prasarana_penelitian` (
  `id_3a1` int(11) NOT NULL,
  `id_prodi` int(11) NOT NULL,
  `nama_prasarana` varchar(255) NOT NULL COMMENT 'Diisi nama laboratorium',
  `daya_tampung` int(10) UNSIGNED DEFAULT 0,
  `luas_ruang` decimal(10,2) DEFAULT 0.00 COMMENT 'Dalam satuan m2',
  `status_milik` enum('M','W') NOT NULL DEFAULT 'M',
  `status_lisensi` enum('L','P','T') NOT NULL DEFAULT 'L',
  `perangkat` text DEFAULT NULL COMMENT 'Hard/Soft-ware, bandwidth, device, tool, dll',
  `info_tambahan` text DEFAULT NULL COMMENT 'Untuk mengisi kolom ..... di gambar',
  `link_bukti` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `updated_by` int(11) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `3a1_sarana_prasarana_penelitian`
--

INSERT INTO `3a1_sarana_prasarana_penelitian` (`id_3a1`, `id_prodi`, `nama_prasarana`, `daya_tampung`, `luas_ruang`, `status_milik`, `status_lisensi`, `perangkat`, `info_tambahan`, `link_bukti`, `created_at`, `created_by`, `updated_at`, `updated_by`, `deleted_at`, `deleted_by`) VALUES
(1, 1, 'Lab Artificial Intelligence', 25, 60.00, 'M', 'L', 'GPU Nvidia RTX 4090, Workstation', NULL, 'https://gdrive.link/sarpras-pen-1', '2026-04-29 07:20:25', NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `3a3_pengembangan_dtpr`
--

CREATE TABLE `3a3_pengembangan_dtpr` (
  `id_pengembangan` int(11) NOT NULL,
  `id_dosen` int(11) NOT NULL,
  `jenis_pengembangan` varchar(255) DEFAULT NULL,
  `nama_pengembangan` varchar(255) DEFAULT NULL,
  `link_bukti` varchar(255) DEFAULT NULL,
  `id_tahun` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `updated_by` int(11) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data untuk tabel `3a3_pengembangan_dtpr`
--

INSERT INTO `3a3_pengembangan_dtpr` (`id_pengembangan`, `id_dosen`, `jenis_pengembangan`, `nama_pengembangan`, `link_bukti`, `id_tahun`, `created_at`, `created_by`, `updated_at`, `updated_by`, `deleted_at`, `deleted_by`) VALUES
(1, 1, 'Pelatihan', 'Workshop Machine Learning', 'https://gdrive.link/pengembangan-1', 1, '2026-04-29 07:11:32', NULL, NULL, NULL, NULL, NULL),
(2, 2, 'Penelitian', 'Jurnal Internasional Terindeks', 'https://gdrive.link/pengembangan-2', 1, '2026-04-29 07:11:32', NULL, NULL, NULL, NULL, NULL),
(3, 3, 'Pengabdian Masyarakat', 'Program Desa Digital', 'https://gdrive.link/pengembangan-3', 1, '2026-04-29 07:11:32', NULL, NULL, NULL, NULL, NULL),
(4, 1, 'Pelatihan', 'Certification Cloud Computing', 'https://gdrive.link/pengembangan-4', 2, '2026-04-29 07:11:32', NULL, NULL, NULL, NULL, NULL),
(5, 2, 'Penelitian', 'Conference Paper Presentasi', 'https://gdrive.link/pengembangan-5', 2, '2026-04-29 07:11:32', NULL, NULL, NULL, NULL, NULL),
(6, 3, 'Pengabdian Masyarakat', 'Workshop Digital Marketing', 'https://gdrive.link/pengembangan-6', 2, '2026-04-29 07:11:32', NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `4a1_sarana_prasarana_pkm`
--

CREATE TABLE `4a1_sarana_prasarana_pkm` (
  `id_4a1` int(11) NOT NULL,
  `id_prodi` int(11) NOT NULL,
  `nama_prasarana` varchar(255) NOT NULL COMMENT 'Diisi nama laboratorium, bengkel, dll',
  `daya_tampung` int(10) UNSIGNED DEFAULT 0,
  `luas_ruang` decimal(10,2) DEFAULT 0.00,
  `status_milik` enum('M','W') NOT NULL DEFAULT 'M',
  `status_lisensi` enum('L','P','T') NOT NULL DEFAULT 'L',
  `perangkat` text DEFAULT NULL COMMENT 'Hard/Soft-ware, bandwidth, device, tool, dll',
  `info_tambahan` text DEFAULT NULL COMMENT 'Untuk mengisi kolom ..... di gambar',
  `link_bukti` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `updated_by` int(11) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `4a1_sarana_prasarana_pkm`
--

INSERT INTO `4a1_sarana_prasarana_pkm` (`id_4a1`, `id_prodi`, `nama_prasarana`, `daya_tampung`, `luas_ruang`, `status_milik`, `status_lisensi`, `perangkat`, `info_tambahan`, `link_bukti`, `created_at`, `created_by`, `updated_at`, `updated_by`, `deleted_at`, `deleted_by`) VALUES
(1, 1, 'Pusat Inovasi Masyarakat', 20, 45.00, 'M', 'L', 'Mobile Lab Kit, Tablet Arsitektur', NULL, 'https://gdrive.link/sarpras-pkm-1', '2026-04-29 07:20:25', NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `5_2_sarana_prasarana_pendidikan`
--

CREATE TABLE `5_2_sarana_prasarana_pendidikan` (
  `id_5_2` int(11) NOT NULL,
  `id_prodi` int(11) NOT NULL,
  `nama_prasarana` varchar(255) NOT NULL COMMENT 'Ruang kelas, Lab, Perpustakaan, dsb',
  `daya_tampung` int(10) UNSIGNED DEFAULT 0,
  `luas_ruang` decimal(10,2) DEFAULT 0.00,
  `status_milik` enum('M','W') NOT NULL DEFAULT 'M',
  `status_lisensi` enum('L','P','T') NOT NULL DEFAULT 'L',
  `perangkat` text DEFAULT NULL COMMENT 'Hard/Soft-ware, bandwidth, device, tool, dll',
  `info_tambahan` text DEFAULT NULL COMMENT 'Untuk mengisi kolom ..... di gambar',
  `link_bukti` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `updated_by` int(11) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `5_2_sarana_prasarana_pendidikan`
--

INSERT INTO `5_2_sarana_prasarana_pendidikan` (`id_5_2`, `id_prodi`, `nama_prasarana`, `daya_tampung`, `luas_ruang`, `status_milik`, `status_lisensi`, `perangkat`, `info_tambahan`, `link_bukti`, `created_at`, `created_by`, `updated_at`, `updated_by`, `deleted_at`, `deleted_by`) VALUES
(1, 1, 'Ruang Kelas Smart Classroom', 40, 80.00, 'M', 'L', 'Smart TV, AC, High-speed WiFi', NULL, 'https://gdrive.link/sarpras-dik-1', '2026-04-29 07:20:25', NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `6_visi_misi`
--

CREATE TABLE `6_visi_misi` (
  `id_vm` int(11) NOT NULL,
  `id_prodi` int(11) NOT NULL,
  `visi_pt` text DEFAULT NULL,
  `misi_pt` text DEFAULT NULL,
  `visi_upps` text DEFAULT NULL,
  `misi_upps` text DEFAULT NULL,
  `visi_keilmuan_ps` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `updated_by` int(11) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data untuk tabel `6_visi_misi`
--

INSERT INTO `6_visi_misi` (`id_vm`, `id_prodi`, `visi_pt`, `misi_pt`, `visi_upps`, `misi_upps`, `visi_keilmuan_ps`, `created_at`, `created_by`, `updated_at`, `updated_by`, `deleted_at`, `deleted_by`) VALUES
(1, 1, 'blablabla', 'blablabla', 'blabla', 'blabla', 'blabla', '2026-04-09 08:38:21', 3, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `dosen`
--

CREATE TABLE `dosen` (
  `id_dosen` int(11) NOT NULL,
  `id_pegawai` int(11) NOT NULL,
  `nidn` varchar(20) DEFAULT NULL,
  `nuptk` varchar(20) DEFAULT NULL,
  `id_prodi` int(11) DEFAULT NULL,
  `perguruan_tinggi` varchar(150) DEFAULT 'STIKOM PGRI Banyuwangi',
  `id_jabatan_fungsional` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data untuk tabel `dosen`
--

INSERT INTO `dosen` (`id_dosen`, `id_pegawai`, `nidn`, `nuptk`, `id_prodi`, `perguruan_tinggi`, `id_jabatan_fungsional`) VALUES
(1, 1, NULL, NULL, 1, 'STIKOM PGRI Banyuwangi', 1),
(2, 2, NULL, NULL, 1, 'STIKOM PGRI Banyuwangi', 2),
(3, 3, NULL, NULL, 1, 'STIKOM PGRI Banyuwangi', 3);

-- --------------------------------------------------------

--
-- Struktur dari tabel `jabatan_fungsional`
--

CREATE TABLE `jabatan_fungsional` (
  `id_jafung` int(11) NOT NULL,
  `nama_jafung` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data untuk tabel `jabatan_fungsional`
--

INSERT INTO `jabatan_fungsional` (`id_jafung`, `nama_jafung`) VALUES
(1, 'Lektor Kepala'),
(2, 'Lektor'),
(3, 'Asisten Ahli'),
(4, 'Tenaga Ahli');

-- --------------------------------------------------------

--
-- Struktur dari tabel `jabatan_struktural`
--

CREATE TABLE `jabatan_struktural` (
  `id_jabatan_struktural` int(11) NOT NULL,
  `nama_jabatan` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data untuk tabel `jabatan_struktural`
--

INSERT INTO `jabatan_struktural` (`id_jabatan_struktural`, `nama_jabatan`) VALUES
(1, 'Ketua'),
(2, 'Staff');

-- --------------------------------------------------------

--
-- Struktur dari tabel `master_cpl`
--

CREATE TABLE `master_cpl` (
  `id_cpl` int(11) NOT NULL,
  `id_prodi` int(11) NOT NULL,
  `kode_cpl` varchar(50) NOT NULL,
  `deskripsi_cpl` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `master_cpl`
--

INSERT INTO `master_cpl` (`id_cpl`, `id_prodi`, `kode_cpl`, `deskripsi_cpl`) VALUES
(1, 2, 'CPL-2-1', 'Bertaqwa kepada Tuhan Yang Maha Esa dan mampu menunjukkan sikap religius serta menjunjung tinggi nilai-nilai kemanusiaan dalam menjalankan tugas berdasarkan agama, moral, dan etika.'),
(2, 2, 'CPL-2-2', 'Menunjukkan sikap bertanggung jawab, etika profesi, kolaboratif, dan adaptif terhadap perkembangan teknologi, serta memiliki komitmen untuk pembelajaran sepanjang hayat.\n'),
(3, 1, 'CPL-1-1', 'Mampu merancang bangun perangkat lunak'),
(4, 1, 'CPL-1-2', 'Mampu mengelola basis data');

-- --------------------------------------------------------

--
-- Struktur dari tabel `master_cpmk`
--

CREATE TABLE `master_cpmk` (
  `id_cpmk` int(11) NOT NULL,
  `id_prodi` int(11) NOT NULL,
  `kode_cpmk` varchar(50) NOT NULL,
  `deskripsi_cpmk` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `master_cpmk`
--

INSERT INTO `master_cpmk` (`id_cpmk`, `id_prodi`, `kode_cpmk`, `deskripsi_cpmk`) VALUES
(1, 2, 'CPMK-2-1', 'Mampu menginternalisasi nilai-nilai ketakwaan kepada Tuhan Yang Maha Esa'),
(2, 2, 'CPMK-2-2', 'Mampu menjalankan kehidupan sosial masyarakat berdasarkan aturan dan norma hukum yang berlaku\n'),
(3, 1, 'CPMK-1-1', 'Mahasiswa dapat menjelaskan konsep algoritma'),
(4, 1, 'CPMK-1-2', 'Mahasiswa dapat membuat query SQL kompleks'),
(5, 1, 'CPMK-1-1', 'Mahasiswa dapat menjelaskan konsep algoritma'),
(6, 1, 'CPMK-1-2', 'Mahasiswa dapat membuat query SQL kompleks');

-- --------------------------------------------------------

--
-- Struktur dari tabel `master_mata_kuliah`
--

CREATE TABLE `master_mata_kuliah` (
  `id_mk` int(11) NOT NULL,
  `id_prodi` int(11) NOT NULL,
  `kode_mk` varchar(50) NOT NULL,
  `nama_mk` varchar(255) NOT NULL,
  `sks` int(11) NOT NULL,
  `semester` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `master_mata_kuliah`
--

INSERT INTO `master_mata_kuliah` (`id_mk`, `id_prodi`, `kode_mk`, `nama_mk`, `sks`, `semester`) VALUES
(1, 2, 'KU312401', 'Algoritma & Pemrograman', 3, 1),
(2, 2, 'KU312411', 'Sistem Basis Data', 2, 1),
(3, 2, 'KU312406', 'Praktek arsitektur komputer', 2, 2),
(4, 1, 'IF101', 'Algoritma & Pemrograman', 3, 1),
(5, 1, 'IF102', 'Struktur Data', 3, 2),
(6, 1, 'IF201', 'Basis Data', 3, 3);

-- --------------------------------------------------------

--
-- Struktur dari tabel `master_profil_lulusan`
--

CREATE TABLE `master_profil_lulusan` (
  `id_pl` int(11) NOT NULL,
  `id_prodi` int(11) NOT NULL,
  `kode_pl` varchar(50) NOT NULL,
  `deskripsi_pl` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `master_profil_lulusan`
--

INSERT INTO `master_profil_lulusan` (`id_pl`, `id_prodi`, `kode_pl`, `deskripsi_pl`) VALUES
(1, 2, 'PL-2-1', 'Menunjukkan sikap profesional yang berintegritas, kolaboratif, dan adaptif, serta memiliki komitmen belajar berkelanjutan yang dilandasi oleh nilai-nilai luhur bangsa.'),
(2, 2, 'PL-2-2', 'Menguasai pengetahuan konseptual mengenai siklus hidup pengembangan sistem, manajemen data dan informasi, serta penerapan teknologi untuk digitalisasi proses bisnis.'),
(3, 2, 'PL-2-3', 'Memiliki keterampilan dalam penyelesaian masalah (problem-solving), komunikasi, kolaborasi tim, serta kemampuan untuk mengelola pekerjaan dan pengembangan diri secara mandiri.'),
(4, 1, 'PL-1-1', 'Pengetahuan dasar komputasi'),
(5, 1, 'PL-1-2', 'Kemampuan rekayasa perangkat lunak'),
(6, 1, 'PL-1-3', 'Komunikasi & teamwork');

-- --------------------------------------------------------

--
-- Struktur dari tabel `master_sks_jabatan`
--

CREATE TABLE `master_sks_jabatan` (
  `id_sks_jabatan` int(11) NOT NULL,
  `nama_pencarian` varchar(100) DEFAULT NULL,
  `sks` decimal(4,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data untuk tabel `master_sks_jabatan`
--

INSERT INTO `master_sks_jabatan` (`id_sks_jabatan`, `nama_pencarian`, `sks`) VALUES
(1, 'Ketua STIKOM', 12.00),
(2, 'Wakil Ketua STIKOM', 10.00),
(3, 'Ketua Jurusan', 8.00),
(4, 'Sekretaris Jurusan', 7.00),
(5, 'Ketua Prodi', 7.00),
(6, 'Sekretaris Prodi', 5.00),
(7, 'Kepala Bagian', 4.00),
(8, 'Kepala Sub Bagian', 2.00),
(9, 'Ketua TPM', 4.00),
(10, 'Staf', 0.00),
(11, 'Non Struktural', 0.00);

-- --------------------------------------------------------

--
-- Struktur dari tabel `pegawai`
--

CREATE TABLE `pegawai` (
  `id_pegawai` int(11) NOT NULL,
  `nama_lengkap` varchar(255) NOT NULL,
  `nikp` varchar(50) DEFAULT NULL,
  `id_unit` int(11) DEFAULT NULL,
  `id_jabatan_struktural` int(11) DEFAULT NULL,
  `pendidikan_terakhir` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data untuk tabel `pegawai`
--

INSERT INTO `pegawai` (`id_pegawai`, `nama_lengkap`, `nikp`, `id_unit`, `id_jabatan_struktural`, `pendidikan_terakhir`) VALUES
(1, 'Erdiyanto, M.Kom.', 'NIKP.001.2024', 1, 1, 'S2'),
(2, 'Rhegysa, M.T.', 'NIKP.002.2024', 9, 1, 'S2'),
(3, 'Budi Santoso, S.Kom.', 'NIKP.003.2024', 5, 2, 'S1');

-- --------------------------------------------------------

--
-- Struktur dari tabel `prodi`
--

CREATE TABLE `prodi` (
  `id_prodi` int(11) NOT NULL,
  `nama_prodi` varchar(100) NOT NULL,
  `id_unit` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data untuk tabel `prodi`
--

INSERT INTO `prodi` (`id_prodi`, `nama_prodi`, `id_unit`) VALUES
(1, 'Teknik Informatika', 9),
(2, 'Manajemen Informatika', 9),
(3, 'Sistem Informasi', 9);

-- --------------------------------------------------------

--
-- Struktur dari tabel `tahun_akademik`
--

CREATE TABLE `tahun_akademik` (
  `id_tahun` int(11) NOT NULL,
  `tahun` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data untuk tabel `tahun_akademik`
--

INSERT INTO `tahun_akademik` (`id_tahun`, `tahun`) VALUES
(1, 2022),
(2, 2023),
(3, 2024),
(4, 2025),
(5, 2026);

-- --------------------------------------------------------

--
-- Struktur dari tabel `tenaga_kependidikan`
--

CREATE TABLE `tenaga_kependidikan` (
  `id_tendik` int(11) NOT NULL,
  `id_pegawai` int(11) NOT NULL,
  `jenis_tendik` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data untuk tabel `tenaga_kependidikan`
--

INSERT INTO `tenaga_kependidikan` (`id_tendik`, `id_pegawai`, `jenis_tendik`) VALUES
(1, 1, 'Laboran / Teknisi IT'),
(2, 2, 'Administrasi Akademik'),
(3, 3, 'Laboran / Teknisi IT');

-- --------------------------------------------------------

--
-- Struktur dari tabel `unit_kerja`
--

CREATE TABLE `unit_kerja` (
  `id_unit` int(11) NOT NULL,
  `nama_unit` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data untuk tabel `unit_kerja`
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
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id_user` int(11) NOT NULL,
  `id_unit` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id_user`, `id_unit`, `username`, `password`) VALUES
(1, 5, 'sisfo', '$2a$12$OV4aMPsI8KpzgyuLtbn.heVQiSsrYqfFliGmfOPd4BvlbUY.B.oa6'),
(2, 11, 'lppm', '$2a$12$OV4aMPsI8KpzgyuLtbn.heVQiSsrYqfFliGmfOPd4BvlbUY.B.oa6'),
(3, 13, 'admin', '$2a$12$OV4aMPsI8KpzgyuLtbn.heVQiSsrYqfFliGmfOPd4BvlbUY.B.oa6'),
(4, 1, 'upps', '$2a$12$OV4aMPsI8KpzgyuLtbn.heVQiSsrYqfFliGmfOPd4BvlbUY.B.oa6');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `1a1_pimpinan_dan_tupoksi`
--
ALTER TABLE `1a1_pimpinan_dan_tupoksi`
  ADD PRIMARY KEY (`id_pimpinan`),
  ADD KEY `id_pegawai` (`id_pegawai`),
  ADD KEY `fk_1a1_jafung` (`id_jafung`);

--
-- Indeks untuk tabel `1a2_sumber_pendanaan_upps`
--
ALTER TABLE `1a2_sumber_pendanaan_upps`
  ADD PRIMARY KEY (`id_sumber`),
  ADD KEY `fk_1a2_tahun` (`id_tahun`);

--
-- Indeks untuk tabel `1a3_penggunaan_dana_upps`
--
ALTER TABLE `1a3_penggunaan_dana_upps`
  ADD PRIMARY KEY (`id_penggunaan`),
  ADD KEY `fk_1a3_tahun` (`id_tahun`);

--
-- Indeks untuk tabel `1a4_beban_dtpr`
--
ALTER TABLE `1a4_beban_dtpr`
  ADD PRIMARY KEY (`id_beban_kerja`),
  ADD KEY `id_dosen` (`id_dosen`),
  ADD KEY `id_pimpinan` (`id_pimpinan`),
  ADD KEY `id_tahun` (`id_tahun`);

--
-- Indeks untuk tabel `1a5_kualifikasi_tendik`
--
ALTER TABLE `1a5_kualifikasi_tendik`
  ADD PRIMARY KEY (`id_1a5`),
  ADD KEY `fk_1a5_prodi` (`id_prodi`),
  ADD KEY `fk_1a5_tahun` (`id_tahun`),
  ADD KEY `fk_1a5_tendik` (`id_tendik`);

--
-- Indeks untuk tabel `1b_unit_spmi_dan_sdm`
--
ALTER TABLE `1b_unit_spmi_dan_sdm`
  ADD PRIMARY KEY (`id_unit_spmi`),
  ADD KEY `fk_spmi_unit` (`id_unit`),
  ADD KEY `fk_spmi_tahun` (`id_tahun`);

--
-- Indeks untuk tabel `2a1_data_mahasiswa`
--
ALTER TABLE `2a1_data_mahasiswa`
  ADD PRIMARY KEY (`id_2a1`),
  ADD KEY `idx_2a1_prodi_tahun` (`prodi_id_prodi`,`tahun_akademik_id_tahun`),
  ADD KEY `fk_2a1_tahun` (`tahun_akademik_id_tahun`);

--
-- Indeks untuk tabel `2b1_isi_pembelajaran`
--
ALTER TABLE `2b1_isi_pembelajaran`
  ADD PRIMARY KEY (`id_2b1`),
  ADD KEY `fk_2b1_mk` (`id_mk`),
  ADD KEY `fk_2b1_pl` (`id_pl`),
  ADD KEY `fk_2b1_tahun` (`id_tahun`);

--
-- Indeks untuk tabel `2b2_pemetaan_cpl_pl`
--
ALTER TABLE `2b2_pemetaan_cpl_pl`
  ADD PRIMARY KEY (`id_2b2`),
  ADD KEY `fk_2b2_cpl` (`id_cpl`),
  ADD KEY `fk_2b2_pl` (`id_pl`),
  ADD KEY `fk_2b2_tahun` (`id_tahun`);

--
-- Indeks untuk tabel `2b3_peta_pemenuhan_cpl`
--
ALTER TABLE `2b3_peta_pemenuhan_cpl`
  ADD PRIMARY KEY (`id_2b3`),
  ADD KEY `fk_2b3_cpl` (`id_cpl`),
  ADD KEY `fk_2b3_cpmk` (`id_cpmk`),
  ADD KEY `fk_2b3_mk` (`id_mk`),
  ADD KEY `fk_2b3_tahun` (`id_tahun`);

--
-- Indeks untuk tabel `2b4_masa_tunggu`
--
ALTER TABLE `2b4_masa_tunggu`
  ADD PRIMARY KEY (`id_2b4`),
  ADD KEY `fk_2b4_prodi` (`id_prodi`),
  ADD KEY `fk_2b4_tahun` (`id_tahun`);

--
-- Indeks untuk tabel `2b5_kesesuaian_kerja`
--
ALTER TABLE `2b5_kesesuaian_kerja`
  ADD PRIMARY KEY (`id_2b5`),
  ADD KEY `fk_2b5_to_2b4` (`id_2b4`);

--
-- Indeks untuk tabel `2b6_kepuasan_pengguna`
--
ALTER TABLE `2b6_kepuasan_pengguna`
  ADD PRIMARY KEY (`id_2b6`),
  ADD KEY `fk_2b6_prodi` (`id_prodi`),
  ADD KEY `fk_2b6_tahun` (`id_tahun`);

--
-- Indeks untuk tabel `2b6_metadata_lulusan`
--
ALTER TABLE `2b6_metadata_lulusan`
  ADD PRIMARY KEY (`id_metadata`),
  ADD KEY `fk_meta_2b6_prodi` (`id_prodi`),
  ADD KEY `fk_meta_2b6_tahun` (`id_tahun`);

--
-- Indeks untuk tabel `2d_ref_sumber_rekognisi`
--
ALTER TABLE `2d_ref_sumber_rekognisi`
  ADD PRIMARY KEY (`id_ref_sumber`);

--
-- Indeks untuk tabel `2d_rekognisi_lulusan`
--
ALTER TABLE `2d_rekognisi_lulusan`
  ADD PRIMARY KEY (`id_2d`),
  ADD KEY `fk_2d_prodi_idx` (`id_prodi`),
  ADD KEY `fk_2d_tahun_idx` (`id_tahun`),
  ADD KEY `fk_2d_sumber_idx` (`id_ref_sumber`);

--
-- Indeks untuk tabel `3a1_sarana_prasarana_penelitian`
--
ALTER TABLE `3a1_sarana_prasarana_penelitian`
  ADD PRIMARY KEY (`id_3a1`),
  ADD KEY `fk_3a1_prodi` (`id_prodi`);

--
-- Indeks untuk tabel `3a3_pengembangan_dtpr`
--
ALTER TABLE `3a3_pengembangan_dtpr`
  ADD PRIMARY KEY (`id_pengembangan`),
  ADD KEY `id_dosen` (`id_dosen`),
  ADD KEY `id_tahun` (`id_tahun`);

--
-- Indeks untuk tabel `4a1_sarana_prasarana_pkm`
--
ALTER TABLE `4a1_sarana_prasarana_pkm`
  ADD PRIMARY KEY (`id_4a1`),
  ADD KEY `fk_4a1_prodi` (`id_prodi`);

--
-- Indeks untuk tabel `5_2_sarana_prasarana_pendidikan`
--
ALTER TABLE `5_2_sarana_prasarana_pendidikan`
  ADD PRIMARY KEY (`id_5_2`),
  ADD KEY `fk_5_2_prodi` (`id_prodi`);

--
-- Indeks untuk tabel `6_visi_misi`
--
ALTER TABLE `6_visi_misi`
  ADD PRIMARY KEY (`id_vm`),
  ADD KEY `id_prodi` (`id_prodi`);

--
-- Indeks untuk tabel `dosen`
--
ALTER TABLE `dosen`
  ADD PRIMARY KEY (`id_dosen`),
  ADD UNIQUE KEY `nidn` (`nidn`),
  ADD UNIQUE KEY `nuptk` (`nuptk`),
  ADD KEY `id_pegawai` (`id_pegawai`),
  ADD KEY `id_prodi` (`id_prodi`),
  ADD KEY `id_jabatan_fungsional` (`id_jabatan_fungsional`);

--
-- Indeks untuk tabel `jabatan_fungsional`
--
ALTER TABLE `jabatan_fungsional`
  ADD PRIMARY KEY (`id_jafung`);

--
-- Indeks untuk tabel `jabatan_struktural`
--
ALTER TABLE `jabatan_struktural`
  ADD PRIMARY KEY (`id_jabatan_struktural`);

--
-- Indeks untuk tabel `master_cpl`
--
ALTER TABLE `master_cpl`
  ADD PRIMARY KEY (`id_cpl`),
  ADD KEY `fk_cpl_prodi` (`id_prodi`);

--
-- Indeks untuk tabel `master_cpmk`
--
ALTER TABLE `master_cpmk`
  ADD PRIMARY KEY (`id_cpmk`),
  ADD KEY `fk_cpmk_prodi` (`id_prodi`);

--
-- Indeks untuk tabel `master_mata_kuliah`
--
ALTER TABLE `master_mata_kuliah`
  ADD PRIMARY KEY (`id_mk`),
  ADD KEY `fk_mk_prodi` (`id_prodi`);

--
-- Indeks untuk tabel `master_profil_lulusan`
--
ALTER TABLE `master_profil_lulusan`
  ADD PRIMARY KEY (`id_pl`),
  ADD KEY `fk_pl_prodi` (`id_prodi`);

--
-- Indeks untuk tabel `master_sks_jabatan`
--
ALTER TABLE `master_sks_jabatan`
  ADD PRIMARY KEY (`id_sks_jabatan`),
  ADD UNIQUE KEY `nama_pencarian` (`nama_pencarian`);

--
-- Indeks untuk tabel `pegawai`
--
ALTER TABLE `pegawai`
  ADD PRIMARY KEY (`id_pegawai`),
  ADD UNIQUE KEY `nikp` (`nikp`),
  ADD KEY `id_unit` (`id_unit`),
  ADD KEY `id_jabatan_struktural` (`id_jabatan_struktural`);

--
-- Indeks untuk tabel `prodi`
--
ALTER TABLE `prodi`
  ADD PRIMARY KEY (`id_prodi`),
  ADD KEY `id_unit` (`id_unit`);

--
-- Indeks untuk tabel `tahun_akademik`
--
ALTER TABLE `tahun_akademik`
  ADD PRIMARY KEY (`id_tahun`);

--
-- Indeks untuk tabel `tenaga_kependidikan`
--
ALTER TABLE `tenaga_kependidikan`
  ADD PRIMARY KEY (`id_tendik`),
  ADD KEY `id_pegawai` (`id_pegawai`);

--
-- Indeks untuk tabel `unit_kerja`
--
ALTER TABLE `unit_kerja`
  ADD PRIMARY KEY (`id_unit`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_user`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `id_unit` (`id_unit`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `1a1_pimpinan_dan_tupoksi`
--
ALTER TABLE `1a1_pimpinan_dan_tupoksi`
  MODIFY `id_pimpinan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `1a2_sumber_pendanaan_upps`
--
ALTER TABLE `1a2_sumber_pendanaan_upps`
  MODIFY `id_sumber` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT untuk tabel `1a3_penggunaan_dana_upps`
--
ALTER TABLE `1a3_penggunaan_dana_upps`
  MODIFY `id_penggunaan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT untuk tabel `1a4_beban_dtpr`
--
ALTER TABLE `1a4_beban_dtpr`
  MODIFY `id_beban_kerja` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT untuk tabel `1a5_kualifikasi_tendik`
--
ALTER TABLE `1a5_kualifikasi_tendik`
  MODIFY `id_1a5` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT untuk tabel `1b_unit_spmi_dan_sdm`
--
ALTER TABLE `1b_unit_spmi_dan_sdm`
  MODIFY `id_unit_spmi` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT untuk tabel `2a1_data_mahasiswa`
--
ALTER TABLE `2a1_data_mahasiswa`
  MODIFY `id_2a1` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT untuk tabel `2b1_isi_pembelajaran`
--
ALTER TABLE `2b1_isi_pembelajaran`
  MODIFY `id_2b1` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `2b2_pemetaan_cpl_pl`
--
ALTER TABLE `2b2_pemetaan_cpl_pl`
  MODIFY `id_2b2` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `2b3_peta_pemenuhan_cpl`
--
ALTER TABLE `2b3_peta_pemenuhan_cpl`
  MODIFY `id_2b3` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `2b4_masa_tunggu`
--
ALTER TABLE `2b4_masa_tunggu`
  MODIFY `id_2b4` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `2b5_kesesuaian_kerja`
--
ALTER TABLE `2b5_kesesuaian_kerja`
  MODIFY `id_2b5` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `2b6_kepuasan_pengguna`
--
ALTER TABLE `2b6_kepuasan_pengguna`
  MODIFY `id_2b6` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `2b6_metadata_lulusan`
--
ALTER TABLE `2b6_metadata_lulusan`
  MODIFY `id_metadata` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `2d_ref_sumber_rekognisi`
--
ALTER TABLE `2d_ref_sumber_rekognisi`
  MODIFY `id_ref_sumber` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT untuk tabel `2d_rekognisi_lulusan`
--
ALTER TABLE `2d_rekognisi_lulusan`
  MODIFY `id_2d` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `3a1_sarana_prasarana_penelitian`
--
ALTER TABLE `3a1_sarana_prasarana_penelitian`
  MODIFY `id_3a1` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `3a3_pengembangan_dtpr`
--
ALTER TABLE `3a3_pengembangan_dtpr`
  MODIFY `id_pengembangan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT untuk tabel `4a1_sarana_prasarana_pkm`
--
ALTER TABLE `4a1_sarana_prasarana_pkm`
  MODIFY `id_4a1` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `5_2_sarana_prasarana_pendidikan`
--
ALTER TABLE `5_2_sarana_prasarana_pendidikan`
  MODIFY `id_5_2` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `6_visi_misi`
--
ALTER TABLE `6_visi_misi`
  MODIFY `id_vm` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `dosen`
--
ALTER TABLE `dosen`
  MODIFY `id_dosen` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `jabatan_fungsional`
--
ALTER TABLE `jabatan_fungsional`
  MODIFY `id_jafung` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT untuk tabel `jabatan_struktural`
--
ALTER TABLE `jabatan_struktural`
  MODIFY `id_jabatan_struktural` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `master_cpl`
--
ALTER TABLE `master_cpl`
  MODIFY `id_cpl` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT untuk tabel `master_cpmk`
--
ALTER TABLE `master_cpmk`
  MODIFY `id_cpmk` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT untuk tabel `master_mata_kuliah`
--
ALTER TABLE `master_mata_kuliah`
  MODIFY `id_mk` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT untuk tabel `master_profil_lulusan`
--
ALTER TABLE `master_profil_lulusan`
  MODIFY `id_pl` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT untuk tabel `master_sks_jabatan`
--
ALTER TABLE `master_sks_jabatan`
  MODIFY `id_sks_jabatan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT untuk tabel `pegawai`
--
ALTER TABLE `pegawai`
  MODIFY `id_pegawai` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `prodi`
--
ALTER TABLE `prodi`
  MODIFY `id_prodi` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `tahun_akademik`
--
ALTER TABLE `tahun_akademik`
  MODIFY `id_tahun` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT untuk tabel `tenaga_kependidikan`
--
ALTER TABLE `tenaga_kependidikan`
  MODIFY `id_tendik` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `unit_kerja`
--
ALTER TABLE `unit_kerja`
  MODIFY `id_unit` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `1a1_pimpinan_dan_tupoksi`
--
ALTER TABLE `1a1_pimpinan_dan_tupoksi`
  ADD CONSTRAINT `1a1_pimpinan_dan_tupoksi_ibfk_1` FOREIGN KEY (`id_pegawai`) REFERENCES `pegawai` (`id_pegawai`),
  ADD CONSTRAINT `fk_1a1_jafung` FOREIGN KEY (`id_jafung`) REFERENCES `jabatan_fungsional` (`id_jafung`);

--
-- Ketidakleluasaan untuk tabel `1a2_sumber_pendanaan_upps`
--
ALTER TABLE `1a2_sumber_pendanaan_upps`
  ADD CONSTRAINT `fk_1a2_tahun` FOREIGN KEY (`id_tahun`) REFERENCES `tahun_akademik` (`id_tahun`);

--
-- Ketidakleluasaan untuk tabel `1a3_penggunaan_dana_upps`
--
ALTER TABLE `1a3_penggunaan_dana_upps`
  ADD CONSTRAINT `fk_1a3_tahun` FOREIGN KEY (`id_tahun`) REFERENCES `tahun_akademik` (`id_tahun`);

--
-- Ketidakleluasaan untuk tabel `1a4_beban_dtpr`
--
ALTER TABLE `1a4_beban_dtpr`
  ADD CONSTRAINT `1a4_beban_dtpr_ibfk_1` FOREIGN KEY (`id_dosen`) REFERENCES `dosen` (`id_dosen`),
  ADD CONSTRAINT `1a4_beban_dtpr_ibfk_2` FOREIGN KEY (`id_pimpinan`) REFERENCES `1a1_pimpinan_dan_tupoksi` (`id_pimpinan`),
  ADD CONSTRAINT `1a4_beban_dtpr_ibfk_3` FOREIGN KEY (`id_tahun`) REFERENCES `tahun_akademik` (`id_tahun`);

--
-- Ketidakleluasaan untuk tabel `1a5_kualifikasi_tendik`
--
ALTER TABLE `1a5_kualifikasi_tendik`
  ADD CONSTRAINT `fk_1a5_prodi` FOREIGN KEY (`id_prodi`) REFERENCES `prodi` (`id_prodi`),
  ADD CONSTRAINT `fk_1a5_tahun` FOREIGN KEY (`id_tahun`) REFERENCES `tahun_akademik` (`id_tahun`),
  ADD CONSTRAINT `fk_1a5_tendik` FOREIGN KEY (`id_tendik`) REFERENCES `tenaga_kependidikan` (`id_tendik`);

--
-- Ketidakleluasaan untuk tabel `1b_unit_spmi_dan_sdm`
--
ALTER TABLE `1b_unit_spmi_dan_sdm`
  ADD CONSTRAINT `fk_spmi_tahun` FOREIGN KEY (`id_tahun`) REFERENCES `tahun_akademik` (`id_tahun`),
  ADD CONSTRAINT `fk_spmi_unit` FOREIGN KEY (`id_unit`) REFERENCES `unit_kerja` (`id_unit`);

--
-- Ketidakleluasaan untuk tabel `2a1_data_mahasiswa`
--
ALTER TABLE `2a1_data_mahasiswa`
  ADD CONSTRAINT `fk_2a1_prodi` FOREIGN KEY (`prodi_id_prodi`) REFERENCES `prodi` (`id_prodi`),
  ADD CONSTRAINT `fk_2a1_tahun` FOREIGN KEY (`tahun_akademik_id_tahun`) REFERENCES `tahun_akademik` (`id_tahun`);

--
-- Ketidakleluasaan untuk tabel `2b1_isi_pembelajaran`
--
ALTER TABLE `2b1_isi_pembelajaran`
  ADD CONSTRAINT `fk_2b1_mk` FOREIGN KEY (`id_mk`) REFERENCES `master_mata_kuliah` (`id_mk`),
  ADD CONSTRAINT `fk_2b1_pl` FOREIGN KEY (`id_pl`) REFERENCES `master_profil_lulusan` (`id_pl`),
  ADD CONSTRAINT `fk_2b1_tahun` FOREIGN KEY (`id_tahun`) REFERENCES `tahun_akademik` (`id_tahun`);

--
-- Ketidakleluasaan untuk tabel `2b2_pemetaan_cpl_pl`
--
ALTER TABLE `2b2_pemetaan_cpl_pl`
  ADD CONSTRAINT `fk_2b2_cpl` FOREIGN KEY (`id_cpl`) REFERENCES `master_cpl` (`id_cpl`),
  ADD CONSTRAINT `fk_2b2_pl` FOREIGN KEY (`id_pl`) REFERENCES `master_profil_lulusan` (`id_pl`),
  ADD CONSTRAINT `fk_2b2_tahun` FOREIGN KEY (`id_tahun`) REFERENCES `tahun_akademik` (`id_tahun`);

--
-- Ketidakleluasaan untuk tabel `2b3_peta_pemenuhan_cpl`
--
ALTER TABLE `2b3_peta_pemenuhan_cpl`
  ADD CONSTRAINT `fk_2b3_cpl` FOREIGN KEY (`id_cpl`) REFERENCES `master_cpl` (`id_cpl`),
  ADD CONSTRAINT `fk_2b3_cpmk` FOREIGN KEY (`id_cpmk`) REFERENCES `master_cpmk` (`id_cpmk`),
  ADD CONSTRAINT `fk_2b3_mk` FOREIGN KEY (`id_mk`) REFERENCES `master_mata_kuliah` (`id_mk`),
  ADD CONSTRAINT `fk_2b3_tahun` FOREIGN KEY (`id_tahun`) REFERENCES `tahun_akademik` (`id_tahun`);

--
-- Ketidakleluasaan untuk tabel `2b4_masa_tunggu`
--
ALTER TABLE `2b4_masa_tunggu`
  ADD CONSTRAINT `fk_2b4_prodi` FOREIGN KEY (`id_prodi`) REFERENCES `prodi` (`id_prodi`),
  ADD CONSTRAINT `fk_2b4_tahun` FOREIGN KEY (`id_tahun`) REFERENCES `tahun_akademik` (`id_tahun`);

--
-- Ketidakleluasaan untuk tabel `2b5_kesesuaian_kerja`
--
ALTER TABLE `2b5_kesesuaian_kerja`
  ADD CONSTRAINT `fk_2b5_to_2b4` FOREIGN KEY (`id_2b4`) REFERENCES `2b4_masa_tunggu` (`id_2b4`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `2b6_kepuasan_pengguna`
--
ALTER TABLE `2b6_kepuasan_pengguna`
  ADD CONSTRAINT `fk_2b6_prodi` FOREIGN KEY (`id_prodi`) REFERENCES `prodi` (`id_prodi`),
  ADD CONSTRAINT `fk_2b6_tahun` FOREIGN KEY (`id_tahun`) REFERENCES `tahun_akademik` (`id_tahun`);

--
-- Ketidakleluasaan untuk tabel `2b6_metadata_lulusan`
--
ALTER TABLE `2b6_metadata_lulusan`
  ADD CONSTRAINT `fk_meta_2b6_prodi` FOREIGN KEY (`id_prodi`) REFERENCES `prodi` (`id_prodi`),
  ADD CONSTRAINT `fk_meta_2b6_tahun` FOREIGN KEY (`id_tahun`) REFERENCES `tahun_akademik` (`id_tahun`);

--
-- Ketidakleluasaan untuk tabel `2d_rekognisi_lulusan`
--
ALTER TABLE `2d_rekognisi_lulusan`
  ADD CONSTRAINT `fk_2d_prodi` FOREIGN KEY (`id_prodi`) REFERENCES `prodi` (`id_prodi`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_2d_sumber` FOREIGN KEY (`id_ref_sumber`) REFERENCES `2d_ref_sumber_rekognisi` (`id_ref_sumber`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_2d_tahun` FOREIGN KEY (`id_tahun`) REFERENCES `tahun_akademik` (`id_tahun`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Ketidakleluasaan untuk tabel `3a1_sarana_prasarana_penelitian`
--
ALTER TABLE `3a1_sarana_prasarana_penelitian`
  ADD CONSTRAINT `fk_3a1_prodi` FOREIGN KEY (`id_prodi`) REFERENCES `prodi` (`id_prodi`);

--
-- Ketidakleluasaan untuk tabel `3a3_pengembangan_dtpr`
--
ALTER TABLE `3a3_pengembangan_dtpr`
  ADD CONSTRAINT `3a3_pengembangan_dtpr_ibfk_1` FOREIGN KEY (`id_dosen`) REFERENCES `dosen` (`id_dosen`),
  ADD CONSTRAINT `3a3_pengembangan_dtpr_ibfk_2` FOREIGN KEY (`id_tahun`) REFERENCES `tahun_akademik` (`id_tahun`);

--
-- Ketidakleluasaan untuk tabel `4a1_sarana_prasarana_pkm`
--
ALTER TABLE `4a1_sarana_prasarana_pkm`
  ADD CONSTRAINT `fk_4a1_prodi` FOREIGN KEY (`id_prodi`) REFERENCES `prodi` (`id_prodi`);

--
-- Ketidakleluasaan untuk tabel `5_2_sarana_prasarana_pendidikan`
--
ALTER TABLE `5_2_sarana_prasarana_pendidikan`
  ADD CONSTRAINT `fk_5_2_prodi` FOREIGN KEY (`id_prodi`) REFERENCES `prodi` (`id_prodi`);

--
-- Ketidakleluasaan untuk tabel `6_visi_misi`
--
ALTER TABLE `6_visi_misi`
  ADD CONSTRAINT `6_visi_misi_ibfk_1` FOREIGN KEY (`id_prodi`) REFERENCES `prodi` (`id_prodi`);

--
-- Ketidakleluasaan untuk tabel `dosen`
--
ALTER TABLE `dosen`
  ADD CONSTRAINT `dosen_ibfk_1` FOREIGN KEY (`id_pegawai`) REFERENCES `pegawai` (`id_pegawai`),
  ADD CONSTRAINT `dosen_ibfk_2` FOREIGN KEY (`id_prodi`) REFERENCES `prodi` (`id_prodi`),
  ADD CONSTRAINT `dosen_ibfk_3` FOREIGN KEY (`id_jabatan_fungsional`) REFERENCES `jabatan_fungsional` (`id_jafung`);

--
-- Ketidakleluasaan untuk tabel `master_cpl`
--
ALTER TABLE `master_cpl`
  ADD CONSTRAINT `fk_cpl_prodi` FOREIGN KEY (`id_prodi`) REFERENCES `prodi` (`id_prodi`);

--
-- Ketidakleluasaan untuk tabel `master_cpmk`
--
ALTER TABLE `master_cpmk`
  ADD CONSTRAINT `fk_cpmk_prodi` FOREIGN KEY (`id_prodi`) REFERENCES `prodi` (`id_prodi`);

--
-- Ketidakleluasaan untuk tabel `master_mata_kuliah`
--
ALTER TABLE `master_mata_kuliah`
  ADD CONSTRAINT `fk_mk_prodi` FOREIGN KEY (`id_prodi`) REFERENCES `prodi` (`id_prodi`);

--
-- Ketidakleluasaan untuk tabel `master_profil_lulusan`
--
ALTER TABLE `master_profil_lulusan`
  ADD CONSTRAINT `fk_pl_prodi` FOREIGN KEY (`id_prodi`) REFERENCES `prodi` (`id_prodi`);

--
-- Ketidakleluasaan untuk tabel `pegawai`
--
ALTER TABLE `pegawai`
  ADD CONSTRAINT `pegawai_ibfk_1` FOREIGN KEY (`id_unit`) REFERENCES `unit_kerja` (`id_unit`),
  ADD CONSTRAINT `pegawai_ibfk_2` FOREIGN KEY (`id_jabatan_struktural`) REFERENCES `jabatan_struktural` (`id_jabatan_struktural`);

--
-- Ketidakleluasaan untuk tabel `prodi`
--
ALTER TABLE `prodi`
  ADD CONSTRAINT `prodi_ibfk_1` FOREIGN KEY (`id_unit`) REFERENCES `unit_kerja` (`id_unit`);

--
-- Ketidakleluasaan untuk tabel `tenaga_kependidikan`
--
ALTER TABLE `tenaga_kependidikan`
  ADD CONSTRAINT `tenaga_kependidikan_ibfk_1` FOREIGN KEY (`id_pegawai`) REFERENCES `pegawai` (`id_pegawai`);

--
-- Ketidakleluasaan untuk tabel `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`id_unit`) REFERENCES `unit_kerja` (`id_unit`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;