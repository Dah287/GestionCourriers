package com.example.GestionCourrier.Controller;

import com.example.GestionCourrier.Entite.Decompte;
import com.example.GestionCourrier.Entite.Marche;
import com.example.GestionCourrier.Repository.DecompteRepository;
import com.example.GestionCourrier.Repository.MarcheRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping ("/api/marches")
@CrossOrigin (origins = "http://192.168.1.44:3000")
public class MarcheController {
    @Autowired
    private MarcheRepository  marcheRepo;

    @Autowired
    private DecompteRepository  decompteRepo;

    @GetMapping
    public List <Marche > getAllMarches() {
        return marcheRepo.findAll();
    }

    @PostMapping
    public Marche createMarche(@RequestBody Marche marche) {
        return marcheRepo.save(marche);
    }

    @GetMapping("/{marcheId}/decomptes")
    public List<Decompte > getDecomptesByMarche(@PathVariable Long marcheId) {
        return decompteRepo.findByMarcheId(marcheId);
    }

    @PostMapping("/{marcheId}/decomptes")
    public Decompte createDecompte(@PathVariable Long marcheId, @RequestBody Decompte decompte) {
        Marche marche = marcheRepo.findById(marcheId).orElseThrow();
        decompte.setMarche(marche);
        return decompteRepo.save(decompte);
    }
}
