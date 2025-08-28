-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 12, 2025 at 10:33 AM
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
-- Database: `bd_courriers`
--

-- --------------------------------------------------------

--
-- Table structure for table `courriers`
--

CREATE TABLE `courriers` (
  `date_arrivee` date NOT NULL,
  `date_envoi` date DEFAULT NULL,
  `date_expediteur` date DEFAULT NULL,
  `date_reception_bureau` date DEFAULT NULL,
  `date_reception_service` date DEFAULT NULL,
  `urgent` bit(1) NOT NULL,
  `id` bigint(20) NOT NULL,
  `bureau_recepteur` varchar(255) DEFAULT NULL,
  `copies` text DEFAULT NULL,
  `delais_jours` varchar(255) DEFAULT NULL,
  `entite_expeditrice` varchar(255) NOT NULL,
  `entite_transmise` varchar(255) DEFAULT NULL,
  `instruction_supplementaire` text DEFAULT NULL,
  `langue` varchar(255) DEFAULT NULL,
  `numero_ordre` varchar(255) NOT NULL,
  `objet` varchar(255) DEFAULT NULL,
  `reference` varchar(255) DEFAULT NULL,
  `service_destinataire` varchar(255) DEFAULT NULL,
  `type_courrier` varchar(255) NOT NULL,
  `status` enum('ARCHIVE','ENVOYE','EN_ATTENTE','RECU_BUREAU','RECU_SERVICE','TRAITE') DEFAULT NULL,
  `date_traitement` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `courriers`
--

INSERT INTO `courriers` (`date_arrivee`, `date_envoi`, `date_expediteur`, `date_reception_bureau`, `date_reception_service`, `urgent`, `id`, `bureau_recepteur`, `copies`, `delais_jours`, `entite_expeditrice`, `entite_transmise`, `instruction_supplementaire`, `langue`, `numero_ordre`, `objet`, `reference`, `service_destinataire`, `type_courrier`, `status`, `date_traitement`) VALUES
('2025-07-09', NULL, '2025-07-30', NULL, NULL, b'1', 32, NULL, 'copy1@domain.com', '12', 'Direction', 'DPF', 'Mettre à jour le statut du courrier original', 'Arabe', 'FAX-2025', 'Test  Mettre à jour le statut du courrier original', 'REF-FAX-2025', 'SERVICE DE LA PLANIFICATION', 'Fax', 'EN_ATTENTE', NULL),
('2025-07-09', NULL, '2025-07-30', NULL, NULL, b'1', 33, NULL, 'copy1@domain.com', '12', 'Direction', 'DPF', 'Mettre à jour le statut du courrier original', 'Arabe', 'FAX-2025', 'Test  Mettre à jour le statut du courrier original', 'REF-FAX-2025', 'SERVICE DE LA COMPTABILITE ET FINANCES', 'Fax', 'EN_ATTENTE', NULL),
('2025-07-09', '2025-07-09', '2025-07-30', '2025-07-09', '2025-07-09', b'1', 34, 'BUREAU DE L\'EXPLOITATION ET DE LA MAINTENANCE DU SYSTÈME INFORMATIQUE', 'copy1@domain.com', '12', 'Direction', 'DPF', 'Mettre à jour le statut du courrier original', 'Arabe', 'FAX-2025', 'Test  Mettre à jour le statut du courrier original', 'REF-FAX-2025', 'SERVICE INFORMATIQUE', 'Fax', 'TRAITE', '2025-07-09'),
('2025-07-09', '2025-07-09', '2025-07-30', NULL, '2025-07-09', b'1', 35, 'BUREAU DE ETUDE ET DEVELOPPEMENT INFORMATIQUE', 'copy1@domain.com', '12', 'Direction', 'DPF', 'Mettre à jour le statut du courrier original', 'Arabe', 'FAX-2025', 'Test  Mettre à jour le statut du courrier original', 'REF-FAX-2025', 'SERVICE INFORMATIQUE', 'Fax', 'RECU_BUREAU', NULL),
('2025-07-09', '2025-07-09', '2025-07-09', NULL, '2025-07-09', b'1', 36, NULL, '', '21', 'DDA', 'DPF', 'sssssss', 'Français', 'test', 'test test', 'test', 'SERVICE INFORMATIQUE', 'Fax', 'TRAITE', '2025-07-09'),
('2025-07-09', NULL, '2025-07-09', NULL, NULL, b'1', 37, NULL, '', '21', 'DDA', 'DPF', 'sssssss', 'Français', 'test', 'test test', 'test', 'SERVICE DE LA PLANIFICATION', 'Fax', 'EN_ATTENTE', NULL),
('2025-07-09', '2025-07-09', '2025-07-09', '2025-07-09', '2025-07-09', b'1', 38, 'BUREAU DE L\'EXPLOITATION ET DE LA MAINTENANCE DU SYSTÈME INFORMATIQUE', '', '21', 'DDA', 'DPF', 'sssssss', 'Français', 'test', 'test test', 'test', 'SERVICE INFORMATIQUE', 'Fax', 'TRAITE', '2025-07-09'),
('2025-07-09', '2025-07-09', '2025-07-09', NULL, '2025-07-09', b'1', 39, 'BUREAU DE ETUDE ET DEVELOPPEMENT INFORMATIQUE', '', '21', 'DDA', 'DPF', 'sssssss', 'Français', 'test', 'test test', 'test', 'SERVICE INFORMATIQUE', 'Fax', 'RECU_BUREAU', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `courrier_instructions`
--

CREATE TABLE `courrier_instructions` (
  `instruction_value` bit(1) DEFAULT NULL,
  `courrier_id` bigint(20) NOT NULL,
  `instruction_key` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `courrier_instructions`
--

INSERT INTO `courrier_instructions` (`instruction_value`, `courrier_id`, `instruction_key`) VALUES
(b'0', 5, 'application'),
(b'0', 5, 'avecAccord'),
(b'1', 5, 'elementReponse'),
(b'0', 5, 'enquete'),
(b'0', 5, 'etude'),
(b'0', 5, 'exploitationCompte'),
(b'0', 7, 'application'),
(b'0', 7, 'avecAccord'),
(b'1', 7, 'elementReponse'),
(b'0', 7, 'enquete'),
(b'0', 7, 'etude'),
(b'0', 7, 'exploitationCompte'),
(b'0', 8, 'application'),
(b'0', 8, 'avecAccord'),
(b'0', 8, 'elementReponse'),
(b'0', 8, 'enquete'),
(b'0', 8, 'etude'),
(b'1', 8, 'exploitationCompte'),
(b'0', 9, 'application'),
(b'0', 9, 'avecAccord'),
(b'0', 9, 'elementReponse'),
(b'0', 9, 'enquete'),
(b'0', 9, 'etude'),
(b'1', 9, 'exploitationCompte'),
(b'0', 10, 'application'),
(b'0', 10, 'avecAccord'),
(b'0', 10, 'elementReponse'),
(b'0', 10, 'enquete'),
(b'0', 10, 'etude'),
(b'1', 10, 'exploitationCompte'),
(b'0', 11, 'application'),
(b'0', 11, 'avecAccord'),
(b'0', 11, 'elementReponse'),
(b'0', 11, 'enquete'),
(b'0', 11, 'etude'),
(b'1', 11, 'exploitationCompte'),
(b'0', 12, 'application'),
(b'0', 12, 'avecAccord'),
(b'1', 12, 'elementReponse'),
(b'0', 12, 'enquete'),
(b'0', 12, 'etude'),
(b'0', 12, 'exploitationCompte'),
(b'0', 13, 'application'),
(b'0', 13, 'avecAccord'),
(b'1', 13, 'elementReponse'),
(b'0', 13, 'enquete'),
(b'0', 13, 'etude'),
(b'1', 13, 'exploitationCompte'),
(b'0', 14, 'application'),
(b'0', 14, 'avecAccord'),
(b'1', 14, 'elementReponse'),
(b'0', 14, 'enquete'),
(b'0', 14, 'etude'),
(b'1', 14, 'exploitationCompte'),
(b'0', 15, 'application'),
(b'0', 15, 'avecAccord'),
(b'1', 15, 'elementReponse'),
(b'0', 15, 'enquete'),
(b'0', 15, 'etude'),
(b'1', 15, 'exploitationCompte'),
(b'0', 16, 'application'),
(b'0', 16, 'avecAccord'),
(b'1', 16, 'elementReponse'),
(b'0', 16, 'enquete'),
(b'0', 16, 'etude'),
(b'1', 16, 'exploitationCompte'),
(b'0', 17, 'application'),
(b'0', 17, 'avecAccord'),
(b'1', 17, 'elementReponse'),
(b'0', 17, 'enquete'),
(b'0', 17, 'etude'),
(b'1', 17, 'exploitationCompte'),
(b'0', 18, 'application'),
(b'0', 18, 'avecAccord'),
(b'1', 18, 'elementReponse'),
(b'0', 18, 'enquete'),
(b'0', 18, 'etude'),
(b'1', 18, 'exploitationCompte'),
(b'0', 19, 'application'),
(b'0', 19, 'avecAccord'),
(b'1', 19, 'elementReponse'),
(b'0', 19, 'enquete'),
(b'0', 19, 'etude'),
(b'1', 19, 'exploitationCompte'),
(b'0', 20, 'application'),
(b'1', 20, 'avecAccord'),
(b'0', 20, 'elementReponse'),
(b'0', 20, 'enquete'),
(b'0', 20, 'etude'),
(b'0', 20, 'exploitationCompte'),
(b'0', 21, 'application'),
(b'1', 21, 'avecAccord'),
(b'0', 21, 'elementReponse'),
(b'0', 21, 'enquete'),
(b'0', 21, 'etude'),
(b'0', 21, 'exploitationCompte'),
(b'0', 22, 'application'),
(b'1', 22, 'avecAccord'),
(b'0', 22, 'elementReponse'),
(b'0', 22, 'enquete'),
(b'0', 22, 'etude'),
(b'0', 22, 'exploitationCompte'),
(b'0', 23, 'application'),
(b'1', 23, 'avecAccord'),
(b'0', 23, 'elementReponse'),
(b'0', 23, 'enquete'),
(b'0', 23, 'etude'),
(b'0', 23, 'exploitationCompte'),
(b'0', 24, 'application'),
(b'1', 24, 'avecAccord'),
(b'0', 24, 'elementReponse'),
(b'0', 24, 'enquete'),
(b'0', 24, 'etude'),
(b'0', 24, 'exploitationCompte'),
(b'0', 25, 'application'),
(b'1', 25, 'avecAccord'),
(b'0', 25, 'elementReponse'),
(b'0', 25, 'enquete'),
(b'0', 25, 'etude'),
(b'0', 25, 'exploitationCompte'),
(b'0', 26, 'application'),
(b'1', 26, 'avecAccord'),
(b'0', 26, 'elementReponse'),
(b'0', 26, 'enquete'),
(b'0', 26, 'etude'),
(b'0', 26, 'exploitationCompte'),
(b'0', 27, 'application'),
(b'0', 27, 'avecAccord'),
(b'0', 27, 'elementReponse'),
(b'0', 27, 'enquete'),
(b'0', 27, 'etude'),
(b'1', 27, 'exploitationCompte'),
(b'0', 28, 'application'),
(b'0', 28, 'avecAccord'),
(b'0', 28, 'elementReponse'),
(b'0', 28, 'enquete'),
(b'0', 28, 'etude'),
(b'1', 28, 'exploitationCompte'),
(b'0', 29, 'application'),
(b'0', 29, 'avecAccord'),
(b'0', 29, 'elementReponse'),
(b'0', 29, 'enquete'),
(b'0', 29, 'etude'),
(b'1', 29, 'exploitationCompte'),
(b'0', 30, 'application'),
(b'0', 30, 'avecAccord'),
(b'0', 30, 'elementReponse'),
(b'0', 30, 'enquete'),
(b'0', 30, 'etude'),
(b'1', 30, 'exploitationCompte'),
(b'0', 32, 'application'),
(b'0', 32, 'avecAccord'),
(b'1', 32, 'elementReponse'),
(b'0', 32, 'enquete'),
(b'0', 32, 'etude'),
(b'1', 32, 'exploitationCompte'),
(b'0', 33, 'application'),
(b'0', 33, 'avecAccord'),
(b'1', 33, 'elementReponse'),
(b'0', 33, 'enquete'),
(b'0', 33, 'etude'),
(b'1', 33, 'exploitationCompte'),
(b'0', 34, 'application'),
(b'0', 34, 'avecAccord'),
(b'1', 34, 'elementReponse'),
(b'0', 34, 'enquete'),
(b'0', 34, 'etude'),
(b'1', 34, 'exploitationCompte'),
(b'0', 35, 'application'),
(b'0', 35, 'avecAccord'),
(b'1', 35, 'elementReponse'),
(b'0', 35, 'enquete'),
(b'0', 35, 'etude'),
(b'1', 35, 'exploitationCompte'),
(b'0', 36, 'application'),
(b'0', 36, 'avecAccord'),
(b'1', 36, 'elementReponse'),
(b'0', 36, 'enquete'),
(b'0', 36, 'etude'),
(b'0', 36, 'exploitationCompte'),
(b'0', 37, 'application'),
(b'0', 37, 'avecAccord'),
(b'1', 37, 'elementReponse'),
(b'0', 37, 'enquete'),
(b'0', 37, 'etude'),
(b'0', 37, 'exploitationCompte'),
(b'0', 38, 'application'),
(b'0', 38, 'avecAccord'),
(b'1', 38, 'elementReponse'),
(b'0', 38, 'enquete'),
(b'0', 38, 'etude'),
(b'0', 38, 'exploitationCompte'),
(b'0', 39, 'application'),
(b'0', 39, 'avecAccord'),
(b'1', 39, 'elementReponse'),
(b'0', 39, 'enquete'),
(b'0', 39, 'etude'),
(b'0', 39, 'exploitationCompte');

-- --------------------------------------------------------

--
-- Table structure for table `courrier_services_transmis`
--

CREATE TABLE `courrier_services_transmis` (
  `courrier_id` bigint(20) NOT NULL,
  `service_transmis` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `courrier_services_transmis`
--

INSERT INTO `courrier_services_transmis` (`courrier_id`, `service_transmis`) VALUES
(5, 'SERVICE INFORMATIQUE'),
(7, 'SERVICE DE LA PLANIFICATION'),
(8, 'SERVICE INFORMATIQUE'),
(9, 'SERVICE DE LA PLANIFICATION'),
(10, 'SERVICE DE LA COMPTABILITE ET FINANCES'),
(12, 'SERVICE DE LA PLANIFICATION'),
(13, 'SERVICE INFORMATIQUE'),
(14, 'SERVICE DE LA PLANIFICATION'),
(15, 'SERVICE DE LA COMPTABILITE ET FINANCES'),
(16, 'SERVICE DE LA PLANIFICATION'),
(17, 'SERVICE DE LA PLANIFICATION'),
(18, 'SERVICE DE LA PLANIFICATION'),
(19, 'SERVICE DE LA PLANIFICATION'),
(20, 'SERVICE INFORMATIQUE'),
(21, 'SERVICE DE LA PLANIFICATION'),
(22, 'SERVICE DE LA COMPTABILITE ET FINANCES'),
(23, 'SERVICE DE LA PLANIFICATION'),
(24, 'SERVICE DE LA PLANIFICATION'),
(25, 'SERVICE INFORMATIQUE'),
(26, 'SERVICE INFORMATIQUE'),
(27, 'SERVICE INFORMATIQUE'),
(28, 'SERVICE INFORMATIQUE'),
(29, 'SERVICE INFORMATIQUE'),
(30, 'SERVICE INFORMATIQUE'),
(32, 'SERVICE DE LA PLANIFICATION'),
(33, 'SERVICE DE LA COMPTABILITE ET FINANCES'),
(34, 'SERVICE INFORMATIQUE'),
(35, 'SERVICE INFORMATIQUE'),
(36, 'SERVICE INFORMATIQUE'),
(37, 'SERVICE DE LA PLANIFICATION'),
(38, 'SERVICE INFORMATIQUE'),
(39, 'SERVICE INFORMATIQUE');

-- --------------------------------------------------------

--
-- Table structure for table `decompte`
--

CREATE TABLE `decompte` (
  `annee` int(11) DEFAULT NULL,
  `date_attachement` date DEFAULT NULL,
  `date_etablis` date DEFAULT NULL,
  `date_signature` date DEFAULT NULL,
  `montant` double DEFAULT NULL,
  `id` bigint(20) NOT NULL,
  `marche_id` bigint(20) DEFAULT NULL,
  `motif` varchar(255) DEFAULT NULL,
  `num_decompte` varchar(255) DEFAULT NULL,
  `statut` enum('ACCEPTE','ATP','BCP','EN_ATTENTE','REJETE_ATP','REJETE_BCP','REJETE_ATP_E','REJETE_BCP_E','REJETE_ATP_S','REJETE_BCP_S','SERVICE_SCF') DEFAULT NULL,
  `date_envoi_atp` date DEFAULT NULL,
  `date_envoi_bcp` date DEFAULT NULL,
  `date_envoi_bcp_scf` date DEFAULT NULL,
  `date_envoi_scf` date DEFAULT NULL,
  `date_envoi_scf_dpf` date DEFAULT NULL,
  `date_rejete_atp` date DEFAULT NULL,
  `date_rejete_bcp` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `decompte`
--

INSERT INTO `decompte` (`annee`, `date_attachement`, `date_etablis`, `date_signature`, `montant`, `id`, `marche_id`, `motif`, `num_decompte`, `statut`, `date_envoi_atp`, `date_envoi_bcp`, `date_envoi_bcp_scf`, `date_envoi_scf`, `date_envoi_scf_dpf`, `date_rejete_atp`, `date_rejete_bcp`) VALUES
(2025, '2025-07-03', '2025-07-03', '2025-07-03', 2.01, 8, 26, 'document inconnu', 'OP-2025-003', 'REJETE_BCP_E', NULL, '2025-07-08', NULL, '2025-07-08', NULL, NULL, '2025-07-08'),
(2025, '2025-07-03', '2025-07-03', '2025-07-03', 550000, 9, 22, 'TEST', 'OP-2025-009', 'SERVICE_SCF', '2025-07-03', '2025-07-03', NULL, NULL, NULL, NULL, NULL),
(2025, '2025-07-04', '2025-07-04', '2025-07-04', 2340000, 10, 22, 'Test Rapport ', 'OP-2025-011', 'REJETE_BCP_E', '2025-07-04', '2025-07-10', NULL, '2025-07-04', NULL, '2025-07-04', '2025-07-10'),
(2025, '2025-07-15', '2025-07-12', '2025-07-07', 150000, 11, 22, 'test rapport 3', 'DP 05/2025', 'REJETE_ATP_E', '2025-07-10', '2025-07-10', NULL, '2025-07-10', NULL, '2025-07-10', '2025-07-10'),
(2025, '2025-07-09', '2025-07-09', '2025-07-09', 120000, 12, 26, NULL, '08/2025/DK-DPF', 'EN_ATTENTE', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(2025, '2025-07-21', '2025-07-21', '2025-07-21', 212, 13, 23, NULL, '17/2025/DK-DGR', 'EN_ATTENTE', NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `decomptes`
--

CREATE TABLE `decomptes` (
  `id_decompte` bigint(20) NOT NULL,
  `annee` int(11) DEFAULT NULL,
  `date_attachement` date DEFAULT NULL,
  `date_creat` datetime(6) DEFAULT NULL,
  `date_decompte` date DEFAULT NULL,
  `date_envoi_entite_source` date DEFAULT NULL,
  `date_modif` datetime(6) DEFAULT NULL,
  `date_paiement_rejet` date DEFAULT NULL,
  `date_reception_entite_actuelle` date DEFAULT NULL,
  `date_signature_decompte` date DEFAULT NULL,
  `entite` varchar(255) DEFAULT NULL,
  `entite_decompte` varchar(255) DEFAULT NULL,
  `entite_destination` varchar(255) DEFAULT NULL,
  `fournisseur` varchar(255) DEFAULT NULL,
  `montant` double DEFAULT NULL,
  `num_decompte` varchar(255) DEFAULT NULL,
  `num_etape` int(11) DEFAULT NULL,
  `num_operation` varchar(255) DEFAULT NULL,
  `situation_decompte` varchar(255) DEFAULT NULL,
  `user_creat` varchar(255) DEFAULT NULL,
  `user_modif` varchar(255) DEFAULT NULL,
  `date_rejet` datetime(6) DEFAULT NULL,
  `etape_actuelle` int(11) NOT NULL,
  `motif_rejet` varchar(255) DEFAULT NULL,
  `statut` enum('ACCEPTE','EN_ATTENTE','REJETE_ATP','REJETE_BCP','BCP','ATP','SERVICE_SCF') DEFAULT NULL,
  `user_rejet` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `decomptes`
--

INSERT INTO `decomptes` (`id_decompte`, `annee`, `date_attachement`, `date_creat`, `date_decompte`, `date_envoi_entite_source`, `date_modif`, `date_paiement_rejet`, `date_reception_entite_actuelle`, `date_signature_decompte`, `entite`, `entite_decompte`, `entite_destination`, `fournisseur`, `montant`, `num_decompte`, `num_etape`, `num_operation`, `situation_decompte`, `user_creat`, `user_modif`, `date_rejet`, `etape_actuelle`, `motif_rejet`, `statut`, `user_rejet`) VALUES
(9, 2025, '2025-06-23', '2025-06-23 10:00:30.000000', '2025-06-23', '2025-06-23', NULL, NULL, '2025-06-23', '2025-06-23', 'Service Comptabilité', 'Service Comptabilité', 'Direction Générale', 'tzs', 1234, '111', 1, '111', 'EN_ATTENTE', 'admin', NULL, NULL, 1, '', 'EN_ATTENTE', '');

-- --------------------------------------------------------

--
-- Table structure for table `historique_statut`
--

CREATE TABLE `historique_statut` (
  `id` bigint(20) NOT NULL,
  `ancien_statut` enum('ACCEPTE','ATP','BCP','EN_ATTENTE','REJETE_ATP','REJETE_ATP_E','REJETE_ATP_S','REJETE_BCP','REJETE_BCP_E','REJETE_BCP_S','SERVICE_SCF') DEFAULT NULL,
  `date_changement` datetime(6) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `nouveau_statut` enum('ACCEPTE','ATP','BCP','EN_ATTENTE','REJETE_ATP','REJETE_ATP_E','REJETE_ATP_S','REJETE_BCP','REJETE_BCP_E','REJETE_BCP_S','SERVICE_SCF') DEFAULT NULL,
  `decompte_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `historique_statut`
--

INSERT INTO `historique_statut` (`id`, `ancien_statut`, `date_changement`, `description`, `nouveau_statut`, `decompte_id`) VALUES
(1, 'EN_ATTENTE', '2025-07-03 16:08:14.000000', 'Envoyé à Service SCF', 'SERVICE_SCF', 9),
(2, 'SERVICE_SCF', '2025-07-03 16:28:27.000000', 'Envoyé au bureau BCP', 'BCP', 9),
(3, 'BCP', '2025-07-03 16:29:11.000000', 'Envoyé à ATP', 'ATP', 9),
(4, 'ATP', '2025-07-03 16:29:36.000000', 'Rejeté par ATP', 'REJETE_ATP', 9),
(5, 'REJETE_ATP', '2025-07-03 16:29:51.000000', 'Rejeté par ATP, envoyé à Service SCF', 'REJETE_ATP_S', 9),
(6, 'REJETE_ATP_S', '2025-07-03 16:30:31.000000', 'Rejeté par ATP, envoyé à DPF', 'REJETE_ATP_E', 9),
(7, 'REJETE_ATP_E', '2025-07-03 16:31:10.000000', 'Changement de statut de REJETE_ATP_E à SERVICE_SCF', 'SERVICE_SCF', 9),
(8, 'EN_ATTENTE', '2025-07-04 09:40:34.000000', 'Envoyé à Service SCF', 'SERVICE_SCF', 10),
(9, 'SERVICE_SCF', '2025-07-04 09:40:55.000000', 'Envoyé au bureau BCP', 'BCP', 10),
(10, 'BCP', '2025-07-04 09:41:30.000000', 'Envoyé à ATP', 'ATP', 10),
(11, 'ATP', '2025-07-04 09:41:43.000000', 'Rejeté par ATP', 'REJETE_ATP', 10),
(12, 'REJETE_ATP', '2025-07-04 09:41:57.000000', 'Rejeté par ATP, envoyé à Service SCF', 'REJETE_ATP_S', 10),
(13, 'REJETE_ATP_S', '2025-07-04 09:42:14.000000', 'Rejeté par ATP, envoyé à DPF', 'REJETE_ATP_E', 10),
(14, 'EN_ATTENTE', '2025-07-07 16:00:49.000000', 'Envoyé à Service SCF', 'SERVICE_SCF', 11),
(15, 'SERVICE_SCF', '2025-07-07 16:02:28.000000', 'Envoyé au bureau BCP', 'BCP', 11),
(16, 'BCP', '2025-07-07 16:04:26.000000', 'Envoyé à ATP', 'ATP', 11),
(17, 'ATP', '2025-07-07 16:04:55.000000', 'Rejeté par ATP', 'REJETE_ATP', 11),
(18, 'REJETE_ATP', '2025-07-07 16:05:12.000000', 'Rejeté par ATP, envoyé à Service SCF', 'REJETE_ATP_S', 11),
(19, 'REJETE_ATP_S', '2025-07-07 16:06:50.000000', 'Rejeté par ATP, envoyé à DPF', 'REJETE_ATP_E', 11),
(20, 'EN_ATTENTE', '2025-07-08 11:39:30.000000', 'Envoyé à Service SCF', 'SERVICE_SCF', 8),
(21, 'SERVICE_SCF', '2025-07-08 11:40:05.000000', 'Envoyé au bureau BCP', 'BCP', 8),
(22, 'BCP', '2025-07-08 14:21:40.000000', 'Rejeté par BCP', 'REJETE_BCP', 8),
(23, 'REJETE_BCP', '2025-07-08 14:22:18.000000', 'Rejeté par BCP, envoyé à DPF', 'REJETE_BCP_E', 8),
(25, 'ATP', '2025-07-09 15:18:12.000000', 'Décompte payé', 'ACCEPTE', 3),
(26, 'REJETE_ATP_E', '2025-07-10 11:37:03.000000', 'Changement de statut de REJETE_ATP_E à SERVICE_SCF', 'SERVICE_SCF', 10),
(27, 'SERVICE_SCF', '2025-07-10 11:38:06.000000', 'Envoyé au bureau BCP', 'BCP', 10),
(28, 'BCP', '2025-07-10 11:38:32.000000', 'Rejeté par BCP', 'REJETE_BCP', 10),
(29, 'REJETE_BCP', '2025-07-10 11:39:11.000000', 'Rejeté par BCP, envoyé à DPF', 'REJETE_BCP_E', 10),
(30, 'REJETE_ATP_E', '2025-07-10 11:54:23.000000', 'Envoyé à Service SCF', 'SERVICE_SCF', 11),
(31, 'SERVICE_SCF', '2025-07-10 11:55:10.000000', 'Envoyé au bureau BCP', 'BCP', 11),
(32, 'BCP', '2025-07-10 11:55:45.000000', 'Rejeté par BCP', 'REJETE_BCP', 11),
(33, 'REJETE_BCP', '2025-07-10 11:55:58.000000', 'Rejeté par BCP, envoyé à DPF', 'REJETE_BCP_E', 11),
(34, 'REJETE_BCP_E', '2025-07-10 11:57:54.000000', 'Envoyé à Service SCF', 'SERVICE_SCF', 11),
(35, 'SERVICE_SCF', '2025-07-10 11:58:07.000000', 'Envoyé au bureau BCP', 'BCP', 11),
(36, 'BCP', '2025-07-10 11:58:28.000000', 'Envoyé à ATP', 'ATP', 11),
(37, 'ATP', '2025-07-10 11:58:42.000000', 'Rejeté par ATP', 'REJETE_ATP', 11),
(38, 'REJETE_ATP', '2025-07-10 11:58:48.000000', 'Rejeté par ATP, envoyé à Service SCF', 'REJETE_ATP_S', 11),
(39, 'REJETE_ATP_S', '2025-07-10 11:59:01.000000', 'Rejeté par ATP, envoyé à DPF', 'REJETE_ATP_E', 11);

-- --------------------------------------------------------

--
-- Table structure for table `marche`
--

CREATE TABLE `marche` (
  `montant` double DEFAULT NULL,
  `id` bigint(20) NOT NULL,
  `entite` varchar(255) DEFAULT NULL,
  `fournisseur` varchar(255) DEFAULT NULL,
  `num_operation` varchar(255) DEFAULT NULL,
  `objet` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `marche`
--

INSERT INTO `marche` (`montant`, `id`, `entite`, `fournisseur`, `num_operation`, `objet`) VALUES
(3678522, 22, 'DA', 'SOCIETE GLOBAL D\'INVESTISSEMENT ET TRADING', '18/2025/DK-DA', 'Travaux d\'entretien des pistes aménagées et des ouvrages dans le périmètre irrigué des Doukkala'),
(2729012.87, 23, 'DGR', 'ER-SAR', '17/2025/DK-DGR', 'Prestations de gardiennage des bâtiments techniques et leurs annexes de l’office Régional de Mise en Valeur Agricole des Doukkala'),
(3664674.43, 24, 'DGR', 'World Gardiennage Sercice', '03/2025/DK-DGR', 'Prestation de gardiennage des prises et des ouvrages du réseau d\'irrigation du périmètre des Doukkala'),
(489480, 25, 'DPF', 'GADMAY-CONSO', '07/2025/DK-DPF', 'Acquisition de Matériel Informatique'),
(480000, 26, 'DPF', 'Near secure', '08/2025/DK-DPF', 'Diagnostic de la sécurité du système d’information de l’ORMVAD'),
(491673.6, 27, 'DDA', 'CAPITAL INGENIERIE', '14/2025/DK-DDA', 'Assistance technique pour le traitement des dossiers de subvention'),
(294600, 28, 'DPF', 'INFORMATION TECHNOLOGY CONSULTING', '10/2025/DK-DPF', 'Elaboration du schéma directeur informatique'),
(1106799.84, 29, 'DDA', 'STE ADINI', '15/2025/DK-DDA', 'Plantation du cactus 320 ha (Lotn°1)'),
(485040, 30, 'SMG', 'AMINA MULTI SERVICES', '11/2025/DK-SMG', 'Acquisition de fournitures informatiques et produits d’impression'),
(396840, 31, 'SMG', 'SETA BUREAU', '13/2025/DK-SMG', 'Acquisition de mobilier de bureau pour les services de l\'ORMVAD'),
(298500, 32, 'SMG', 'DAMANA KIT', '12/2025/DK-SMG', 'Acquisition de fournitures de bureau'),
(1866768, 33, 'DDA', 'FRAUMANE', '16/2025/DK-DDA', 'Plantation du cactus 320 ha (Lotn°2)'),
(247708.8, 35, 'DGR', 'KASTRAV', '19/2025/DK-DGR', 'Travaux d\'entretien de l\'ascenseur et du monte-charge de la station de pompage haut service des Doukkala'),
(384704.38, 36, 'DDA', 'KETO CONCEPTION ET REALISATION', '22/2025/DK-DDA', 'Fourniture et pose des équipements d’irrigation au niveau de la station expérimentale de mise en valeur agricole de Zemamra'),
(111000, 37, 'DDA', 'CAPITAL INGENIERIE', '20/2025/DK-DDA', 'AT Plantation du cactus 320 h ( Lotn°1)'),
(192240, 38, 'DDA', 'CAPITAL INGENIERIE', '21/2025/DK-DDA', 'AT Plantation du cactus 320 h (Lotn°2)'),
(478491.2, 39, 'SMG', 'MEDIA TARGET TECHNOLOGY', '23/2025/DK-SMG', 'Acquisition, installation et mise en service d’un système de sonorisation pour l’ORMVAD'),
(123000, 40, 'DPF', 'test', 'test', 'test');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('ADMIN','USER','CHEF_BCP','CHEF_SCF','CHEF_BUREAU','CHEF_SERVICE','SECRETARIAT','SECRETARIAT_DPF') DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `matricule` varchar(255) NOT NULL,
  `bureau` varchar(255) DEFAULT NULL,
  `entite` varchar(255) DEFAULT NULL,
  `service` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `password`, `role`, `username`, `matricule`, `bureau`, `entite`, `service`) VALUES
(9, '$2a$10$OeP6ei0fZfIcmjsdzW7QFesq0P0NIq.RSRtjEtiqGiDcxMoO1VSHO', 'ADMIN', 'BARDAGUI HASNAA', '7830', NULL, 'DPF', 'SERVICE INFORMATIQUE'),
(10, '$2a$10$KIwjTB/nrxK4hvv03zKecOHnfODkw/TQa2bpHjWGlkbRflLNpzeZy', 'SECRETARIAT_DPF', 'OUARGA FATIMA', '7597', NULL, 'DPF', NULL),
(11, '$2a$10$1mQM14YhIgH/DgFW/keGAeh3kwx7tXmsdaF30WU9BfJqvD2Dh4fwW', 'SECRETARIAT', 'KHEDRAOUEL KHADIJA', '7801', NULL, 'DPF', 'SERVICE DE LA COMPTABILITE ET FINANCES'),
(12, '$2a$10$f.aPRUHjdr.v87.2m5Y3Pe.F0lAmM6FoXIzGAFB7uVXo2i5bWenCC', 'CHEF_BUREAU', 'BOURKENE  MAZINE', '7879', 'BUREAU DE LA COMPTABILITE PUBLIQUE', 'DPF', 'SERVICE DE LA COMPTABILITE ET FINANCES'),
(18, '$2a$10$CiWszo15YGBeYg9sGETzeeHP6Ed4XmFZNfdGrqIoTYPwfji6j6862', 'CHEF_SERVICE', 'EL IAZIJI AZIZ', '7542', NULL, NULL, 'SERVICE DE LA PLANIFICATION'),
(19, '$2a$10$exSXOTlor2AHG8TDWwVFO.aPd/0nsPnN9jsQ5/oKuoAt3Z1KtkHd2', 'CHEF_BUREAU', 'BENNAZIZ HOUMMANE HAMID', '7697', 'BUREAU DE SUIVI EVALUATION', NULL, 'SERVICE DE LA PLANIFICATION'),
(21, '$2a$10$uhjTCjPD78WpzHZTAw2JzuMSxMM91jq9Tf5q1SCDc3wMtRDGDWe3q', 'CHEF_BUREAU', 'MESSAOUDI BRAHIM', '7897', 'BUREAU DE L\'EXPLOITATION ET DE LA MAINTENANCE DU SYSTÈME INFORMATIQUE', NULL, 'SERVICE INFORMATIQUE'),
(22, '$2a$10$84HfLMLN6GweaQv2StEHG.tO94vG6o87WgjgsNqhz.PCrv567u9YO', 'ADMIN', 'Admin Admin', '1111', NULL, NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `courriers`
--
ALTER TABLE `courriers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `courrier_instructions`
--
ALTER TABLE `courrier_instructions`
  ADD PRIMARY KEY (`courrier_id`,`instruction_key`);

--
-- Indexes for table `courrier_services_transmis`
--
ALTER TABLE `courrier_services_transmis`
  ADD KEY `FKdia5qjvyvid0wutv8dsrbkbn7` (`courrier_id`);

--
-- Indexes for table `decompte`
--
ALTER TABLE `decompte`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKembvffesgps21b36pvm23ga9s` (`marche_id`);

--
-- Indexes for table `decomptes`
--
ALTER TABLE `decomptes`
  ADD PRIMARY KEY (`id_decompte`);

--
-- Indexes for table `historique_statut`
--
ALTER TABLE `historique_statut`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKc0mvieyh77dvxsg1vsqemutxi` (`decompte_id`);

--
-- Indexes for table `marche`
--
ALTER TABLE `marche`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKr43af9ap4edm43mmtq01oddj6` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `courriers`
--
ALTER TABLE `courriers`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `decompte`
--
ALTER TABLE `decompte`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `decomptes`
--
ALTER TABLE `decomptes`
  MODIFY `id_decompte` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `historique_statut`
--
ALTER TABLE `historique_statut`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `marche`
--
ALTER TABLE `marche`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `courrier_instructions`
--
ALTER TABLE `courrier_instructions`
  ADD CONSTRAINT `FK3iu9bhl07w815yg6vfx41kfxw` FOREIGN KEY (`courrier_id`) REFERENCES `courriers` (`id`);

--
-- Constraints for table `courrier_services_transmis`
--
ALTER TABLE `courrier_services_transmis`
  ADD CONSTRAINT `FKdia5qjvyvid0wutv8dsrbkbn7` FOREIGN KEY (`courrier_id`) REFERENCES `courriers` (`id`);

--
-- Constraints for table `decompte`
--
ALTER TABLE `decompte`
  ADD CONSTRAINT `FKembvffesgps21b36pvm23ga9s` FOREIGN KEY (`marche_id`) REFERENCES `marche` (`id`);

--
-- Constraints for table `historique_statut`
--
ALTER TABLE `historique_statut`
  ADD CONSTRAINT `FKc0mvieyh77dvxsg1vsqemutxi` FOREIGN KEY (`decompte_id`) REFERENCES `decompte` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
