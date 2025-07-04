package com.example.GestionCourrier.Entite;

import com.example.GestionCourrier.Entite.StatutDecompte;

public class HistoriqueUtils {

    public static String genererDescription(StatutDecompte ancien, StatutDecompte nouveau) {
        if (ancien == StatutDecompte.EN_ATTENTE && nouveau == StatutDecompte.SERVICE_SCF) {
            return "Envoyé à Service SCF";
        } else if (ancien == StatutDecompte.SERVICE_SCF && nouveau == StatutDecompte.BCP) {
            return "Envoyé au bureau BCP";
        } else if (ancien == StatutDecompte.BCP && nouveau == StatutDecompte.ATP) {
            return "Envoyé à ATP";
        } else if (ancien == StatutDecompte.BCP && nouveau == StatutDecompte.REJETE_BCP) {
            return "Rejeté par BCP";
        } else if (ancien == StatutDecompte.ATP && nouveau == StatutDecompte.ACCEPTE) {
            return "Décompte payé";
        } else if (ancien == StatutDecompte.ATP && nouveau == StatutDecompte.REJETE_ATP) {
            return "Rejeté par ATP";
        } else if (ancien == StatutDecompte.REJETE_ATP && nouveau == StatutDecompte.REJETE_ATP_S) {
            return "Rejeté par ATP, envoyé à Service SCF";
        } else if (ancien == StatutDecompte.REJETE_ATP_S && nouveau == StatutDecompte.REJETE_ATP_E) {
            return "Rejeté par ATP, envoyé à DPF";
        } else if (ancien == StatutDecompte.REJETE_BCP && nouveau == StatutDecompte.REJETE_BCP_E) {
            return "Rejeté par BCP, envoyé à DPF";
        } else {
            return "Changement de statut de " + ancien + " à " + nouveau;
        }
    }
}
