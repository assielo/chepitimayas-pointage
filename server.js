const express = require('express');
const app = express();

app.use(express.json());

app.post('/api/pointage', async (req, res) => {
    const { agentNom, clientEmail, clientNom, dateHeure } = req.body;
    
    console.log("Données reçues de Google Sheets :", { agentNom, clientEmail, clientNom, dateHeure });

    try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': process.env.BREVO_API_KEY, // Votre clé API Brevo
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                sender: { email: "chepitimayassecurite@gmail.com", name: "Sécurité Pointage" },
                to: [{ email: clientEmail }],
                subject: `Confirmation de passage - ${clientNom}`,
                textContent: `Bonjour, nous vous informons que l'agent ${agentNom} est bien arrivé sur votre site (${clientNom}) le ${dateHeure}.`
            })
        });

        if (!response.ok) {
            throw new Error(`Erreur API Brevo: ${response.statusText}`);
        }

        console.log("E-mail envoyé avec succès via l'API Brevo");
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