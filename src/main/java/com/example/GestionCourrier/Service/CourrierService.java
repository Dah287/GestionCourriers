package com.example.GestionCourrier.Service;



import com.example.GestionCourrier.Entite.Courrier;
import com.example.GestionCourrier.Entite.Status;
import com.example.GestionCourrier.Repository.CourrierRepository;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class CourrierService {

    private final CourrierRepository  courrierRepository;



    public CourrierService(CourrierRepository courrierRepository) {
        this.courrierRepository = courrierRepository;

    }

//    public Courrier createCourrier(Courrier courrier, MultipartFile fichierPdf) throws IOException {
//        // 1. Sauvegarder le fichier PDF si présent
//        if (fichierPdf != null && !fichierPdf.isEmpty()) {
//            if (!"application/pdf".equals(fichierPdf.getContentType())) {
//                throw new IllegalArgumentException("Seul le format PDF est autorisé.");
//            }
//
//            // Générer un nom unique
//            String nomFichier = System.currentTimeMillis() + "_" +
//                    fichierPdf.getOriginalFilename().replaceAll("[^a-zA-Z0-9._-]", "_");
//            Path chemin = Paths.get(uploadDir, nomFichier);
//
//            // Sauvegarder physiquement le fichier
//            Files.copy(fichierPdf.getInputStream(), chemin, StandardCopyOption.REPLACE_EXISTING);
//
//            // Mettre à jour le champ cheminFichierPdf dans l'entité
//            courrier.setCheminFichierPdf(chemin.toString());
//        }
//
//        // 2. Sauvegarder le courrier en base
//        return courrierRepository.save(courrier);
//    }

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
        return courrierRepository.findByStatusInAndServiceDestinataire(
                List.of(Status.RECU_SERVICE, Status.RECU_BUREAU,Status.BUREAU_SERVICE,Status.TRAITE,Status.RECU),
                entite
        );
    }
    // Méthode pour status = RECU_SERVICE et entitesTransmises = valeur donnée
    public List<Courrier> getCourriersParStatusEtEntiteTransmise2(String entite) {
        return courrierRepository.findByStatusInAndBureauRecepteur(List.of(Status .RECU_BUREAU,Status.RECU), entite);
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

    public void transfertVersBureaux(Long courrierId, List<String> bureaux) {
        Optional<Courrier> originalOpt = courrierRepository.findById(courrierId);

        if (originalOpt.isEmpty()) {
            throw new RuntimeException("Courrier non trouvé");
        }

        Courrier original = originalOpt.get();

        if (bureaux.size() == 1) {
            // Transfert direct vers un seul bureau
            original.setBureauRecepteur(bureaux.get(0));
            original.setStatus(Status.RECU_BUREAU);
            original.setDateReceptionBureau(LocalDate.now());
            courrierRepository.save(original);
        } else {
            // Créer une copie du courrier pour chaque bureau
            for (String bureau : bureaux) {
                Courrier copie = new Courrier();

                // Copier les champs nécessaires
                copie.setDateArrivee(original.getDateArrivee());
                copie.setTypeCourrier(original.getTypeCourrier());
                copie.setNumeroOrdre(original.getNumeroOrdre()); // ou ajouter un suffixe si besoin
                copie.setEntiteExpeditrice(original.getEntiteExpeditrice());
                copie.setDateExpediteur(original.getDateExpediteur());
                copie.setReference(original.getReference());
                copie.setObjet(original.getObjet());
                copie.setLangue(original.getLangue());
                copie.setCopies(original.getCopies());
                copie.setUrgent(original.isUrgent());
                copie.setDelaisJours(original.getDelaisJours());
                copie.setInstructions(original.getInstructions());
                copie.setInstructionSupplementaire(original.getInstructionSupplementaire());
                copie.setEntiteTransmise(original.getEntiteTransmise());
                copie.setServicesTransmis(original.getServicesTransmis());
                copie.setServiceDestinataire(original.getServiceDestinataire());
                copie.setCheminFichierPdf(original.getCheminFichierPdf());
                // Champs spécifiques au transfert
                copie.setBureauRecepteur(bureau);
                copie.setDateReceptionBureau(LocalDate.now());
                copie.setStatus(Status.RECU_BUREAU);

                courrierRepository.save(copie);
            }
        }
    }

    //

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    // Méthode qui prend uniquement l'ID
    public byte[] generateCourrierPdf(Long id) throws Exception {
        // Récupérer le courrier depuis la base
        Courrier courrier = courrierRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Courrier avec l'ID " + id + " non trouvé.") );

        return generatePdfContent(courrier); // Générer le PDF à partir de l'objet
    }

    // Méthode privée pour générer le contenu PDF (ancienne logique)
    private byte[] generatePdfContent(Courrier courrier) throws Exception {
        ByteArrayOutputStream  baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos) ;
        PdfDocument pdfDoc = new PdfDocument(writer);
        Document document = new Document(pdfDoc);

        PdfFont font = PdfFontFactory.createFont(); // Police standard
        DeviceRgb primaryColor = new DeviceRgb(33, 150, 243);   // Bleu
        DeviceRgb accentColor = new DeviceRgb(255, 87, 34);     // Orange pour urgent

        // Titre
        Paragraph title = new Paragraph("FICHE DÉTAILLÉE DU COURRIER")
                .setFont(font)
                .setFontSize(18)
                .setFontColor(ColorConstants.WHITE)
                .setBackgroundColor(primaryColor)
                .setTextAlignment(TextAlignment.CENTER)
                .setBold()
                .setMargin(0)
                .setPadding(10);
        document.add(title);

        // ID
        Paragraph subtitle = new Paragraph("ID : " + courrier.getId())
                .setFont(font)
                .setFontSize(12)
                .setFontColor(ColorConstants.GRAY)
                .setTextAlignment(TextAlignment.RIGHT)
                .setItalic()
                .setMarginBottom(20);
        document.add(subtitle);

        // === Informations Générales ===
        addSectionTitle(document, "Informations Générales", primaryColor, font);
        Table generalTable = new Table(UnitValue.createPercentArray(2)).useAllAvailableWidth();
        addHeaderRow(generalTable, primaryColor, font);

        addRow(generalTable, "Date d'arrivée", format(courrier.getDateArrivee()), font);
        addRow(generalTable, "Type de courrier", courrier.getTypeCourrier(), font);
        addRow(generalTable, "Numéro d'ordre", courrier.getNumeroOrdre(), font);
        addRow(generalTable, "Entité expéditrice", courrier.getEntiteExpeditrice(), font);
        addRow(generalTable, "Date d'expédition", format(courrier.getDateExpediteur()), font);
        addRow(generalTable, "Référence", courrier.getReference(), font);
        addRow(generalTable, "Objet", courrier.getObjet(), font);
        addRow(generalTable, "Langue", courrier.getLangue(), font);
        addRow(generalTable, "Copies", courrier.getCopies(), font);
        addRow(generalTable, "Urgent", courrier.isUrgent() ? "OUI" : "NON", font, courrier.isUrgent() ? accentColor : null);
        addRow(generalTable, "Délai (jours)", courrier.getDelaisJours(), font);

        document.add(generalTable);

        // === Instructions ===
        if (courrier.getInstructions() != null || courrier.getInstructionSupplementaire() != null) {
            addSectionTitle(document, "Instructions", primaryColor, font);

            if (courrier.getInstructions() != null && !courrier.getInstructions().isEmpty()) {
                Table instTable = new Table(UnitValue.createPercentArray(2)).useAllAvailableWidth();
                addHeaderRow(instTable, primaryColor, font);
                for (Map.Entry<String, Boolean> entry : courrier.getInstructions().entrySet()) {
                    addRow(instTable, entry.getKey(), entry.getValue() ? "Oui" : "Non", font);
                }
                document.add(instTable);
            }

            if (courrier.getInstructionSupplementaire() != null && !courrier.getInstructionSupplementaire().trim().isEmpty()) {
                Paragraph supplement = new Paragraph("Instruction supplémentaire : " + courrier.getInstructionSupplementaire())
                        .setFont(font)
                        .setFontSize(11)
                        .setMarginTop(10)
                        .setBackgroundColor(new DeviceRgb(240, 240, 240))
                        .setPadding(10);
                document.add(supplement);
            }
        }

        // === Transmission ===
        addSectionTitle(document, "Transmission", primaryColor, font);
        Table transTable = new Table(UnitValue.createPercentArray(2)).useAllAvailableWidth();
        addHeaderRow(transTable, primaryColor, font);
        addRow(transTable, "Entité transmise", courrier.getEntiteTransmise(), font);
        addRow(transTable, "Services transmis", formatList(courrier.getServicesTransmis()), font);
        addRow(transTable, "Service destinataire", courrier.getServiceDestinataire(), font);
        addRow(transTable, "Bureau récepteur", courrier.getBureauRecepteur(), font);
        document.add(transTable);

        // === Suivi ===
        addSectionTitle(document, "Suivi du Courrier", primaryColor, font);
        Table suiviTable = new Table(UnitValue.createPercentArray(2)).useAllAvailableWidth();
        addHeaderRow(suiviTable, primaryColor, font);
        addRow(suiviTable, "Statut", courrier.getStatus() != null ? courrier.getStatus().name() : "N/A", font);
        addRow(suiviTable, "Date d'envoi", format(courrier.getDateEnvoi()), font);
        addRow(suiviTable, "Réception bureau", format(courrier.getDateReceptionBureau()), font);
        addRow(suiviTable, "Réception service", format(courrier.getDateReceptionService()), font);
        addRow(suiviTable, "Date de traitement", format(courrier.getDateTraitement()), font);
        document.add(suiviTable);

        // Footer
        Paragraph footer = new Paragraph("Document généré automatiquement - Gestion des Courriers")
                .setFont(font)
                .setFontSize(10)
                .setFontColor(ColorConstants.GRAY)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginTop(30);
        document.add(footer);

        document.close();
        return baos.toByteArray();
    }

    // === Méthodes utilitaires ===
    private void addSectionTitle(Document document, String title, DeviceRgb color, PdfFont font) {
        document.add(new Paragraph(title)
                .setFont(font)
                .setFontSize(14)
                .setFontColor(ColorConstants.WHITE)
                .setBackgroundColor(color)
                .setBold()
                .setPadding(8)
                .setMarginTop(20)
                .setMarginBottom(10));
    }

    private void addHeaderRow(Table table, DeviceRgb bgColor, PdfFont font) {
        table.addHeaderCell(new Cell() .add(new Paragraph("Champ").setFont(font).setBold().setFontColor(ColorConstants.WHITE)).setBackgroundColor(bgColor));
        table.addHeaderCell(new Cell().add(new Paragraph("Valeur").setFont(font).setBold().setFontColor(ColorConstants.WHITE)).setBackgroundColor(bgColor));
    }

    private void addRow(Table table, String key, String value, PdfFont font) {
        addRow(table, key, value, font, null);
    }

    private void addRow(Table table, String key, String value, PdfFont font, DeviceRgb textColor) {
        Cell keyCell = new Cell().add(new Paragraph(key).setFont(font).setFontSize(11));
        Cell valueCell = new Cell().add(new Paragraph(value != null ? value : "N/A")
                .setFont(font)
                .setFontSize(11)
                .setFontColor(textColor != null ? textColor : ColorConstants.BLACK));
        table.addCell(keyCell);
        table.addCell(valueCell);
    }

    private String format(java.time.LocalDate date) {
        return date != null ? date.format(FORMATTER) : "N/A";
    }

    private String formatList(List<String> list) {
        return list != null && !list.isEmpty() ? String.join(", ", list) : "N/A";
    }

}