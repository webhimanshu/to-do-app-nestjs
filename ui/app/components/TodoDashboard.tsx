"use client";

import React from "react";

export enum TodoStatus {
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
}

export interface Todo {
  id: string;
  name: string;
  description: string;
  time: string | null;
  status: TodoStatus;
  createdAt: string;
  updatedAt: string;
}

export interface TodoFormData {
  name: string;
  description: string;
  time: string;
  status: TodoStatus;
}

interface TodoDashboardProps {
  filterStatus: string;
  onFilterChange: (status: string) => void;
  onNewTodo: () => void;
  filteredTodos: Todo[];
  onEdit: (todo: Todo) => void;
  onStatusChange: (id: string, status: TodoStatus) => void;
  onDelete: (id: string) => void;
  showCreateForm: boolean;
  editingTodo: Todo | null;
  formData: TodoFormData;
  onFormChange: (updates: Partial<TodoFormData>) => void;
  onCreateSubmit: (e: React.FormEvent) => void;
  onUpdateSubmit: (e: React.FormEvent) => void;
  onCancelForm: () => void;
  onLogout: () => void;
}

const TodoDashboard: React.FC<TodoDashboardProps> = ({
  filterStatus,
  onFilterChange,
  onNewTodo,
  filteredTodos,
  onEdit,
  onStatusChange,
  onDelete,
  showCreateForm,
  editingTodo,
  formData,
  onFormChange,
  onCreateSubmit,
  onUpdateSubmit,
  onCancelForm,
  onLogout,
}) => {
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
              onClick={onLogout}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors cursor-pointer"
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
                    onClick={() => onFilterChange("all")}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      filterStatus === "all"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => onFilterChange(TodoStatus.IN_PROGRESS)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      filterStatus === TodoStatus.IN_PROGRESS
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() => onFilterChange(TodoStatus.COMPLETED)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      filterStatus === TodoStatus.COMPLETED
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Completed
                  </button>
                </div>
                <button
                  onClick={onNewTodo}
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
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {todo.status === TodoStatus.COMPLETED ? "Completed" : "In Progress"}
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
                          <span>Created: {new Date(todo.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => onEdit(todo)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
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
                            onStatusChange(
                              todo.id,
                              todo.status === TodoStatus.COMPLETED
                                ? TodoStatus.IN_PROGRESS
                                : TodoStatus.COMPLETED
                            )
                          }
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors cursor-pointer"
                          title={todo.status === TodoStatus.COMPLETED ? "Mark In Progress" : "Mark Completed"}
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
                          onClick={() => onDelete(todo.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1 1h-4a1 1 0 00-1 1v3M4 7h16"
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
                {editingTodo ? "Edit Todo" : "Create Todo"}
              </h2>
              {(showCreateForm || editingTodo) && (
                <form
                  onSubmit={editingTodo ? onUpdateSubmit : onCreateSubmit}
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
                      onChange={(e) => onFormChange({ name: e.target.value })}
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
                      onChange={(e) => onFormChange({ description: e.target.value })}
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
                      onChange={(e) => onFormChange({ time: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => onFormChange({ status: e.target.value as TodoStatus })}
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
                      {editingTodo ? "Update" : "Create"}
                    </button>
                    <button
                      type="button"
                      onClick={onCancelForm}
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
};

export default TodoDashboard;

