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
import java.util.List;

@RestController
@RequestMapping("/api/courriers")
@CrossOrigin(origins = "http://192.168.1.112:3000")
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
        Courrier Courrier = courrierRepository.findById(id).orElseThrow();
        Courrier.setStatus(Status.TRAITE);
        Courrier.setDateEnvoi(LocalDate.now()); // ✅ Ajouter la date d'envoi actuelle
        return ResponseEntity.ok(courrierRepository.save(Courrier));
    }
    @PutMapping("update-status-service/{id}")
    public ResponseEntity<Courrier> updateStatusService(@PathVariable Long id) {
        Courrier Courrier = courrierRepository.findById(id).orElseThrow();
        Courrier.setStatus(Status.RECU_SERVICE);
        Courrier.setDateEnvoi(LocalDate.now()); // ✅ Ajouter la date d'envoi actuelle
        return ResponseEntity.ok(courrierRepository.save(Courrier));
    }

    @PutMapping("update-status-bureau/{id}")
    public ResponseEntity<Courrier> updateStatusBureau(
            @PathVariable Long id,
            @RequestParam String bureau) {

        Courrier courrier = courrierRepository.findById(id).orElseThrow();

        courrier.setBureauRecepteur(bureau);
        courrier.setStatus(Status.RECU_BUREAU);
        courrier.setDateReceptionService(LocalDate.now()); // ✅ Ajouter la date d'envoi actuelle
        return ResponseEntity.ok(courrierRepository.save(courrier));
    }


    @GetMapping
    public ResponseEntity<List<Courrier>> getAllCourriers() {
        List<Courrier> courriers = courrierService.getAllCourriers();
        return ResponseEntity.ok(courriers);
    }

    // Récupérer les courriers avec status = RECU_SERVICE et entitesTransmises = "XXX"
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
}