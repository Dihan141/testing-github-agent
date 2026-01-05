import React, { useState, useEffect } from 'react';
import { todoAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './TodoList.css';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { logout, user } = useAuth();

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await todoAPI.getAll();
      setTodos(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch todos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const response = await todoAPI.create({
        title: newTodo,
        description: newDescription,
      });
      setTodos([response.data, ...todos]);
      setNewTodo('');
      setNewDescription('');
      setError('');
    } catch (err) {
      setError('Failed to add todo');
      console.error(err);
    }
  };

  const handleToggleTodo = async (id, completed) => {
    try {
      const response = await todoAPI.update(id, { completed: !completed });
      setTodos(todos.map((todo) => (todo.id === id ? response.data : todo)));
      setError('');
    } catch (err) {
      setError('Failed to update todo');
      console.error(err);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await todoAPI.delete(id);
      setTodos(todos.filter((todo) => todo.id !== id));
      setError('');
    } catch (err) {
      setError('Failed to delete todo');
      console.error(err);
    }
  };

  return (
    <div className="todo-container">
      <div className="todo-header">
        <h1>My Todo List</h1>
        <div className="user-info">
          <span>Welcome, {user?.name || user?.email}!</span>
          <button onClick={logout} className="btn-logout">
            Logout
          </button>
        </div>
      </div>

      <form onSubmit={handleAddTodo} className="todo-form">
        <div className="form-row">
          <input
            type="text"
            placeholder="What needs to be done?"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            className="input-title"
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            className="input-description"
          />
          <button type="submit" className="btn-add">
            Add
          </button>
        </div>
      </form>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading todos...</div>
      ) : (
        <div className="todo-list">
          {todos.length === 0 ? (
            <div className="empty-state">
              No todos yet. Add one to get started!
            </div>
          ) : (
            todos.map((todo) => (
              <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                <div className="todo-content">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggleTodo(todo.id, todo.completed)}
                    className="todo-checkbox"
                  />
                  <div className="todo-text">
                    <h3>{todo.title}</h3>
                    {todo.description && <p>{todo.description}</p>}
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteTodo(todo.id)}
                  className="btn-delete"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default TodoList;
