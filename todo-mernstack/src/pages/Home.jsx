import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const Home = () => {
  const { isLoggedIn } = useAuth();

  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");
  const [editingId, setEditingId] = useState(null);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  const handleAddOrUpdate = () => {
    if (!task.trim()) return;

    if (editingId) {
      setTodos((prev) =>
        prev.map((t) =>
          t.id === editingId ? { ...t, text: task } : t
        )
      );
      setEditingId(null);
    } else {
      setTodos((prev) => [
        ...prev,
        { id: Date.now(), text: task },
      ]);
    }

    setTask("");
  };

  const handleEdit = (todo) => {
    setTask(todo.text);
    setEditingId(todo.id);
  };

  const handleDelete = (id) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-4">Your Todos</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter task"
          className="flex-1 border px-3 py-2 rounded"
        />
        <button
          onClick={handleAddOrUpdate}
          className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700 cursor-pointer"
        >
          {editingId ? "Update" : "Add"}
        </button>
      </div>

      <ul className="space-y-2">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex justify-between items-center border p-3 rounded"
          >
            <span>{todo.text}</span>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(todo)}
                className="text-sm bg-yellow-400 px-3 py-1 rounded cursor-pointer"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(todo.id)}
                className="text-sm bg-red-500 text-white px-3 py-1 rounded cursor-pointer"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
