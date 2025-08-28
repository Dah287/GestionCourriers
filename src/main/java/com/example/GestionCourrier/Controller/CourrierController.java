package com.example.GestionCourrier.Controller;

import com.example.GestionCourrier.Entite.Courrier;
import com.example.GestionCourrier.Entite.Status;
import com.example.GestionCourrier.Repository.CourrierRepository;
import com.example.GestionCourrier.Service.CourrierService;
import jakarta.annotation.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/courriers")
@CrossOrigin(origins = "http://192.168.1.68:3000")
public class CourrierController {

    private final CourrierService  courrierService;


    // Dossier où les PDF seront sauvegardés
    private final String uploadDir = "uploads/courriers/";


    @Autowired
    private CourrierRepository courrierRepository;
    public CourrierController(CourrierService courrierService) {
        this.courrierService = courrierService;

        // Créer le dossier si inexistant
        new File(uploadDir).mkdirs();
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createCourriers(
            @RequestPart Courrier courrier,
            @RequestPart(required = false) MultipartFile fichierPdf) {

        try {
            List<Courrier> courriersCrees = new ArrayList<>();
            List<String> services = courrier.getServicesTransmis();

            // ✅ Gérer l'upload du fichier une seule fois si présent
            String cheminFichier = null;
            if (fichierPdf != null && !fichierPdf.isEmpty()) {
                if (!"application/pdf".equals(fichierPdf.getContentType())) {
                    throw new IllegalArgumentException("Seul le format PDF est autorisé.");
                }

                String nomFichier = System.currentTimeMillis() + "_" +
                        fichierPdf.getOriginalFilename().replaceAll("[^a-zA-Z0-9._-]", "_");
                Path chemin = Paths.get(uploadDir, nomFichier);

                Files.copy(fichierPdf.getInputStream(), chemin, StandardCopyOption.REPLACE_EXISTING);
                cheminFichier = chemin.toString();
            }

            if (services == null || services.isEmpty()) {
                // Aucun service → un seul courrier
                courrier.setServicesTransmis(null);
                courrier.setCheminFichierPdf(cheminFichier);
                Courrier saved = courrierRepository.save(courrier);
                courriersCrees.add(saved);
            } else {
                // Plusieurs services → dupliquer le courrier
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
                    c.setServicesTransmis(Collections.singletonList(service));
                    c.setServiceDestinataire(service);

                    // Champs supplémentaires
                    c.setStatus(courrier.getStatus());
                    c.setDateEnvoi(courrier.getDateEnvoi());
                    c.setDateReceptionService(courrier.getDateReceptionService());
                    c.setDateReceptionBureau(courrier.getDateReceptionBureau());
                    c.setBureauRecepteur(courrier.getBureauRecepteur());

                    // PDF (même fichier pour tous)
                    c.setCheminFichierPdf(cheminFichier);

                    Courrier saved = courrierRepository.save(c);
                    courriersCrees.add(saved);
                }
            }

            return new ResponseEntity<>(courriersCrees, HttpStatus.CREATED);

        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
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
    @PutMapping("update-status-traite-d/{id}")
    public ResponseEntity<Courrier> updateStatusTraited(@PathVariable Long id) {
        Courrier courrier = courrierRepository.findById(id).orElseThrow();

       // Status ancienStatut = courrier.getStatus();
        Status nouveauStatut = Status.TRAITE_D;

        courrier.setStatus(nouveauStatut);

//        LocalDate now = LocalDate.now();
//
//        if (ancienStatut == Status.RECU_SERVICE) {
//            courrier.setDateReceptionService(now);
//            courrier.setDateTraitement(now);
//        } else if (ancienStatut == Status.RECU_BUREAU) {
//            courrier.setDateReceptionBureau(now);
//            courrier.setDateTraitement(now);
//        } else if (ancienStatut == Status.EN_ATTENTE) {
//            //courrier.setDateReceptionBureau(now);
//            courrier.setDateTraitement(now);
//        }
//
//        else {
//            // Si on ne connaît pas l'ancien statut, on met seulement la date de traitement
//            courrier.setDateTraitement(now);
//        }

        return ResponseEntity.ok(courrierRepository.save(courrier));
    }

    @PutMapping("update-status-traite4/{id}")
    public ResponseEntity<Courrier> updateStatusTraited4(@PathVariable Long id) {
        Courrier courrier = courrierRepository.findById(id).orElseThrow();

        // Status ancienStatut = courrier.getStatus();
        Status nouveauStatut = Status.RECU;

        courrier.setStatus(nouveauStatut);

        LocalDate now = LocalDate.now();
//
//        if (ancienStatut == Status.RECU_SERVICE) {
//            courrier.setDateReceptionService(now);
//            courrier.setDateTraitement(now);
//        } else if (ancienStatut == Status.RECU_BUREAU) {
          courrier.setDateReceptionBureau(now);
//            courrier.setDateTraitement(now);
//        } else if (ancienStatut == Status.EN_ATTENTE) {
//            //courrier.setDateReceptionBureau(now);
//            courrier.setDateTraitement(now);
//        }
//
//        else {
//            // Si on ne connaît pas l'ancien statut, on met seulement la date de traitement
//            courrier.setDateTraitement(now);
//        }

        return ResponseEntity.ok(courrierRepository.save(courrier));
    }
    @PutMapping("update-status-traite3/{id}")
    public ResponseEntity<Courrier> updateStatusTraited3(@PathVariable Long id) {
        Courrier courrier = courrierRepository.findById(id).orElseThrow();

        // Status ancienStatut = courrier.getStatus();
        Status nouveauStatut = Status.BUREAU_SERVICE;

        courrier.setStatus(nouveauStatut);

       LocalDate now = LocalDate.now();
//
//        if (ancienStatut == Status.RECU_SERVICE) {
//            courrier.setDateReceptionService(now);
//            courrier.setDateTraitement(now);
//        } else if (ancienStatut == Status.RECU_BUREAU) {
//            courrier.setDateReceptionBureau(now);
//            courrier.setDateTraitement(now);
//        } else if (ancienStatut == Status.EN_ATTENTE) {
            courrier.setDateReceptionBureau(now);
//            courrier.setDateTraitement(now);
//        }
//
//        else {
//            // Si on ne connaît pas l'ancien statut, on met seulement la date de traitement
//            courrier.setDateTraitement(now);
//        }

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
        Status nouveauStatut = Status.BUREAU_SERVICE;

        courrier.setBureauRecepteur(bureau);
        courrier.setStatus(nouveauStatut);

        if (ancienStatut == Status.RECU_BUREAU) {
            courrier.setDateReceptionBureau(LocalDate.now());
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
                c.setCheminFichierPdf(courrier.getCheminFichierPdf());
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

    @PostMapping("/transfert-multiple")
    public ResponseEntity<?> transfertVersBureaux(@RequestBody Map<String, Object> payload) {
        try {
            Long courrierId = Long.valueOf(payload.get("id").toString());
            List<String> bureaux = (List<String>) payload.get("bureaux");

            courrierService.transfertVersBureaux(courrierId, bureaux);
            return ResponseEntity.ok("Transfert effectué avec succès");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur : " + e.getMessage());
        }
    }


    //

    @GetMapping("/{id}/exportt/pdf")
    public ResponseEntity<byte[]> exportSingleCourrierPdf(@PathVariable Long id) {
        try {
            // Générer le PDF à partir de l'ID
            byte[] pdfBytes = courrierService.generateCourrierPdf(id);

            // Configurer les headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "courrier_" + id + ".pdf");
            headers.setContentLength(pdfBytes.length);

            // Retourner le PDF dans le corps de la réponse
            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);

        } catch (Exception e) {
            // Si le courrier n'existe pas ou erreur
            if (e instanceof java.util.NoSuchElementException) {
                return ResponseEntity.notFound().build();
            }
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


//    @GetMapping("/uploads/{filename:.+}")
//    public ResponseEntity<org.springframework.core.io.Resource> getFile(@PathVariable String filename) {
//        try {
//            Path file = Paths.get("uploads").resolve(filename).normalize();
//            org.springframework.core.io.Resource resource = new UrlResource(file.toUri());
//
//            if (resource.exists() && resource.isReadable()) {
//                return ResponseEntity.ok()
//                        .contentType(MediaType.APPLICATION_PDF)
//                        .body(resource);
//            } else {
//                return ResponseEntity.notFound().build();
//            }
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
//        }
//    }

}