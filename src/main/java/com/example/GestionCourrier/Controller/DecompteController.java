package com.example.GestionCourrier.Controller;

import com.example.GestionCourrier.Entite.*;
import com.example.GestionCourrier.Repository.DecompteRepository;
import com.example.GestionCourrier.Repository.HistoriqueStatutRepository;
import com.example.GestionCourrier.Service.DecompteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping ("/api/decomptes")
@CrossOrigin(origins = "http://192.168.1.44:3000")
public class DecompteController {

    @Autowired
    private DecompteRepository  decompteRepository;


    @Autowired
    private DecompteService  decompteService;

    @Autowired
    private HistoriqueStatutRepository  historiqueStatutRepository;

    @GetMapping
    public List <Decompte > getAllDecomptes() {
        return decompteRepository.findAll();
    }
    @PostMapping
    public ResponseEntity <Decompte> createDecompte(@RequestBody Decompte decompte) {
        Decompte saved = decompteRepository.save(decompte);
        return ResponseEntity.ok(saved);
    }
    @PutMapping("update-status-bcp/{id}")
    public ResponseEntity<Decompte> updateStatusBCP(@PathVariable Long id) {
        Decompte decompte = decompteRepository.findById(id).orElseThrow();

        StatutDecompte ancienStatut = decompte.getStatut();
        StatutDecompte nouveauStatut = StatutDecompte.BCP;

        if (ancienStatut != nouveauStatut) {
            // ✅ Mise à jour du statut
            decompte.setStatut(nouveauStatut);

            // ✅ Mise à jour de la date d’envoi à BCP
      //      decompte.setDate_envoi_bcp(LocalDate.now());

            // ✅ Génération de la description lisible
            String description = HistoriqueUtils.genererDescription(ancienStatut, nouveauStatut);

            // ✅ Affectation de la date si la description correspond
            if ("Envoyé au bureau BCP".equals(description)) {
                decompte.setDate_envoi_bcp(LocalDate.now());
            }

            // ✅ Création et enregistrement dans l’historique
            HistoriqueStatut historique = new HistoriqueStatut(
                    ancienStatut,
                    nouveauStatut,
                    description,
                    LocalDateTime.now(),
                    decompte
            );
            historiqueStatutRepository.save(historique);
            decompte.getHistoriqueStatuts().add(historique);
        }

        return ResponseEntity.ok(decompteRepository.save(decompte));
    }

    @PutMapping("update-status-atp/{id}")
    public ResponseEntity<Decompte> updateStatusATP(@PathVariable Long id) {
        Decompte decompte = decompteRepository.findById(id).orElseThrow();

        StatutDecompte ancienStatut = decompte.getStatut();
        StatutDecompte nouveauStatut = StatutDecompte.ATP;

        if (ancienStatut != nouveauStatut) {
            // ✅ Mise à jour du statut
            decompte.setStatut(nouveauStatut);

            // ✅ Mise à jour de la date d’envoi à ATP
           // decompte.setDate_envoi_atp(LocalDate.now());

            // ✅ Génération de la description
            String description = HistoriqueUtils.genererDescription(ancienStatut, nouveauStatut);


            // ✅ Mettre la date correspondante selon description
            if ("Envoyé à ATP".equals(description)) {
                decompte.setDate_envoi_atp(LocalDate.now());
            }
            // ✅ Création et sauvegarde de l’historique
            HistoriqueStatut historique = new HistoriqueStatut(
                    ancienStatut,
                    nouveauStatut,
                    description,
                    LocalDateTime.now(),
                    decompte
            );
            historiqueStatutRepository.save(historique);
            decompte.getHistoriqueStatuts().add(historique);
        }

        return ResponseEntity.ok(decompteRepository.save(decompte));
    }


    @PutMapping("update-status-r-bcp/{id}")
    public ResponseEntity<Decompte> updateStatusARBCP(@PathVariable Long id) {
        Decompte decompte = decompteRepository.findById(id).orElseThrow();

        StatutDecompte ancienStatut = decompte.getStatut();
        StatutDecompte nouveauStatut = StatutDecompte.REJETE_BCP;

        if (ancienStatut != nouveauStatut) {
            // ✅ Mettre à jour le statut
            decompte.setStatut(nouveauStatut);

            // ✅ Mettre à jour la date de rejet par BCP
            decompte.setDate_rejete_bcp(LocalDate.now());

            // ✅ Générer description + sauvegarder historique
            String description = HistoriqueUtils.genererDescription(ancienStatut, nouveauStatut);
            HistoriqueStatut historique = new HistoriqueStatut(
                    ancienStatut, nouveauStatut, description, LocalDateTime.now(), decompte
            );
            historiqueStatutRepository.save(historique);
            decompte.getHistoriqueStatuts().add(historique);

            // ✅ Mettre à jour la bonne date en fonction de la description
            if ("Rejeté par ATP".equals(description)) {
                decompte.setDate_rejete_bcp(LocalDate.now());
            }
        }

        return ResponseEntity.ok(decompteRepository.save(decompte));
    }

