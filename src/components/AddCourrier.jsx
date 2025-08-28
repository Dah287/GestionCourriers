import React, { useState } from "react";
import axios from "axios";

export default function AddCourrier() {
  const [courrier, setCourrier] = useState({
    dateArrivee: "",
    typeCourrier: "",
    numeroOrdre: "",
    entiteExpeditrice: "",
    dateExpediteur: "",
    reference: "",
    objet: "",
    langue: "",
    copies: "",
    urgent: false,
    delaisJours: "",
    instructionSupplementaire: "",
    entiteTransmise: "",
    serviceDestinataire: "",
    bureauRecepteur: "",
  });

  const [fichierPdf, setFichierPdf] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCourrier((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    setFichierPdf(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append(
        "courrier",
        new Blob([JSON.stringify(courrier)], { type: "application/json" })
      );
      if (fichierPdf) {
        formData.append("fichierPdf", fichierPdf);
      }

      const res = await axios.post("http://192.168.1.68:8080/api/courriers", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Courrier ajouté avec succès ✅");
      console.log(res.data);
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'ajout ❌");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Ajouter un Courrier</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="date"
          name="dateArrivee"
          value={courrier.dateArrivee}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="typeCourrier"
          placeholder="Type Courrier"
          value={courrier.typeCourrier}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="numeroOrdre"
          placeholder="Numéro d'ordre"
          value={courrier.numeroOrdre}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="entiteExpeditrice"
          placeholder="Entité Expéditrice"
          value={courrier.entiteExpeditrice}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="dateExpediteur"
          value={courrier.dateExpediteur}
          onChange={handleChange}
        />
        <input
          type="text"
          name="objet"
          placeholder="Objet"
          value={courrier.objet}
          onChange={handleChange}
        />
        <input
          type="text"
          name="langue"
          placeholder="Langue"
          value={courrier.langue}
          onChange={handleChange}
        />
        <textarea
          name="copies"
          placeholder="Copies"
          value={courrier.copies}
          onChange={handleChange}
        />
        <label>
          Urgent :
          <input
            type="checkbox"
            name="urgent"
            checked={courrier.urgent}
            onChange={handleChange}
          />
        </label>
        <input
          type="text"
          name="delaisJours"
          placeholder="Délais (jours)"
          value={courrier.delaisJours}
          onChange={handleChange}
        />
        <input type="file" accept="application/pdf" onChange={handleFileChange} />
        <button type="submit">Ajouter</button>
      </form>
    </div>
  );
}
