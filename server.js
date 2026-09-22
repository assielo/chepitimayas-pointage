const express = require('express');
const cors = require('cors');

const app = express();

// 1. Toujours placer express.json() tout en haut
app.use(express.json());
app.use(cors());

// Route d'accueil
app.get('/', (req, res) => {
    res.status(200).send('Serveur de pointage Chepitimayas en ligne !');
});

// Route réceptrice connectée au webhook Google Sheets
app.post('/api/pointage', async (req, res) => {
    try {
        const { agentNom, clientEmail, clientNom, dateHeure } = req.body;
        
        console.log("Données reçues de Google Sheets :", { agentNom, clientEmail, clientNom, dateHeure });

        if (!clientEmail || !agentNom) {
            return res.status(400).json({ error: 'Données manquantes' });
        }

        // Envoi de l'e-mail via l'API Resend
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'onboarding@resend.dev',
                to: [clientEmail],
                subject: `Confirmation de passage - ${clientNom}`,
                html: `<p>Bonjour, nous vous informons que l'agent <strong>${agentNom}</strong> est bien arrivé sur votre site (<strong>${clientNom}</strong>) le ${dateHeure}.</p>`
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(`Erreur API Resend: ${JSON.stringify(data)}`);
        }

        console.log("E-mail envoyé avec succès via Resend :", data);
        res.status(200).send("Pointage enregistré et e-mail envoyé");
    } catch (error) {
        console.log("Erreur lors de l'envoi de l'e-mail :", error);
        res.status(500).send("Erreur serveur");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur en écoute sur le port ${PORT}`);
});
function testerEnvoi() {
  var payload = {
    agentNom: "Test Agent",
    clientEmail: "votre-email@domaine.com", // Mettez votre propre e-mail ici pour recevoir le test
    clientNom: "Site Test",
    dateHeure: new Date().toISOString()
  };

  var options = {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify(payload),
    "muteHttpExceptions": true
  };

  var url = "https://chepitimayas-pointage.onrender.com/api/pointage";
  var response = UrlFetchApp.fetch(url, options);
  
  Logger.log("Code HTTP : " + response.getResponseCode());
  Logger.log("Réponse : " + response.getContentText());
}