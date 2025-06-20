package com.example.GestionCourrier.Service;



import com.example.GestionCourrier.Entite.Courrier;
import com.example.GestionCourrier.Entite.Status;
import com.example.GestionCourrier.Repository.CourrierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CourrierService {

    private final CourrierRepository  courrierRepository;

    @Autowired
    public CourrierService(CourrierRepository courrierRepository) {
        this.courrierRepository = courrierRepository;
    }

    public Courrier createCourrier(Courrier  courrier) {
        return courrierRepository.save(courrier);
    }

    public Courrier updateCourrier(Long id, Courrier courrierDetails) {
        Courrier courrier = courrierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Courrier non trouvé avec l'id: " + id));

        // Mise à jour des champs
        courrier.setDateArrivee(courrierDetails.getDateArrivee());
        courrier.setTypeCourrier(courrierDetails.getTypeCourrier());
        courrier.setNumeroOrdre(courrierDetails.getNumeroOrdre());
        courrier.setEntiteExpeditrice(courrierDetails.getEntiteExpeditrice());
        courrier.setDateExpediteur(courrierDetails.getDateExpediteur());
        courrier.setReference(courrierDetails.getReference());
        courrier.setObjet(courrierDetails.getObjet());
        courrier.setLangue(courrierDetails.getLangue());
        courrier.setCopies(courrierDetails.getCopies());
        courrier.setUrgent(courrierDetails.isUrgent());
        courrier.setDelaisJours(courrierDetails.getDelaisJours());
        courrier.setInstructions(courrierDetails.getInstructions());
        courrier.setInstructionSupplementaire(courrierDetails.getInstructionSupplementaire());
        //courrier.setEntitesTransmises(courrierDetails.getEntitesTransmises());

        return courrierRepository.save(courrier);
    }



    public Courrier updateCourrierStatus(Long id, Courrier courrierDetails) {
        Courrier courrier = courrierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Courrier non trouvé avec l'id: " + id));

        // Mise à jour des champs
        courrier.setStatus(courrierDetails.getStatus());

        return courrierRepository.save(courrier);
    }
   //  Méthode pour status = RECU_SERVICE et entitesTransmises = valeur donnée
    public List<Courrier> getCourriersParStatusEtEntiteTransmise(String entite) {
        return courrierRepository.findByStatusAndServiceDestinataire(Status .RECU_SERVICE, entite);
    }
    // Méthode pour status = RECU_SERVICE et entitesTransmises = valeur donnée
    public List<Courrier> getCourriersParStatusEtEntiteTransmise2(String entite) {
        return courrierRepository.findByStatusAndBureauRecepteur(Status .RECU_BUREAU, entite);
    }
    public List<Courrier> getAllCourriers() {
        return courrierRepository.findAll();
    }

    public Courrier getCourrierById(Long id) {
        return courrierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Courrier non trouvé avec l'id: " + id));
    }

    public void deleteCourrier(Long id) {
        Courrier courrier = courrierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Courrier non trouvé avec l'id: " + id));
        courrierRepository.delete(courrier);
    }
}