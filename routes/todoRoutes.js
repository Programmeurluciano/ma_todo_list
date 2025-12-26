const express = require('express');
const router = express.Router();
const TodoController = require('../controllers/todoController');

// Routes Web (vues HTML)
router.get('/', TodoController.index);
router.post('/todos', TodoController.create);
router.post('/todos/:id/update', TodoController.update);
router.post('/todos/:id/toggle', TodoController.toggleComplete);
router.post('/todos/:id/delete', TodoController.delete);
router.post('/todos/delete-completed', TodoController.deleteCompleted);

// Routes API (JSON)
router.get('/api/todos', TodoController.apiGetAll);
router.get('/api/todos/:id', TodoController.apiGetById);

module.exports = router;
