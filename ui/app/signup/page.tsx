"use client";

import { useMutation } from "@tanstack/react-query";
import SignupForm, { SignupFormData } from "../components/SignupForm";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import api from "../lib/api";

export default function SignupPage() {
  const router = useRouter();
  const signupMutation = useMutation(
    (payload: SignupFormData) =>
      api.post("auth/register", payload).then((resp) => resp.data),
    {
      onSuccess: () => {
        toast.success("Signup successful");
        router.push("/login");
      },
      onError: () => {
        toast.error("Signup failed");
      },
    }
  );

  const handleSubmit = (data: SignupFormData) => {
    signupMutation.mutate(data);
  };

  return <SignupForm onSubmit={handleSubmit} />;
}
