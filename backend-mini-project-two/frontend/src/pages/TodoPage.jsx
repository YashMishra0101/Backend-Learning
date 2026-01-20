import {
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  LogOut,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Layout from "../components/Layout";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useState, useEffect } from "react";
import api from "../services/api";
import {
  getAllTodos,
  createTodo,
  deleteTodo,
  updateTodo,
} from "../services/todo.service";

const TodoPage = () => {
  const navigate = useNavigate();
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const data = await getAllTodos();
      setTodos(data);
    } catch (error) {
      toast.error(error.message || "Failed to load todos");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) {
      toast.error("Please enter a task");
      return;
    }
    try {
      const todo = await createTodo(newTodo);
      setTodos([todo, ...todos]);
      setNewTodo("");
      toast.success("Task added successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);
      setTodos(todos.filter((todo) => todo._id !== id));
      toast.success("Task deleted");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout"); //calling backend to clear cookie
    } catch (error) {
      toast.error(error.message);
    }
    localStorage.clear();
    sessionStorage.clear();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleToggle = async (id, currentStatus) => {
    try {
      const updatedTodo = await updateTodo(id, { completed: !currentStatus });
      setTodos(todos.map((todo) => (todo._id === id ? updatedTodo : todo)));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const startEdit = (todo) => {
    setEditingId(todo._id);
    setEditText(todo.text);
  };

  const saveEdit = async () => {
    if (!editText.trim()) {
      toast.error("Task cannot be empty");
      return;
    }
    try {
      const updatedTodo = await updateTodo(editingId, { text: editText });
      setTodos(
        todos.map((todo) => (todo._id === editingId ? updatedTodo : todo)),
      );
      setEditingId(null);
      toast.success("Task updated");
    } catch (error) {
      toast.error(error.message || "Failed to update task");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const userName = localStorage.getItem("userName") || "User";

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 card-panel p-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome, {userName}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              My Tasks • {todos.filter((t) => !t.completed).length} tasks
              remaining
            </p>
          </div>
          <Button variant="danger" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>

        {/* Add Todo Form */}
        <form onSubmit={handleAddTodo} className="mb-8 flex gap-4">
          <Input
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1"
          />
          <Button type="submit" size="default">
            <Plus className="mr-2 h-5 w-5" />
            Add Task
          </Button>
        </form>

        {/* Todo List */}
        <div className="space-y-3">
          {todos.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <CheckCircle className="mx-auto h-12 w-12 mb-4 opacity-20" />
              <p>No tasks yet. Add one to get started!</p>
            </div>
          ) : (
            todos.map((todo) => (
              <div
                key={todo._id}
                className={`card-panel p-4 flex items-center justify-between group transition-all duration-200 ${todo.completed
                  ? "opacity-60 bg-gray-50"
                  : "hover:border-indigo-300"
                  }`}
              >
                {editingId === todo._id ? (
                  <div className="flex-1 flex items-center gap-3 pr-4">
                    <Input
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <Button size="icon" variant="primary" onClick={saveEdit}>
                        <Check size={18} />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={cancelEdit}>
                        <X size={18} />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-4 flex-1">
                      <button
                        onClick={() => handleToggle(todo._id, todo.completed)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${todo.completed
                          ? "bg-indigo-600 border-indigo-600"
                          : "border-gray-300 hover:border-indigo-600"
                          }`}
                      >
                        {todo.completed && (
                          <Check size={14} className="text-white" />
                        )}
                      </button>
                      <span
                        className={`text-lg transition-all ${todo.completed
                          ? "line-through text-gray-400"
                          : "text-gray-900 font-medium"
                          }`}
                      >
                        {todo.text}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => startEdit(todo)}
                      >
                        <Edit2
                          size={18}
                          className="text-gray-400 hover:text-indigo-600"
                        />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(todo._id)}
                      >
                        <Trash2
                          size={18}
                          className="text-gray-400 hover:text-red-600"
                        />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TodoPage;
