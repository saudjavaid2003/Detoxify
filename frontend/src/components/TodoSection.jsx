import React, { useState } from 'react';

const TodoSection = () => {
  const [newTodo, setNewTodo] = useState('');
  const [todos, setTodos] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState('');

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Section Title */}
      <div className="text-xl font-bold border-b border-gray-600 pb-2">
        Manage Your Todos
      </div>

      {/* Add Todo */}
      <div className="bg-[#2a2a40] p-4 rounded-md">
        <h3 className="text-lg mb-2 font-semibold">➕ Add Todo</h3>
        <div className="flex space-x-3">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Enter new todo"
            className="bg-[#1f1f2e] px-4 py-2 rounded-md w-full text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <button
            className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-md"
            onClick={() => {
              if (!newTodo.trim()) return;
              setTodos([...todos, newTodo]);
              setNewTodo('');
            }}
          >
            Add
          </button>
        </div>
      </div>

      {/* View / Edit / Delete Todos */}
      <div className="bg-[#2a2a40] p-4 rounded-md">
        <h3 className="text-lg mb-2 font-semibold">📋 Your Todos</h3>
        {todos.length === 0 ? (
          <p className="text-sm text-gray-400">No todos added yet.</p>
        ) : (
          <ul className="space-y-3 text-sm text-white">
            {todos.map((todo, index) => (
              <li
                key={index}
                className="flex items-center justify-between bg-[#1f1f2e] px-4 py-2 rounded-md border border-gray-600"
              >
                {editIndex === index ? (
                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="bg-transparent border-b border-amber-400 focus:outline-none flex-1 mr-3"
                  />
                ) : (
                  <span className="flex-1">{todo}</span>
                )}

                <div className="flex gap-2">
                  {editIndex === index ? (
                    <button
                      onClick={() => {
                        const updated = [...todos];
                        updated[index] = editText;
                        setTodos(updated);
                        setEditIndex(null);
                        setEditText('');
                      }}
                      className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded text-sm"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setEditIndex(index);
                        setEditText(todo);
                      }}
                      className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-sm"
                    >
                      Edit
                    </button>
                  )}

                  <button
                    onClick={() => {
                      const filtered = todos.filter((_, i) => i !== index);
                      setTodos(filtered);
                      setEditIndex(null);
                    }}
                    className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
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
