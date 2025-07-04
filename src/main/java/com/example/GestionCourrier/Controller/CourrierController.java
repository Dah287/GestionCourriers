package com.example.GestionCourrier.Controller;

import com.example.GestionCourrier.Entite.Courrier;
import com.example.GestionCourrier.Entite.Status;
import com.example.GestionCourrier.Repository.CourrierRepository;
import com.example.GestionCourrier.Service.CourrierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/courriers")
@CrossOrigin(origins = "http://192.168.1.44:3000")
public class CourrierController {

    private final CourrierService  courrierService;
    @Autowired
    private CourrierRepository courrierRepository;
    public CourrierController(CourrierService courrierService) {
        this.courrierService = courrierService;
    }

    @PostMapping
    public ResponseEntity<Courrier > createCourrier(@RequestBody Courrier courrier) {
        Courrier savedCourrier = courrierService.createCourrier(courrier);
        return new ResponseEntity<>(savedCourrier, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Courrier> updateCourrier(
            @PathVariable Long id,
            @RequestBody Courrier courrier) {
        Courrier updatedCourrier = courrierService.updateCourrier(id, courrier);
        return ResponseEntity.ok(updatedCourrier);
    }

    @PutMapping("update-status-traiteeeee/{id}")
    public ResponseEntity<Courrier> updateCourrierStatus(
            @PathVariable Long id,
            @RequestBody Courrier courrier) {
        Courrier updatedCourrier = courrierService.updateCourrier(id, courrier);
        return ResponseEntity.ok(updatedCourrier);
    }

    @PutMapping("update-status-traite/{id}")
    public ResponseEntity<Courrier> updateStatusTraite(@PathVariable Long id) {
        Courrier courrier = courrierRepository.findById(id).orElseThrow();

        Status ancienStatut = courrier.getStatus();
        Status nouveauStatut = Status.TRAITE;

        courrier.setStatus(nouveauStatut);

        LocalDate now = LocalDate.now();

        if (ancienStatut == Status.RECU_SERVICE) {
            courrier.setDateReceptionService(now);
            courrier.setDateTraitement(now);
        } else if (ancienStatut == Status.RECU_BUREAU) {
            courrier.setDateReceptionBureau(now);
            courrier.setDateTraitement(now);
        } else if (ancienStatut == Status.EN_ATTENTE) {
            //courrier.setDateReceptionBureau(now);
            courrier.setDateTraitement(now);
        }

        else {
            // Si on ne connaît pas l'ancien statut, on met seulement la date de traitement
            courrier.setDateTraitement(now);
        }

        return ResponseEntity.ok(courrierRepository.save(courrier));
    }

    @PutMapping("update-status-service/{id}")
    public ResponseEntity<Courrier> updateStatusService(@PathVariable Long id) {
        Courrier courrier = courrierRepository.findById(id).orElseThrow();

        Status ancienStatut = courrier.getStatus();
        Status nouveauStatut = Status.RECU_SERVICE;

        courrier.setStatus(nouveauStatut);

        if (ancienStatut == Status.EN_ATTENTE) {
            courrier.setDateEnvoi(LocalDate.now());
        }

        return ResponseEntity.ok(courrierRepository.save(courrier));
    }


    @PutMapping("update-status-bureau/{id}")
    public ResponseEntity<Courrier> updateStatusBureau(
            @PathVariable Long id,
            @RequestParam String bureau) {

        Courrier courrier = courrierRepository.findById(id).orElseThrow();

        Status ancienStatut = courrier.getStatus();
        Status nouveauStatut = Status.RECU_BUREAU;

        courrier.setBureauRecepteur(bureau);
        courrier.setStatus(nouveauStatut);

        if (ancienStatut == Status.RECU_SERVICE) {
            courrier.setDateReceptionService(LocalDate.now());
            //courrier.setDateTraitement(LocalDate.now());
        }

        return ResponseEntity.ok(courrierRepository.save(courrier));
    }



    @GetMapping
    public ResponseEntity<List<Courrier>> getAllCourriers() {
        List<Courrier> courriers = courrierService.getAllCourriers();
        return ResponseEntity.ok(courriers);
    }

     //Récupérer les courriers avec status = RECU_SERVICE et entitesTransmises = "XXX"
    @GetMapping("/recu-service/par-entite")
    public ResponseEntity<List<Courrier>> getCourriersParEntite(@RequestParam String entite) {
        List<Courrier> courriers = courrierService.getCourriersParStatusEtEntiteTransmise(entite);
        return ResponseEntity.ok(courriers);
    }

    // Récupérer les courriers avec status = RECU_BUREAU et entitesTransmises = "XXX"
    @GetMapping("/recu-bureau/par-entite")
    public ResponseEntity<List<Courrier>> getCourriersParEntite2(@RequestParam String entite) {
        List<Courrier> courriers = courrierService.getCourriersParStatusEtEntiteTransmise2(entite);
        return ResponseEntity.ok(courriers);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Courrier> getCourrierById(@PathVariable Long id) {
        Courrier courrier = courrierService.getCourrierById(id);
        return ResponseEntity.ok(courrier);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourrier(@PathVariable Long id) {
        courrierService.deleteCourrier(id);
        return ResponseEntity.noContent().build();
    }


    @PostMapping("/courriers")
    public ResponseEntity<?> createCourriers(@RequestBody Courrier courrier) {
        List<Courrier> courriersCrees = new ArrayList<>() ;

        List<String> services = courrier.getServicesTransmis();

        if (services == null || services.isEmpty()) {
            // Aucun service sélectionné → un seul courrier avec servicesTransmis = null
            courrier.setServicesTransmis(null);
            Courrier saved = courrierRepository.save(courrier);
            courriersCrees.add(saved);
        } else {
            // Plusieurs services sélectionnés → créer un courrier pour chaque service
            for (String service : services) {
                Courrier c = new Courrier();
                c.setDateArrivee(courrier.getDateArrivee());
                c.setTypeCourrier(courrier.getTypeCourrier());
                c.setNumeroOrdre(courrier.getNumeroOrdre());
                c.setEntiteExpeditrice(courrier.getEntiteExpeditrice());
                c.setDateExpediteur(courrier.getDateExpediteur());
                c.setReference(courrier.getReference());
                c.setObjet(courrier.getObjet());
                c.setLangue(courrier.getLangue());
                c.setCopies(courrier.getCopies());
                c.setUrgent(courrier.isUrgent());
                c.setDelaisJours(courrier.getDelaisJours());
                c.setInstructions(courrier.getInstructions());
                c.setInstructionSupplementaire(courrier.getInstructionSupplementaire());
                c.setEntiteTransmise(courrier.getEntiteTransmise());
                c.setServicesTransmis(Collections .singletonList(service));
                c.setServiceDestinataire(service);

                // Champs supplémentaires
                c.setStatus(courrier.getStatus());
                c.setDateEnvoi(courrier.getDateEnvoi());
                c.setDateReceptionService(courrier.getDateReceptionService());
                c.setDateReceptionBureau(courrier.getDateReceptionBureau());
                c.setBureauRecepteur(courrier.getBureauRecepteur());

                Courrier saved = courrierRepository.save(c);
                courriersCrees.add(saved);
            }
        }

        return ResponseEntity.ok(courriersCrees);
    }

}