import { Todo } from "../models/todo.model.js";

//Create a new todo
export const createTodo = async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Todo text is required",
      });
    }
    const todo = await Todo.create({
      text,
      user: req.user._id,
    });
    res.status(201).json({
      success: true,
      data: todo,
    });
  } catch (error) {
    next(error);
  }
};

//Get all todos of logged-in user

export const getTodos = async (req, res, next) => {
  try {
    const todos = await Todo.find({ user: req.user._id }).sort("-createdAt");

    res.status(200).json({
      success: true,
      data: todos,
    });
  } catch (error) {
    next(error);
  }
};

//Update todo (text / completed)

export const updateTodo = async (req, res, next) => {
  try {
    const { id } = req.params;

    const todo = await Todo.findOneAndUpdate(
      { _id: id, user: req.user._id }, // ownership check
      req.body, // This is the data to update. 'req.body' contains the new values (e.g., { text: "New Task" } or { completed: true }) sent from the frontend. Mongoose applies these changes to the found document.
      { new: true, runValidators: true }
    );

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }
    res.status(200).json({
      success: true,
      data: todo,
    });
  } catch (error) {
    next(error);
  }
};

// Delete todo

export const deleteTodo = async (req, res, next) => {
  try {
    const { id } = req.params;

    const todo = await Todo.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Todo deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
