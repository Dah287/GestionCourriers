package com.example.GestionCourrier.Entite;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "courriers")
public class Courrier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "date_arrivee", nullable = false)
    private LocalDate dateArrivee;

    @Column(name = "type_courrier", nullable = false)
    private String typeCourrier;

    @Column(name = "numero_ordre",  nullable = false)
    private String numeroOrdre;

    @Column(name = "entite_expeditrice", nullable = false)
    private String entiteExpeditrice;

    @Column(name = "date_expediteur")
    private LocalDate dateExpediteur;

    private String reference;
    private String objet;
    private String langue;

    @Column(name = "copies", columnDefinition = "TEXT")
    private String copies;

    private boolean urgent;

    @Column(name = "delais_jours")
    private String delaisJours;

    @ElementCollection
    @CollectionTable(name = "courrier_instructions", joinColumns = @JoinColumn(name = "courrier_id"))
    @MapKeyColumn(name = "instruction_key")
    @Column(name = "instruction_value")
    private Map<String, Boolean> instructions;

    @Column(name = "instruction_supplementaire", columnDefinition = "TEXT")
    private String instructionSupplementaire;

    private String entiteTransmise;

    @ElementCollection
    @CollectionTable(name = "courrier_services_transmis", joinColumns = @JoinColumn(name = "courrier_id"))
    @Column(name = "service_transmis")
    private List<String> servicesTransmis;

    private String serviceDestinataire;



    // Nouveaux champs ajoutés
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status;

    @Column(name = "date_envoi")
    private LocalDate dateEnvoi;

    @Column(name = "date_reception_service")
    private LocalDate dateReceptionService;

    @Column(name = "date_reception_bureau")
    private LocalDate dateReceptionBureau;

    @Column(name = "bureau_recepteur")
    private String bureauRecepteur;


    // Constructeurs
    public Courrier() {
    }

    // Getters et Setters
    public Long getId() {
        return id;
    }
    // getter & setter
    public String getBureauRecepteur() {
        return bureauRecepteur;
    }

    public void setBureauRecepteur(String bureauRecepteur) {
        this.bureauRecepteur = bureauRecepteur;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDateArrivee() {
        return dateArrivee;
    }

    public void setDateArrivee(LocalDate dateArrivee) {
        this.dateArrivee = dateArrivee;
    }

    public String getTypeCourrier() {
        return typeCourrier;
    }

    public void setTypeCourrier(String typeCourrier) {
        this.typeCourrier = typeCourrier;
    }

    public String getNumeroOrdre() {
        return numeroOrdre;
    }

    public void setNumeroOrdre(String numeroOrdre) {
        this.numeroOrdre = numeroOrdre;
    }

    public String getEntiteExpeditrice() {
        return entiteExpeditrice;
    }

    public void setEntiteExpeditrice(String entiteExpeditrice) {
        this.entiteExpeditrice = entiteExpeditrice;
    }

    public LocalDate getDateExpediteur() {
        return dateExpediteur;
    }

    public void setDateExpediteur(LocalDate dateExpediteur) {
        this.dateExpediteur = dateExpediteur;
    }

    public String getReference() {
        return reference;
    }

    public void setReference(String reference) {
        this.reference = reference;
    }

    public String getObjet() {
        return objet;
    }

    public void setObjet(String objet) {
        this.objet = objet;
    }

    public String getLangue() {
        return langue;
    }

    public void setLangue(String langue) {
        this.langue = langue;
    }

    public String getCopies() {
        return copies;
    }

    public void setCopies(String copies) {
        this.copies = copies;
    }

    public boolean isUrgent() {
        return urgent;
    }

    public void setUrgent(boolean urgent) {
        this.urgent = urgent;
    }

    public String getDelaisJours() {
        return delaisJours;
    }

    public void setDelaisJours(String delaisJours) {
        this.delaisJours = delaisJours;
    }

    public Map<String, Boolean> getInstructions() {
        return instructions;
    }

    public void setInstructions(Map<String, Boolean> instructions) {
        this.instructions = instructions;
    }

    public String getInstructionSupplementaire() {
        return instructionSupplementaire;
    }

    public void setInstructionSupplementaire(String instructionSupplementaire) {
        this.instructionSupplementaire = instructionSupplementaire;
    }

    public String getEntiteTransmise() {
        return entiteTransmise;
    }

    public void setEntiteTransmise(String entiteTransmise) {
        this.entiteTransmise = entiteTransmise;
    }

    public List<String> getServicesTransmis() {
        return servicesTransmis;
    }

    public void setServicesTransmis(List<String> servicesTransmis) {
        this.servicesTransmis = servicesTransmis;
    }

    public String getServiceDestinataire() {
        return serviceDestinataire;
    }

    public void setServiceDestinataire(String serviceDestinataire) {
        this.serviceDestinataire = serviceDestinataire;
    }


    // Getters et Setters pour les nouveaux champs
    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public LocalDate getDateEnvoi() {
        return dateEnvoi;
    }

    public void setDateEnvoi(LocalDate dateEnvoi) {
        this.dateEnvoi = dateEnvoi;
    }

    public LocalDate getDateReceptionService() {
        return dateReceptionService;
    }

    public void setDateReceptionService(LocalDate dateReceptionService) {
        this.dateReceptionService = dateReceptionService;
    }

    public LocalDate getDateReceptionBureau() {
        return dateReceptionBureau;
    }

    public void setDateReceptionBureau(LocalDate dateReceptionBureau) {
        this.dateReceptionBureau = dateReceptionBureau;
    }
}