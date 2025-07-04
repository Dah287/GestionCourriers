package com.example.GestionCourrier.Entite;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

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

    //

    private LocalDate  date_envoi_scf;
    private LocalDate date_envoi_bcp;
    private LocalDate date_envoi_atp;
    private LocalDate date_envoi_bcp_scf;
    private LocalDate date_envoi_scf_dpf;
    private LocalDate date_rejete_atp;
    private LocalDate date_rejete_bcp;

    @OneToMany(mappedBy = "decompte", cascade = CascadeType.ALL)
    private List<HistoriqueStatut> historiqueStatuts = new ArrayList<>() ;

    // Getter
    public List<HistoriqueStatut> getHistoriqueStatuts() {
        return historiqueStatuts;
    }

    // Setter
    public void setHistoriqueStatuts(List<HistoriqueStatut> historiqueStatuts) {
        this.historiqueStatuts = historiqueStatuts;
    }


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

//
public LocalDate getDate_envoi_scf() {
    return date_envoi_scf;
}

    public void setDate_envoi_scf(LocalDate date_envoi_scf) {
        this.date_envoi_scf = date_envoi_scf;
    }

    public LocalDate getDate_envoi_bcp() {
        return date_envoi_bcp;
    }

    public void setDate_envoi_bcp(LocalDate date_envoi_bcp) {
        this.date_envoi_bcp = date_envoi_bcp;
    }

    public LocalDate getDate_envoi_atp() {
        return date_envoi_atp;
    }

    public void setDate_envoi_atp(LocalDate date_envoi_atp) {
        this.date_envoi_atp = date_envoi_atp;
    }

    public LocalDate getDate_envoi_bcp_scf() {
        return date_envoi_bcp_scf;
    }

    public void setDate_envoi_bcp_scf(LocalDate date_envoi_bcp_scf) {
        this.date_envoi_bcp_scf = date_envoi_bcp_scf;
    }

    public LocalDate getDate_envoi_scf_dpf() {
        return date_envoi_scf_dpf;
    }

    public void setDate_envoi_scf_dpf(LocalDate date_envoi_scf_dpf) {
        this.date_envoi_scf_dpf = date_envoi_scf_dpf;
    }

    public LocalDate getDate_rejete_atp() {
        return date_rejete_atp;
    }

    public void setDate_rejete_atp(LocalDate date_rejete_atp) {
        this.date_rejete_atp = date_rejete_atp;
    }

    public LocalDate getDate_rejete_bcp() {
        return date_rejete_bcp;
    }

    public void setDate_rejete_bcp(LocalDate date_rejete_bcp) {
        this.date_rejete_bcp = date_rejete_bcp;
    }


}
