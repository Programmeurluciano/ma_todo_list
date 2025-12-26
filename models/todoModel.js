const db = require('../database/database');

class TodoModel {
    // Récupérer toutes les tâches
    static getAll(callback) {
        const sql = 'SELECT * FROM todos ORDER BY created_at DESC';
        db.all(sql, [], (err, rows) => {
            if (err) {
                callback(err, null);
            } else {
                callback(null, rows);
            }
        });
    }

    // Récupérer une tâche par ID
    static getById(id, callback) {
        const sql = 'SELECT * FROM todos WHERE id = ?';
        db.get(sql, [id], (err, row) => {
            if (err) {
                callback(err, null);
            } else {
                callback(null, row);
            }
        });
    }

    // Créer une nouvelle tâche
    static create(todoData, callback) {
        const sql = 'INSERT INTO todos (title, description) VALUES (?, ?)';
        const params = [todoData.title, todoData.description || ''];

        db.run(sql, params, function(err) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, { id: this.lastID, ...todoData });
            }
        });
    }

    // Mettre à jour une tâche
    static update(id, todoData, callback) {
        const sql = `
            UPDATE todos
            SET title = ?,
                description = ?,
                completed = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `;
        const params = [
            todoData.title,
            todoData.description || '',
            todoData.completed || 0,
            id
        ];

        db.run(sql, params, function(err) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, { changes: this.changes });
            }
        });
    }

    // Basculer le statut completed
    static toggleComplete(id, callback) {
        const sql = `
            UPDATE todos
            SET completed = CASE WHEN completed = 0 THEN 1 ELSE 0 END,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `;

        db.run(sql, [id], function(err) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, { changes: this.changes });
            }
        });
    }

    // Supprimer une tâche
    static delete(id, callback) {
        const sql = 'DELETE FROM todos WHERE id = ?';

        db.run(sql, [id], function(err) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, { changes: this.changes });
            }
        });
    }

    // Supprimer toutes les tâches terminées
    static deleteCompleted(callback) {
        const sql = 'DELETE FROM todos WHERE completed = 1';

        db.run(sql, [], function(err) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, { changes: this.changes });
            }
        });
    }

    // Obtenir les statistiques
    static getStats(callback) {
        const sql = `
            SELECT
                COUNT(*) as total,
                SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) as completed,
                SUM(CASE WHEN completed = 0 THEN 1 ELSE 0 END) as pending
            FROM todos
        `;

        db.get(sql, [], (err, row) => {
            if (err) {
                callback(err, null);
            } else {
                callback(null, row);
            }
        });
    }
}

module.exports = TodoModel;
