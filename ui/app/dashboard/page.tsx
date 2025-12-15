'use client';

import { useState } from 'react';
import Link from 'next/link';

enum TodoStatus {
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

interface Todo {
  id: string;
  name: string;
  description: string;
  time: string | null;
  status: TodoStatus;
  createdAt: string;
  updatedAt: string;
}

interface TodoFormData {
  name: string;
  description: string;
  time: string;
  status: TodoStatus;
}

export default function DashboardPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [formData, setFormData] = useState<TodoFormData>({
    name: '',
    description: '',
    time: '',
    status: TodoStatus.IN_PROGRESS,
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTodo: Todo = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTodos([...todos, newTodo]);
    setFormData({ name: '', description: '', time: '', status: TodoStatus.IN_PROGRESS });
    setShowCreateForm(false);
    console.log('Todo created:', newTodo);
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTodo) return;
    
    const updatedTodos = todos.map((todo) =>
      todo.id === editingTodo.id
        ? { ...todo, ...formData, updatedAt: new Date().toISOString() }
        : todo
    );
    setTodos(updatedTodos);
    setEditingTodo(null);
    setFormData({ name: '', description: '', time: '', status: TodoStatus.IN_PROGRESS });
    console.log('Todo updated:', editingTodo.id);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this todo?')) {
      setTodos(todos.filter((todo) => todo.id !== id));
      console.log('Todo deleted:', id);
    }
  };

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setFormData({
      name: todo.name,
      description: todo.description,
      time: todo.time || '',
      status: todo.status,
    });
    setShowCreateForm(false);
  };

  const handleStatusChange = (id: string, newStatus: TodoStatus) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, status: newStatus, updatedAt: new Date().toISOString() } : todo
    );
    setTodos(updatedTodos);
    console.log('Todo status updated:', id, newStatus);
  };

  const filteredTodos = todos.filter((todo) => {
    if (filterStatus === 'all') return true;
    return todo.status === filterStatus;
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Todo Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your tasks efficiently</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Filters and Create Button */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilterStatus('all')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      filterStatus === 'all'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilterStatus(TodoStatus.IN_PROGRESS)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      filterStatus === TodoStatus.IN_PROGRESS
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() => setFilterStatus(TodoStatus.COMPLETED)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      filterStatus === TodoStatus.COMPLETED
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Completed
                  </button>
                </div>
                <button
                  onClick={() => {
                    setShowCreateForm(true);
                    setEditingTodo(null);
                    setFormData({ name: '', description: '', time: '', status: TodoStatus.IN_PROGRESS });
                  }}
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors"
                >
                  + New Todo
                </button>
              </div>
            </div>

            {/* Todo List */}
            <div className="space-y-4">
              {filteredTodos.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                  <p className="text-gray-500 text-lg">No todos found</p>
                  <p className="text-gray-400 mt-2">Create your first todo to get started!</p>
                </div>
              ) : (
                filteredTodos.map((todo) => (
                  <div
                    key={todo.id}
                    className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">{todo.name}</h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              todo.status === TodoStatus.COMPLETED
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {todo.status === TodoStatus.COMPLETED ? 'Completed' : 'In Progress'}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">{todo.description}</p>
                        <div className="flex gap-4 text-sm text-gray-500">
                          {todo.time && (
                            <span className="flex items-center gap-1">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              {todo.time}
                            </span>
                          )}
                          <span>
                            Created: {new Date(todo.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleEdit(todo)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() =>
                            handleStatusChange(
                              todo.id,
                              todo.status === TodoStatus.COMPLETED
                                ? TodoStatus.IN_PROGRESS
                                : TodoStatus.COMPLETED
                            )
                          }
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title={todo.status === TodoStatus.COMPLETED ? 'Mark In Progress' : 'Mark Completed'}
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(todo.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Sidebar - Create/Edit Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {editingTodo ? 'Edit Todo' : 'Create Todo'}
              </h2>
              {(showCreateForm || editingTodo) && (
                <form
                  onSubmit={editingTodo ? handleUpdateSubmit : handleCreateSubmit}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Todo name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Todo description"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time
                    </label>
                    <input
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as TodoStatus })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value={TodoStatus.IN_PROGRESS}>In Progress</option>
                      <option value={TodoStatus.COMPLETED}>Completed</option>
                    </select>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                      {editingTodo ? 'Update' : 'Create'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateForm(false);
                        setEditingTodo(null);
                        setFormData({ name: '', description: '', time: '', status: TodoStatus.IN_PROGRESS });
                      }}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
              {!showCreateForm && !editingTodo && (
                <div className="text-center py-8 text-gray-500">
                  <p>Click &quot;New Todo&quot; to create a task</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

