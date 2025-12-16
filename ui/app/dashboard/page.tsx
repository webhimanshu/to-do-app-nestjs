"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import TodoDashboard, {
  Todo,
  TodoFormData,
  TodoStatus,
} from "../components/TodoDashboard";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

interface UpdateTodoForm {
  name?: string;
  description?: string;
  time?: string;
  status?: TodoStatus;
}

export default function DashboardPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const router = useRouter();
  const auth = useAuth();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<TodoFormData>({
    name: "",
    description: "",
    time: "",
    status: TodoStatus.IN_PROGRESS,
  });

  const { data } = useQuery({
    queryKey: ["todos"],
    queryFn: () =>
      api
        .get("todos", {
          headers: { Authorization: `Bearer ${auth.token}` },
        })
        .then((resp) => resp.data),
  });
  console.log("🚀 ~ DashboardPage ~ data:", data)

  const { data: todos, isLoading } = useQuery({
    queryKey: ["paginatedTodos", currentPage, itemsPerPage],
    queryFn: () =>
      api
        .get("todos/paginated", {
          headers: { Authorization: `Bearer ${auth.token}` },
          params: { page: currentPage, limit: itemsPerPage },
        })
        .then((resp) => resp.data),
  });

  const totalPages = Math.ceil(todos?.data?.total / itemsPerPage);

  const createTodo = useMutation({
    mutationFn: (payload: TodoFormData) =>
      api
        .post("todos", payload, {
          headers: { Authorization: `Bearer ${auth.token}` },
        })
        .then((resp) => resp.data),

    onSuccess: () => {
      toast.success("Todo Created");
      queryClient.invalidateQueries({ queryKey: ["paginatedTodos"] });
      setShowCreateForm(false);
      setEditingTodo(null);
      setFormData({
        name: "",
        description: "",
        time: "",
        status: TodoStatus.IN_PROGRESS,
      });
    },

    onError: (error) => {
      console.log("Error", error);
      toast.error((error as Error).message);
    },
  });

  const updateTodo = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTodoForm }) =>
      api
        .patch(`todos/${id}`, payload, {
          headers: { Authorization: `Bearer ${auth.token}` },
        })
        .then((resp) => resp.data),

    onSuccess: () => {
      toast.success("Todo updated");
      queryClient.invalidateQueries({ queryKey: ["paginatedTodos"] });
      setShowCreateForm(false);
      setEditingTodo(null);
      setFormData({
        name: "",
        description: "",
        time: "",
        status: TodoStatus.IN_PROGRESS,
      });
    },

    onError: (error) => {
      console.log("Error", error);
      toast.error((error as Error).message);
    },
  });

  const deleteTodo = useMutation({
    mutationFn: ({ id }: { id: string }) =>
      api
        .delete(`todos/${id}`, {
          headers: { Authorization: `Bearer ${auth.token}` },
        })
        .then((resp) => resp.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paginatedTodos"] });
      toast.success("Todo Deleted Successfully");
    },
    onError: (error) => {
      console.log("Error", error);
      toast.error((error as Error).message);
    },
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTodo.mutate(formData);
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTodo) {
      updateTodo.mutate({ id: editingTodo.id, payload: formData });
    }
  };

  const handleDelete = (id: string) => {
    deleteTodo.mutate({ id });
  };

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setShowCreateForm(true);
    setFormData({
      name: todo.name,
      description: todo.description,
      time: todo.time ?? "",
      status: todo.status,
    });
  };

  const handleStatusChange = (id: string, status: string) => {
    updateTodo.mutate({ id, payload: { status: status as TodoStatus } });
  };

  const filteredTodos = todos?.data.todos.filter((todo: TodoFormData) => {
    if (filterStatus === "all") return true;
    return todo.status === filterStatus;
  });

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    router.push("/login");
  };

  if (isLoading)
    return (
      <div className="bg-black/10 fixed inset-0 flex justify-center items-center">
        <div className="three-body">
          <div className="three-body__dot"></div>
          <div className="three-body__dot"></div>
          <div className="three-body__dot"></div>
        </div>
      </div>
    );

  return (
    <TodoDashboard
      filterStatus={filterStatus}
      onFilterChange={setFilterStatus}
      onNewTodo={() => {
        setShowCreateForm(true);
        setEditingTodo(null);
        setFormData({
          name: "",
          description: "",
          time: "",
          status: TodoStatus.IN_PROGRESS,
        });
      }}
      filteredTodos={filteredTodos}
      onEdit={handleEdit}
      onStatusChange={handleStatusChange}
      onDelete={handleDelete}
      showCreateForm={showCreateForm}
      editingTodo={editingTodo}
      formData={formData}
      onFormChange={(updates) =>
        setFormData((prev) => ({ ...prev, ...updates }))
      }
      onCreateSubmit={handleCreateSubmit}
      onUpdateSubmit={handleUpdateSubmit}
      onCancelForm={() => {
        setShowCreateForm(false);
        setEditingTodo(null);
        setFormData({
          name: "",
          description: "",
          time: "",
          status: TodoStatus.IN_PROGRESS,
        });
      }}
      onLogout={handleLogout}
      currentPage={currentPage}
      totalPages={totalPages}
      totalItems={todos?.data?.total}
      itemsPerPage={itemsPerPage}
      onPageChange={setCurrentPage}
    />
  );
}
