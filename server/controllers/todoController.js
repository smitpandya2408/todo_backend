const Todo = require("../models/Todo");

// Get all todos for the logged-in user
exports.getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.user });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching todos", error: err.message });
  }
};

// Create a new todo
exports.createTodo = async (req, res) => {
  try {
    const { text } = req.body;
    const newTodo = new Todo({
      userId: req.user,
      text,
      completed: false,
    });
    const savedTodo = await newTodo.save();
    res.status(201).json(savedTodo);
  } catch (err) {
    res.status(500).json({ msg: "Error creating todo", error: err.message });
  }
};

// Update a todo
exports.updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, completed } = req.body;

    const todo = await Todo.findOneAndUpdate(
      { _id: id, userId: req.user },
      { text, completed },
      { new: true }
    );

    if (!todo) return res.status(404).json({ msg: "Todo not found" });

    res.json(todo);
  } catch (err) {
    res.status(500).json({ msg: "Error updating todo", error: err.message });
  }
};

// Delete a todo
exports.deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTodo = await Todo.findOneAndDelete({ _id: id, userId: req.user });

    if (!deletedTodo) return res.status(404).json({ msg: "Todo not found" });

    res.json({ msg: "Todo deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Error deleting todo", error: err.message });
  }
};
