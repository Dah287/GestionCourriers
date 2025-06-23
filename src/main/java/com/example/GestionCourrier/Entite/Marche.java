package com.example.GestionCourrier.Entite;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.List;

@Entity
public class Marche {
    @Id
    @GeneratedValue (strategy = GenerationType .IDENTITY)
    private Long id;

    private String numOperation;
    private String objet;
    private String fournisseur;
    private Double montant;
    private String entite;

    @OneToMany (mappedBy = "marche", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List <Decompte> decomptes;

    // Getters
    public Long getId() {
        return id;
    }

    public String getNumOperation() {
        return numOperation;
    }

    public String getObjet() {
        return objet;
    }

    public String getFournisseur() {
        return fournisseur;
    }

    public Double getMontant() {
        return montant;
    }

    public String getEntite() {
        return entite;
    }

    public List<Decompte> getDecomptes() {
        return decomptes;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setNumOperation(String numOperation) {
        this.numOperation = numOperation;
    }

    public void setObjet(String objet) {
        this.objet = objet;
    }

    public void setFournisseur(String fournisseur) {
        this.fournisseur = fournisseur;
    }

    public void setMontant(Double montant) {
        this.montant = montant;
    }

    public void setEntite(String entite) {
        this.entite = entite;
    }

    public void setDecomptes(List<Decompte> decomptes) {
        this.decomptes = decomptes;
    }
}