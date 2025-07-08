package com.example.GestionCourrier.Controller;

import com.example.GestionCourrier.Entite.Decompte;
import com.example.GestionCourrier.Entite.Marche;
import com.example.GestionCourrier.Repository.DecompteRepository;
import com.example.GestionCourrier.Repository.MarcheRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/marches")
@CrossOrigin(origins = "http://192.168.1.38:3000")
public class MarcheController {

    @Autowired
    private MarcheRepository marcheRepo;

    @Autowired
    private DecompteRepository decompteRepo;

    // ✅ GET all marchés
    @GetMapping
    public List<Marche> getAllMarches() {
        return marcheRepo.findAll();
    }

    // ✅ GET marché par ID
    @GetMapping("/{id}")
    public Marche getMarcheById(@PathVariable Long id) {
        return marcheRepo.findById(id).orElseThrow(() -> new RuntimeException("Marché non trouvé"));
    }

    // ✅ POST créer un seul marché
    @PostMapping
    public Marche createMarche(@RequestBody Marche marche) {
        return marcheRepo.save(marche);
    }

    // ✅ POST créer plusieurs marchés
    @PostMapping("/batch")
    public List<Marche> createMarches(@RequestBody List<Marche> marches) {
        return marcheRepo.saveAll(marches);
    }

    // ✅ PUT mettre à jour un marché
    @PutMapping("/{id}")
    public Marche updateMarche(@PathVariable Long id, @RequestBody Marche updatedMarche) {
        Marche existing = marcheRepo.findById(id).orElseThrow(() -> new RuntimeException("Marché non trouvé"));
        existing.setEntite(updatedMarche.getEntite());
        existing.setObjet(updatedMarche.getObjet());
        existing.setNumOperation(updatedMarche.getNumOperation());
        existing.setFournisseur(updatedMarche.getFournisseur());
        existing.setMontant(updatedMarche.getMontant());
        return marcheRepo.save(existing);
    }

    // ✅ DELETE supprimer un marché
    @DeleteMapping("/{id}")
    public void deleteMarche(@PathVariable Long id) {
        marcheRepo.deleteById(id);
    }

    // ✅ GET décomptes par marché
    @GetMapping("/{marcheId}/decomptes")
    public List<Decompte> getDecomptesByMarche(@PathVariable Long marcheId) {
        return decompteRepo.findByMarcheId(marcheId);
    }

    // ✅ POST ajouter un décompte à un marché
    @PostMapping("/{marcheId}/decomptes")
    public Decompte createDecompte(@PathVariable Long marcheId, @RequestBody Decompte decompte) {
        Marche marche = marcheRepo.findById(marcheId).orElseThrow(() -> new RuntimeException("Marché non trouvé"));
        decompte.setMarche(marche);
        return decompteRepo.save(decompte);
    }
}
