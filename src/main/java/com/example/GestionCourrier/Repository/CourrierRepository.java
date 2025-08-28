package com.example.GestionCourrier.Repository;

import com.example.GestionCourrier.Entite.Courrier;
import com.example.GestionCourrier.Entite.Status;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CourrierRepository extends JpaRepository<Courrier , Long> {

//    Courrier findByNumeroOrdre(String numeroOrdre);
//    Optional <Courrier> findById(Long id);
//    // Recherche contenant la chaîne entitesTransmises (LIKE %entitesTransmises%)
//    List <Courrier> findByEntitesTransmisesContaining(String entitesTransmises);

    List<Courrier> findByStatusAndServiceDestinataire(Status status, String entitesTransmises);
    List<Courrier> findByStatusAndBureauRecepteur(Status status, String bureauRecepteur);
    List<Courrier> findByStatusInAndServiceDestinataire(List<Status> statuses, String entite);
    List<Courrier> findByStatusInAndBureauRecepteur(List<Status> statuses, String entite);

}
