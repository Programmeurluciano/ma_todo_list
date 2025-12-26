const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const path = require('path');
const todoRoutes = require('./routes/todoRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration du moteur de template
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', todoRoutes);

// Gestion des erreurs 404
app.use((req, res) => {
    res.status(404).send(`
        <h1>404 - Page non trouvée</h1>
        <p>La page que vous recherchez n'existe pas.</p>
        <a href="/">Retour à l'accueil</a>
    `);
});

// Gestion des erreurs serveur
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send(`
        <h1>500 - Erreur serveur</h1>
        <p>Une erreur s'est produite sur le serveur.</p>
        <a href="/">Retour à l'accueil</a>
    `);
});

// Démarrage du serveur
app.listen(PORT,"0.0.0.0", () => {
    console.log(`========================================`);
    console.log(` Serveur démarré avec succès !`);
    console.log(` URL: http://localhost:${PORT}`);
    console.log(` Heure: ${new Date().toLocaleString('fr-FR')}`);
    console.log(`========================================`);
});

// Gestion de l'arrêt propre
process.on('SIGINT', () => {
    console.log('\n👋 Arrêt du serveur...');
    process.exit(0);
});