    @PutMapping("update-status-r-atp/{id}")
    public ResponseEntity<Decompte> updateStatusARATP(@PathVariable Long id) {
        Decompte decompte = decompteRepository.findById(id).orElseThrow();

        StatutDecompte ancienStatut = decompte.getStatut();
        StatutDecompte nouveauStatut = StatutDecompte.REJETE_ATP;

        if (ancienStatut != nouveauStatut) {
            // ✅ Mettre à jour le statut
            decompte.setStatut(nouveauStatut);

            // ✅ Mettre à jour la date de rejet par ATP
            //decompte.setDate_rejete_atp(LocalDate.now());

            // ✅ Générer description + sauvegarder historique
            String description = HistoriqueUtils.genererDescription(ancienStatut, nouveauStatut);
            HistoriqueStatut historique = new HistoriqueStatut(
                    ancienStatut, nouveauStatut, description, LocalDateTime.now(), decompte
            );
            historiqueStatutRepository.save(historique);
            decompte.getHistoriqueStatuts().add(historique);

            // ✅ Mettre à jour la bonne date en fonction de la description
            if ("Rejeté par ATP".equals(description)) {
                decompte.setDate_rejete_atp(LocalDate.now());
            }

        }

        return ResponseEntity.ok(decompteRepository.save(decompte));
    }


    @GetMapping("/all-bcp")
    public ResponseEntity<List<Decompte>> getCourriersParBCP() {
        List<StatutDecompte> statuts = List.of(StatutDecompte.BCP, StatutDecompte.REJETE_ATP);
        List<Decompte> decomptes = decompteRepository.findByStatutIn(statuts);
        return ResponseEntity.ok(decomptes);
    }

    @GetMapping("/all-atp")
    public ResponseEntity<List<Decompte>> getCourriersParATP() {
        List<Decompte> decomptes = decompteRepository.findByStatut(StatutDecompte.ATP);
        return ResponseEntity.ok(decomptes);
    }

    @GetMapping("/all-scf")
    public ResponseEntity<List<Decompte>> getCourriersParSCF() {
        List<StatutDecompte> statuts = List.of(StatutDecompte.SERVICE_SCF, StatutDecompte.REJETE_BCP,StatutDecompte.REJETE_ATP_S);
        List<Decompte> decomptes = decompteRepository.findByStatutIn(statuts);
        return ResponseEntity.ok(decomptes);
    }

    @PutMapping("/{id}/statut")
    public ResponseEntity<Decompte> updateStatutDecompte(
            @PathVariable Long id,
            @RequestBody Decompte request) {

        Optional<Decompte> optionalDecompte = decompteRepository.findById(id);

        if (optionalDecompte.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Decompte decompte = optionalDecompte.get();
        StatutDecompte ancienStatut = decompte.getStatut();
        StatutDecompte nouveauStatut = request.getStatut();

        // mise à jour du statut
        decompte.setStatut(nouveauStatut);

        // mise à jour du motif si fourni
        if (request.getMotif() != null) {
            decompte.setMotif(request.getMotif());
        }

        // ajout historique si le statut a changé
        if (ancienStatut != nouveauStatut) {
            String description = HistoriqueUtils.genererDescription(ancienStatut, nouveauStatut);
            HistoriqueStatut historique = new HistoriqueStatut(
                    ancienStatut,
                    nouveauStatut,
                    description,
                    LocalDateTime .now(),
                    decompte
            );
            historiqueStatutRepository.save(historique);
            decompte.getHistoriqueStatuts().add(historique);

            // ✅ Mise à jour des dates en fonction de la description
            switch (description) {
                case "Envoyé à Service SCF":
                    decompte.setDate_envoi_scf(LocalDate.now());
                    break;
                case "Envoyé au bureau BCP":
                    decompte.setDate_envoi_bcp(LocalDate.now());
                    break;
                case "Envoyé à ATP":
                    decompte.setDate_envoi_atp(LocalDate.now());
                    break;
                case "Rejeté par ATP":
                    decompte.setDate_rejete_atp(LocalDate.now());
                    break;
                case "Rejeté par BCP":
                    decompte.setDate_rejete_bcp(LocalDate.now());
                    break;
            }

        }



        Decompte updated = decompteRepository.save(decompte);
        return ResponseEntity.ok(updated);
    }


    @GetMapping("/{id}/historique")
    public List<HistoriqueStatut > getHistorique(@PathVariable Long id) {
        Decompte decompte = decompteRepository.findById(id).orElseThrow();
        return decompte.getHistoriqueStatuts();
    }
    // autres méthodes (POST, PUT, DELETE)...

    @GetMapping("/{id}/export/pdf")
    public ResponseEntity<byte[]> exportSingleDecomptePdf(@PathVariable Long id) {
        byte[] pdfBytes = decompteService.generateSingleDecompteReport(id);

        HttpHeaders  headers = new HttpHeaders();
        headers.setContentType(MediaType .APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "decompte_" + id + ".pdf");

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus .OK);
    }

}
