const express = require('express');
const router = express.Router();
const protect = require('../middlewares/auth.middleware');
const {
  createTodo,
  getTodos,
  updateTodo,
  deleteTodo
} = require('../controllers/todo.controller');

// All routes require the user to be authenticated
router.post('/addtodo', protect, createTodo);        // Create new todo
router.get('/alltodo', protect, getTodos);           // Get all todos for user
router.put('/updatetodo/:id', protect, updateTodo);      // Update specific todo
router.delete('/deltodo/:id', protect, deleteTodo);   // Delete specific todo

module.exports = router;
