"use client";

import { useMutation } from "@tanstack/react-query";
import LoginForm, { LoginFormData } from "../components/LoginForm";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import api from "../lib/api";

export default function LoginPage() {
  const auth = useAuth();
  const router = useRouter();
  const loginMutation = useMutation({
    mutationFn: (payload: LoginFormData)=> api.post('auth/login', payload).then((resp)=> resp.data),
    onSuccess(data) {
      const user = {
        name: data.data.name,
        gender: data.data.gender,
        country: data.data.country,
        hobbies: data.data.hobbies,
        email: data.data.email
      };
      auth.login(data.data.accessToken, user);
      toast.success(data.message);
      router.push('/dashboard');
    },
    onError() {
      toast.error("Login Failed")
    },
  });

  const handleSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return <LoginForm onSubmit={handleSubmit} />;
}