const express = require('express');
const nodemailer = require('nodemailer');
const app = express();

app.use(express.json());

// Configuration de votre transporteur d'e-mail (ex: Gmail ou autre SMTP)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'chepitimayassecurite@gmail.com',
        pass: 'dgabase2025' // Pensez idéalement à utiliser une variable d'environnement pour le mot de passe en production
    }
});

app.post('/api/pointage', (req, res) => {
    const { agentNom, clientEmail, clientNom, dateHeure } = req.body;
    
    console.log("Données reçues :", { agentNom, clientEmail, clientNom, dateHeure });

    // Configuration de l'e-mail à envoyer au client
    const mailOptions = {
        from: 'chepitimayassecurite@gmail.com',
        to: clientEmail,
        subject: `Confirmation de passage - ${clientNom}`,
        text: `Bonjour, nous vous informons que l'agent ${agentNom} est bien arrivé sur votre site (${clientNom}) le ${dateHeure}.`
    };

    // Envoi de l'e-mail
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Erreur lors de l'envoi de l'e-mail :", error);
            return res.status(500).send("Erreur serveur");
        }
        console.log("E-mail envoyé avec succès :", info.response);
        res.status(200).send("Pointage enregistré et e-mail envoyé");
    });
});

// Utilisation du port dynamique fourni par l'hébergeur cloud, ou 3000 par défaut en local
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Serveur Node.js en écoute sur le port ${PORT}`);
});