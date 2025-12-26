const TodoModel = require('../models/todoModel');

class TodoController {
    // Afficher toutes les tâches (page d'accueil)
    static index(req, res) {
        TodoModel.getAll((err, todos) => {
            if (err) {
                console.error('Erreur lors de la récupération des tâches:', err);
                return res.status(500).send('Erreur serveur');
            }

            TodoModel.getStats((err, stats) => {
                if (err) {
                    console.error('Erreur lors de la récupération des statistiques:', err);
                    stats = { total: 0, completed: 0, pending: 0 };
                }

                res.render('index', {
                    todos: todos,
                    stats: stats,
                    filter: req.query.filter || 'all'
                });
            });
        });
    }

    // Créer une nouvelle tâche
    static create(req, res) {
        const { title, description } = req.body;

        if (!title || title.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Le titre est obligatoire'
            });
        }

        const todoData = {
            title: title.trim(),
            description: description ? description.trim() : ''
        };

        TodoModel.create(todoData, (err, todo) => {
            if (err) {
                console.error('Erreur lors de la création de la tâche:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Erreur lors de la création'
                });
            }

            res.redirect('/');
        });
    }

    // Mettre à jour une tâche
    static update(req, res) {
        const id = req.params.id;
        const { title, description, completed } = req.body;

        if (!title || title.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Le titre est obligatoire'
            });
        }

        const todoData = {
            title: title.trim(),
            description: description ? description.trim() : '',
            completed: completed === 'on' ? 1 : 0
        };

        TodoModel.update(id, todoData, (err, result) => {
            if (err) {
                console.error('Erreur lors de la mise à jour:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Erreur lors de la mise à jour'
                });
            }

            res.redirect('/');
        });
    }

    // Basculer le statut de complétion
    static toggleComplete(req, res) {
        const id = req.params.id;

        TodoModel.toggleComplete(id, (err, result) => {
            if (err) {
                console.error('Erreur lors du basculement:', err);
                // Si c'est une requête AJAX, renvoyer JSON
                if (req.xhr || req.headers.accept.indexOf('json') > -1) {
                    return res.status(500).json({
                        success: false,
                        message: 'Erreur lors du basculement'
                    });
                }
                // Sinon rediriger avec message d'erreur
                return res.redirect('/?error=toggle');
            }

            // Si c'est une requête AJAX, renvoyer JSON
            if (req.xhr || req.headers.accept.indexOf('json') > -1) {
                return res.json({ success: true });
            }

            // Sinon rediriger vers la page index
            res.redirect('/');
        });
    }

    // Supprimer une tâche
    static delete(req, res) {
        const id = req.params.id;

        TodoModel.delete(id, (err, result) => {
            if (err) {
                console.error('Erreur lors de la suppression:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Erreur lors de la suppression'
                });
            }

            res.redirect('/');
        });
    }

    // Supprimer toutes les tâches terminées
    static deleteCompleted(req, res) {
        TodoModel.deleteCompleted((err, result) => {
            if (err) {
                console.error('Erreur lors de la suppression:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Erreur lors de la suppression'
                });
            }

            res.redirect('/');
        });
    }

    // API: Récupérer toutes les tâches (JSON)
    static apiGetAll(req, res) {
        TodoModel.getAll((err, todos) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Erreur serveur'
                });
            }

            res.json({ success: true, data: todos });
        });
    }

    // API: Récupérer une tâche par ID (JSON)
    static apiGetById(req, res) {
        const id = req.params.id;

        TodoModel.getById(id, (err, todo) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Erreur serveur'
                });
            }

            if (!todo) {
                return res.status(404).json({
                    success: false,
                    message: 'Tâche non trouvée'
                });
            }

            res.json({ success: true, data: todo });
        });
    }
}

module.exports = TodoController;
