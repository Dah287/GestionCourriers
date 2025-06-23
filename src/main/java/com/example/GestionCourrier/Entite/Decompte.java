package com.example.GestionCourrier.Entite;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.Date;

@Entity
public class Decompte {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer annee;
    private String numDecompte;
    private Double montant;

    @Temporal(TemporalType.DATE)
    private Date dateAttachement;

    @Temporal(TemporalType.DATE)
    private Date dateEtablis;

    @Temporal(TemporalType.DATE)
    private Date dateSignature;

    @Enumerated(EnumType.STRING)
    private StatutDecompte statut; // EN_ATTENTE, ACCEPTE, REJETE

    private String motif;

    @ManyToOne
    @JoinColumn(name = "marche_id")
    private Marche marche;


    // Getters
    public Long getId() {
        return id;
    }

    public Integer getAnnee() {
        return annee;
    }

    public String getNumDecompte() {
        return numDecompte;
    }

    public Double getMontant() {
        return montant;
    }

    public Date getDateAttachement() {
        return dateAttachement;
    }

    public Date getDateEtablis() {
        return dateEtablis;
    }

    public Date getDateSignature() {
        return dateSignature;
    }

    public StatutDecompte getStatut() {
        return statut;
    }

    public String getMotif() {
        return motif;
    }

    public Marche getMarche() {
        return marche;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setAnnee(Integer annee) {
        this.annee = annee;
    }

    public void setNumDecompte(String numDecompte) {
        this.numDecompte = numDecompte;
    }

    public void setMontant(Double montant) {
        this.montant = montant;
    }

    public void setDateAttachement(Date dateAttachement) {
        this.dateAttachement = dateAttachement;
    }

    public void setDateEtablis(Date dateEtablis) {
        this.dateEtablis = dateEtablis;
    }

    public void setDateSignature(Date dateSignature) {
        this.dateSignature = dateSignature;
    }

    public void setStatut(StatutDecompte statut) {
        this.statut = statut;
    }

    public void setMotif(String motif) {
        this.motif = motif;
    }

    public void setMarche(Marche marche) {
        this.marche = marche;
    }


}
