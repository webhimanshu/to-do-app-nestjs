"use client";

import axios from "axios";

// Central axios instance so all requests share the same base URL.
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/",
});

export default api;

