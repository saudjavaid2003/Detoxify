const Todo = require('../models/Todo');

// @desc    Create a new todo
const createTodo = async (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ message: 'Title is required' });

  try {
    const todo = await Todo.create({
      user: req.user.id,
      title
    });

    return res.status(201).json({ message: 'Todo created', todo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while creating todo' });
  }
};

// @desc    Get all todos for the logged-in user
const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id }).sort({ createdAt: -1 });
    return res.status(200).json({ todos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching todos' });
  }
};

// @desc    Update a specific todo (e.g., mark as completed)
const updateTodo = async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;

  try {
    const todo = await Todo.findOne({ _id: id, user: req.user.id });

    if (!todo) return res.status(404).json({ message: 'Todo not found' });

    if (title !== undefined) todo.title = title;
    if (completed !== undefined) todo.completed = completed;

    await todo.save();

    return res.status(200).json({ message: 'Todo updated', todo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while updating todo' });
  }
};

// @desc    Delete a specific todo
const deleteTodo = async (req, res) => {
  const { id } = req.params;

  try {
    const todo = await Todo.findOneAndDelete({ _id: id, user: req.user.id });

    if (!todo) return res.status(404).json({ message: 'Todo not found' });

    return res.status(200).json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while deleting todo' });
  }
};

module.exports = {
  createTodo,
  getTodos,
  updateTodo,
  deleteTodo
};
