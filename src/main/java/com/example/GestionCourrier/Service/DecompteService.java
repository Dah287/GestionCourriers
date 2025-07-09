package com.example.GestionCourrier.Service;

import com.example.GestionCourrier.Entite.Decompte;
import com.example.GestionCourrier.Entite.HistoriqueUtils;
import com.example.GestionCourrier.Entite.StatutDecompte;
import com.example.GestionCourrier.Entite.HistoriqueStatut;
import com.example.GestionCourrier.Repository.DecompteRepository;
import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.properties.TextAlignment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;



import com.itextpdf.io.font.PdfEncodings;
import com.itextpdf.io.image.ImageData;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.geom.PageSize;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

//
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;

//
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Optional;


//

import com.itextpdf.io.image.ImageData;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.layout.element.Image;


import com.itextpdf.kernel.pdf.*;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.*;




@Service
public class DecompteService {

    @Autowired
    private DecompteRepository decompteRepository;

    public Decompte getDecompteById(Long id) {
        return decompteRepository.findById(id).orElse(null);
    }

    public void changerStatut(Decompte  decompte, StatutDecompte nouveauStatut) {
        StatutDecompte ancienStatut = decompte.getStatut();

        if (ancienStatut != nouveauStatut) {
            String description = HistoriqueUtils .genererDescription(ancienStatut, nouveauStatut);

            decompte.setStatut(nouveauStatut);

            HistoriqueStatut historique = new HistoriqueStatut(
                    ancienStatut,
                    nouveauStatut,
                    description,
                    LocalDateTime.now(),
                    decompte
            );

            decompte.getHistoriqueStatuts().add(historique);
            decompteRepository.save(decompte);
        }
    }

    public byte[] generateSingleDecompteReport(Long id) {
        Decompte d = decompteRepository.findById(id).orElseThrow(() ->
                new RuntimeException("Décompte introuvable avec l'ID : " + id));

        ByteArrayOutputStream  out = new ByteArrayOutputStream();

        try {
            PdfWriter  writer = new PdfWriter(out);
            PdfDocument  pdfDoc = new PdfDocument(writer);
            Document  document = new Document(pdfDoc, PageSize .A4);
            document.setMargins(20, 20, 20, 20);

            PdfFont  font = PdfFontFactory .createFont(StandardFonts .HELVETICA);

            document.add(new Paragraph("Rapport du Décompte")
                    .setTextAlignment(TextAlignment .CENTER)
                    .setBold()
                    .setFontSize(16));

            document.add(new Paragraph("\n"));

            // Table des informations
            Table table = new Table(2).useAllAvailableWidth();

            table.addCell(new Cell().add(new Paragraph("ID").setBold()));
            table.addCell(new Cell().add(new Paragraph(String.valueOf(d.getId()))));

            table.addCell(new Cell().add(new Paragraph("Numéro Décompte").setBold()));
            table.addCell(new Cell().add(new Paragraph(d.getNumDecompte() != null ? d.getNumDecompte() : "")));

            table.addCell(new Cell().add(new Paragraph("Année").setBold()));
            table.addCell(new Cell().add(new Paragraph(String.valueOf(d.getAnnee()))));

            table.addCell(new Cell().add(new Paragraph("Montant").setBold()));
            table.addCell(new Cell().add(new Paragraph(d.getMontant() != null ? String.format("%.2f MDH", d.getMontant()) : "")));

            table.addCell(new Cell().add(new Paragraph("Statut").setBold()));
            table.addCell(new Cell().add(new Paragraph(d.getStatut() != null ? d.getStatut().name() : "")));

            table.addCell(new Cell().add(new Paragraph("Motif Rejet").setBold()));
            table.addCell(new Cell().add(new Paragraph(d.getMotif() != null ? d.getMotif() : "")));

            table.addCell(new Cell().add(new Paragraph("Fournisseur").setBold()));
            table.addCell(new Cell().add(new Paragraph(d.getMarche() != null ? d.getMarche().getFournisseur() : "")));

            table.addCell(new Cell().add(new Paragraph("Date Envoi SCF").setBold()));
            table.addCell(new Cell().add(new Paragraph(d.getDate_envoi_scf() != null ? d.getDate_envoi_scf().toString() : "")));

            table.addCell(new Cell().add(new Paragraph("Date Envoi BCP").setBold()));
            table.addCell(new Cell().add(new Paragraph(d.getDate_envoi_bcp() != null ? d.getDate_envoi_bcp().toString() : "")));

            table.addCell(new Cell().add(new Paragraph("Date Envoi ATP").setBold()));
            table.addCell(new Cell().add(new Paragraph(d.getDate_envoi_atp() != null ? d.getDate_envoi_atp().toString() : "")));

            table.addCell(new Cell().add(new Paragraph("Date Rejet BCP").setBold()));
            table.addCell(new Cell().add(new Paragraph(d.getDate_rejete_bcp() != null ? d.getDate_rejete_bcp().toString() : "")));

            table.addCell(new Cell().add(new Paragraph("Date Rejet ATP").setBold()));
            table.addCell(new Cell().add(new Paragraph(d.getDate_rejete_atp() != null ? d.getDate_rejete_atp().toString() : "")));

            document.add(table);


            document.add(new Paragraph("\n\nSignature : ..........................................."));
            document.add(new Paragraph("Date : " + java.time.LocalDate.now()));

            document.close();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return out.toByteArray();
    }

}