import api from "./api";

//getting all todo

export const getAllTodos = async () => {
  try {
    const response = await api.get("/todos");
    return response.data.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch todos" };
  }
};

//creating new todo

export const createTodo = async (text) => {
  try {
    const response = await api.post("/todos", { text });
    return response.data.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to create todo" };
  }
};

//Updating todo (text or completed status)

export const updateTodo = async (id, update) => {
  try {
    const response = await api.put(`/todos/${id}`, update);
    return response.data?.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to update todo" };
  }
};

//Deleting todo

export const deleteTodo = async (id) => {
  try {
    const response = await api.delete(`/todos/${id}`);
    return response.data?.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to delete todo" };
  }
};
