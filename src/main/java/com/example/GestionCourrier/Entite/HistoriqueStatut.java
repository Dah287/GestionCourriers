package com.example.GestionCourrier.Entite;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class HistoriqueStatut {

    @Id
    @GeneratedValue (strategy = GenerationType .IDENTITY)
    private Long id;

    @Enumerated (EnumType.STRING)
    private StatutDecompte ancienStatut;

    @Enumerated(EnumType.STRING)
    private StatutDecompte nouveauStatut;

    private String description; // ✅ le "nom" ou résumé de l'action

    private LocalDateTime  dateChangement;

    @ManyToOne
    @JoinColumn(name = "decompte_id")
    @JsonIgnore
    private Decompte decompte;



    public HistoriqueStatut() {}

    public HistoriqueStatut(StatutDecompte ancienStatut, StatutDecompte nouveauStatut, String description, LocalDateTime dateChangement, Decompte decompte) {
        this.ancienStatut = ancienStatut;
        this.nouveauStatut = nouveauStatut;
        this.description = description;
        this.dateChangement = dateChangement;
        this.decompte = decompte;
    }

    // Getters et Setters...

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public StatutDecompte getAncienStatut() {
        return ancienStatut;
    }

    public void setAncienStatut(StatutDecompte ancienStatut) {
        this.ancienStatut = ancienStatut;
    }

    public StatutDecompte getNouveauStatut() {
        return nouveauStatut;
    }

    public void setNouveauStatut(StatutDecompte nouveauStatut) {
        this.nouveauStatut = nouveauStatut;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getDateChangement() {
        return dateChangement;
    }

    public void setDateChangement(LocalDateTime dateChangement) {
        this.dateChangement = dateChangement;
    }

    public Decompte getDecompte() {
        return decompte;
    }

    public void setDecompte(Decompte decompte) {
        this.decompte = decompte;
    }
}
