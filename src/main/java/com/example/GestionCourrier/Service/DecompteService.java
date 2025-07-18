package com.example.GestionCourrier.Service;

import com.example.GestionCourrier.Entite.Decompte;
import com.example.GestionCourrier.Entite.HistoriqueUtils;
import com.example.GestionCourrier.Entite.StatutDecompte;
import com.example.GestionCourrier.Entite.HistoriqueStatut;
import com.example.GestionCourrier.Repository.DecompteRepository;
import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.VerticalAlignment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.*;
import java.time.LocalDate;
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
import java.net.MalformedURLException;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.List;


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

//    public byte[] generateSingleDecompteReport(Long id) {
//        Decompte d = decompteRepository.findById(id).orElseThrow(() ->
//                new RuntimeException("Décompte introuvable avec l'ID : " + id));
//
//        ByteArrayOutputStream  out = new ByteArrayOutputStream();
//
//        try {
//            PdfWriter  writer = new PdfWriter(out);
//            PdfDocument  pdfDoc = new PdfDocument(writer);
//            Document  document = new Document(pdfDoc, PageSize .A4);
//            document.setMargins(20, 20, 20, 20);
//
//            PdfFont  font = PdfFontFactory .createFont(StandardFonts .HELVETICA);
//
//            document.add(new Paragraph("Rapport du Décompte")
//                    .setTextAlignment(TextAlignment .CENTER)
//                    .setBold()
//                    .setFontSize(16));
//
//            document.add(new Paragraph("\n"));
//
//            // Table des informations
//            Table table = new Table(2).useAllAvailableWidth();
//
//            table.addCell(new Cell().add(new Paragraph("ID").setBold()));
//            table.addCell(new Cell().add(new Paragraph(String.valueOf(d.getId()))));
//
//            table.addCell(new Cell().add(new Paragraph("Numéro Décompte").setBold()));
//            table.addCell(new Cell().add(new Paragraph(d.getNumDecompte() != null ? d.getNumDecompte() : "")));
//
//            table.addCell(new Cell().add(new Paragraph("Année").setBold()));
//            table.addCell(new Cell().add(new Paragraph(String.valueOf(d.getAnnee()))));
//
//            table.addCell(new Cell().add(new Paragraph("Montant").setBold()));
//            table.addCell(new Cell().add(new Paragraph(d.getMontant() != null ? String.format("%.2f MDH", d.getMontant()) : "")));
//
//            table.addCell(new Cell().add(new Paragraph("Statut").setBold()));
//            table.addCell(new Cell().add(new Paragraph(d.getStatut() != null ? d.getStatut().name() : "")));
//
//            table.addCell(new Cell().add(new Paragraph("Motif Rejet").setBold()));
//            table.addCell(new Cell().add(new Paragraph(d.getMotif() != null ? d.getMotif() : "")));
//
//            table.addCell(new Cell().add(new Paragraph("Fournisseur").setBold()));
//            table.addCell(new Cell().add(new Paragraph(d.getMarche() != null ? d.getMarche().getFournisseur() : "")));
//
//            table.addCell(new Cell().add(new Paragraph("Date Envoi SCF").setBold()));
//            table.addCell(new Cell().add(new Paragraph(d.getDate_envoi_scf() != null ? d.getDate_envoi_scf().toString() : "")));
//
//            table.addCell(new Cell().add(new Paragraph("Date Envoi BCP").setBold()));
//            table.addCell(new Cell().add(new Paragraph(d.getDate_envoi_bcp() != null ? d.getDate_envoi_bcp().toString() : "")));
//
//            table.addCell(new Cell().add(new Paragraph("Date Envoi ATP").setBold()));
//            table.addCell(new Cell().add(new Paragraph(d.getDate_envoi_atp() != null ? d.getDate_envoi_atp().toString() : "")));
//
//            table.addCell(new Cell().add(new Paragraph("Date Rejet BCP").setBold()));
//            table.addCell(new Cell().add(new Paragraph(d.getDate_rejete_bcp() != null ? d.getDate_rejete_bcp().toString() : "")));
//
//            table.addCell(new Cell().add(new Paragraph("Date Rejet ATP").setBold()));
//            table.addCell(new Cell().add(new Paragraph(d.getDate_rejete_atp() != null ? d.getDate_rejete_atp().toString() : "")));
//
//            document.add(table);
//
//
//            document.add(new Paragraph("\n\nSignature : ..........................................."));
//            document.add(new Paragraph("Date : " + java.time.LocalDate.now()));
//
//            document.close();
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//
//        return out.toByteArray();
//    }

    public byte[] generateSingleDecompteReport(Long id) {
        Decompte d = decompteRepository.findById(id).orElseThrow(() ->
                new RuntimeException("Décompte introuvable avec l'ID : " + id));

        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter writer = new PdfWriter(out);
            PdfDocument pdfDoc = new PdfDocument(writer);
            Document document = new Document(pdfDoc, PageSize.A4);
            document.setMargins(20, 20, 20, 20);

            PdfFont font = PdfFontFactory.createFont(StandardFonts.HELVETICA);
            PdfFont boldFont = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);

            // Titre principal
            document.add(new Paragraph("Rapport du Décompte")
                    .setTextAlignment(TextAlignment.CENTER)
                    .setBold()
                    .setFontSize(18)
                    .setMarginBottom(20));

            // Section 1: Informations actuelles du décompte
            addCurrentDecompteInfo(document, d, boldFont);

            // Section 2: Historique complet
            addHistoriqueSection(document, d, boldFont);

            // Signature et date
            document.add(new Paragraph("\n\nSignature : ..........................................."));
            document.add(new Paragraph("Date : " + java.time.LocalDate.now()));

            document.close();

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Erreur lors de la génération du rapport PDF", e);
        }

        return out.toByteArray();
    }

    private void addCurrentDecompteInfo(Document document, Decompte d, PdfFont boldFont) throws Exception {
        // Titre de section
        document.add(new Paragraph("État Actuel du Décompte")
                .setBold()
                .setFontSize(14)
                .setMarginTop(10)
                .setMarginBottom(10));

        // Table des informations actuelles
        Table currentTable = new Table(2).useAllAvailableWidth();
        currentTable.setMarginBottom(20);

        // Style pour les en-têtes
        Cell headerStyle = new Cell().setBackgroundColor(ColorConstants.LIGHT_GRAY).setBold();

        addTableRow(currentTable, "ID", String.valueOf(d.getId()));
        addTableRow(currentTable, "Numéro Décompte", d.getNumDecompte() != null ? d.getNumDecompte() : "");
        addTableRow(currentTable, "Année", String.valueOf(d.getAnnee()));
        addTableRow(currentTable, "Montant", d.getMontant() != null ? String.format("%.2f MDH", d.getMontant()) : "");
        addTableRow(currentTable, "Statut Actuel", formatStatutLibelle(d.getStatut()));
        addTableRow(currentTable, "Motif Rejet", d.getMotif() != null ? d.getMotif() : "");
        addTableRow(currentTable, "Fournisseur", d.getMarche() != null ? d.getMarche().getFournisseur() : "");

        // Dates importantes
//        addTableRow(currentTable, "Date Envoi BCP", formatDate(d.getDate_envoi_bcp()));
//        addTableRow(currentTable, "Date Envoi ATP", formatDate(d.getDate_envoi_atp()));
//        addTableRow(currentTable, "Date Rejet BCP", formatDate(d.getDate_rejete_bcp()));
//        addTableRow(currentTable, "Date Rejet ATP", formatDate(d.getDate_rejete_atp()));

        document.add(currentTable);
    }

    private void addHistoriqueSection(Document document, Decompte d, PdfFont boldFont) throws Exception {
        List<HistoriqueStatut> historique = d.getHistoriqueStatuts();

        if (historique == null || historique.isEmpty()) {
            document.add(new Paragraph("Aucun historique disponible").setItalic());
            return;
        }

        // Trier l'historique par date
        historique.sort((h1, h2) -> h1.getDateChangement().compareTo(h2.getDateChangement()));

        // Séparer l'historique en sections
        List<List<HistoriqueStatut>> sections = separateHistoriqueIntoSections(historique);

        for (int i = 0; i < sections.size(); i++) {
            List<HistoriqueStatut> section = sections.get(i);

            // Titre de la section
            String sectionTitle = (i == 0) ? "Historique Principal" : "Tour " + (i + 1) + " (Après Rejet)";
            document.add(new Paragraph(sectionTitle)
                    .setBold()
                    .setFontSize(14)
                    .setMarginTop(15)
                    .setMarginBottom(10));

            // Table pour cette section
            addDetailedHistoriqueTable(document, section);
        }
    }

    private List<List<HistoriqueStatut>> separateHistoriqueIntoSections(List<HistoriqueStatut> historique) {
        List<List<HistoriqueStatut>> sections = new ArrayList<>();
        List<HistoriqueStatut> currentSection = new ArrayList<>();

        for (HistoriqueStatut h : historique) {
            currentSection.add(h);

            // Si on trouve un rejet vers DPF, on termine la section actuelle
            if (isRejetVersDPF(h.getDescription())) {
                sections.add(new ArrayList<>(currentSection));
                currentSection.clear();
            }
        }

        // Ajouter la dernière section si elle n'est pas vide
        if (!currentSection.isEmpty()) {
            sections.add(currentSection);
        }

        return sections;
    }

    private boolean isRejetVersDPF(String description) {
        return "Rejeté par ATP, envoyé à DPF".equals(description) ||
                "Rejeté par BCP, envoyé à DPF".equals(description);
    }

    private void addDetailedHistoriqueTable(Document document, List<HistoriqueStatut> historique) throws Exception {
        // Table simplifiée avec seulement 2 colonnes
        Table table = new Table(new float[]{2, 4}).useAllAvailableWidth();
        table.setMarginBottom(15);

        // En-têtes avec style
        table.addHeaderCell(new Cell()
                .add(new Paragraph("Date & Heure").setBold())
                .setBackgroundColor(ColorConstants.DARK_GRAY)
                .setFontColor(ColorConstants.WHITE)
                .setPadding(8));

        table.addHeaderCell(new Cell()
                .add(new Paragraph("Description").setBold())
                .setBackgroundColor(ColorConstants.DARK_GRAY)
                .setFontColor(ColorConstants.WHITE)
                .setPadding(8));

        for (HistoriqueStatut h : historique) {
            // Date & Heure
            table.addCell(new Cell().add(new Paragraph(formatDateTime(h.getDateChangement())))
                    .setPadding(8)
                    .setVerticalAlignment(VerticalAlignment.MIDDLE));

            // Description avec mise en évidence des rejets vers DPF
            Cell descriptionCell = new Cell().add(new Paragraph(h.getDescription() != null ?
                            h.getDescription() : ""))
                    .setPadding(8)
                    .setVerticalAlignment(VerticalAlignment.MIDDLE);

            if (isRejetVersDPF(h.getDescription())) {
                descriptionCell.setBackgroundColor(ColorConstants.ORANGE)
                        .setBold();
            }

            table.addCell(descriptionCell);
        }

        document.add(table);
    }

    private void addTableRow(Table table, String label, String value) {
        table.addCell(new Cell().add(new Paragraph(label).setBold()));
        table.addCell(new Cell().add(new Paragraph(value != null ? value : "")));
    }

    private String formatDate(LocalDate date) {
        return date != null ? date.toString() : "";
    }

    private String formatDateTime(LocalDateTime dateTime) {
        return dateTime != null ? dateTime.format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")) : "";
    }

    private String formatStatutLibelle(StatutDecompte statut) {
        if (statut == null) return "Non défini";

        switch (statut) {
            case EN_ATTENTE:
                return "En attente de validation DPF";
            case SERVICE_SCF:
                return "Envoyé à SCF";
            case BCP:
                return "Envoyé à BCP";
            case ATP:
                return "Envoyé à ATP";
            case REJETE_BCP:
                return "Rejeté par le BCP / SCF";
            case REJETE_ATP:
                return "Rejeté par l'ATP / BCP";
            case REJETE_ATP_S:
                return "Rejeté par le ATP / SCF";
            case REJETE_BCP_E:
                return "Rejeté par le BCP / DPF";
            case REJETE_ATP_E:
                return "Rejeté par le ATP / DPF";
            case ACCEPTE:
                return "Accepté et payé";
            default:
                return statut.name();
        }
    }


}