import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TodoSection = () => {
  const [newTodo, setNewTodo] = useState('');
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get auth token
  const getAuthHeader = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });

  // Fetch todos on component mount
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/todo/alltodo', getAuthHeader());
        setTodos(response.data.todos || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch todos');
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  // Add new todo
  const handleAddTodo = async () => {
    if (!newTodo.trim()) return;

    try {
      setLoading(true);
      const response = await axios.post(
        'http://localhost:5000/api/todo/addtodo',
        { title: newTodo.trim() },
        getAuthHeader()
      );
      setTodos([response.data.todo, ...todos]);
      setNewTodo('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add todo');
    } finally {
      setLoading(false);
    }
  };

  // Update todo
  const handleUpdateTodo = async (id) => {
    if (!editText.trim()) return;

    try {
      setLoading(true);
      const response = await axios.put(
        `http://localhost:5000/api/todo/updatetodo/${id}`,
        { title: editText.trim() },
        getAuthHeader()
      );
      setTodos(todos.map(todo => 
        todo._id === id ? response.data.todo : todo
      ));
      setEditId(null);
      setEditText('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update todo');
    } finally {
      setLoading(false);
    }
  };

  // Delete todo
  const handleDeleteTodo = async (id) => {
    try {
      setLoading(true);
      await axios.delete(
        `http://localhost:5000/api/todo/deltodo/${id}`,
        getAuthHeader()
      );
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete todo');
    } finally {
      setLoading(false);
    }
  };

  // Toggle todo completion
  const handleToggleComplete = async (id, currentStatus) => {
    try {
      setLoading(true);
      const response = await axios.put(
        `http://localhost:5000/api/todo/updatetodo/${id}`,
        { completed: !currentStatus },
        getAuthHeader()
      );
      setTodos(todos.map(todo => 
        todo._id === id ? response.data.todo : todo
      ));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update todo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-900/50 border border-red-700 rounded-lg flex justify-between items-center">
          <span>{error}</span>
          <button 
            onClick={() => setError(null)}
            className="text-red-300 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Section Title */}
      <h2 className="text-2xl font-bold text-white border-b border-gray-600 pb-2">
        Manage Your Todos
      </h2>

      {/* Add Todo */}
      <div className="bg-gray-800 p-4 rounded-lg shadow border border-gray-700">
        <h3 className="text-lg font-semibold mb-3 text-white">Add New Todo</h3>
        <div className="flex gap-3">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
            placeholder="Enter new todo"
            className="flex-1 bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            disabled={loading}
          />
          <button
            onClick={handleAddTodo}
            disabled={loading || !newTodo.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add'}
          </button>
        </div>
      </div>

      {/* Todo List */}
      <div className="bg-gray-800 p-4 rounded-lg shadow border border-gray-700">
        <h3 className="text-lg font-semibold mb-3 text-white">Your Todos</h3>
        
        {loading && todos.length === 0 ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : todos.length === 0 ? (
          <p className="text-gray-400 text-center py-4">No todos yet. Add one above!</p>
        ) : (
          <ul className="space-y-2">
            {todos.map((todo) => (
              <li 
                key={todo._id}
                className={`bg-gray-700 p-3 rounded border ${todo.completed ? 'border-green-500' : 'border-gray-600'}`}
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggleComplete(todo._id, todo.completed)}
                    className="mr-3 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  
                  {editId === todo._id ? (
                    <input
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="flex-1 bg-gray-600 text-white px-2 py-1 rounded border border-blue-500 focus:outline-none"
                    />
                  ) : (
                    <span className={`flex-1 ${todo.completed ? 'line-through text-gray-400' : 'text-white'}`}>
                      {todo.title}
                    </span>
                  )}

                  <div className="flex gap-2 ml-3">
                    {editId === todo._id ? (
                      <button
                        onClick={() => handleUpdateTodo(todo._id)}
                        disabled={!editText.trim()}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setEditId(todo._id);
                          setEditText(todo.title);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                      >
                        Edit
                      </button>
                    )}

                    <button
                      onClick={() => handleDeleteTodo(todo._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TodoSection;