package com.example.GestionCourrier.Repository;

import com.example.GestionCourrier.Entite.HistoriqueStatut;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HistoriqueStatutRepository extends JpaRepository<HistoriqueStatut, Long> {
}