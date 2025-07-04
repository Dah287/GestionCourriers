package com.example.GestionCourrier.Repository;
import com.example.GestionCourrier.Entite.Decompte;
import com.example.GestionCourrier.Entite.StatutDecompte;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DecompteRepository extends JpaRepository<Decompte , Long> {
    List<Decompte> findByMarcheId(Long marcheId);
    List<Decompte> findByStatut(StatutDecompte  statut);
    List<Decompte> findByStatutIn(List<StatutDecompte> statuts);

}
