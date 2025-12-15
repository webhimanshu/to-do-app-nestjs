import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

interface User {
  name: string;
  email: string;
  gender: string;
  hobbies: string;
  country: string;
}

interface AuthContextValue {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  user: User | null;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem("authToken");
  });
  const [user, setUser] = useState<User | null>(null);
  const publicRoutes = ['/login', '/signup', '/'];
  const router = useRouter();
  const pathname = usePathname();

  const login = (token: string, user: User) => {
    setToken(token);
    setUser(user);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("authToken", token);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("authToken");
    }
  };

  useEffect(() => {
    if (!token && !publicRoutes.includes(pathname)) {
      router.push("/login");
      toast.error("Please login to access this page");
    }
  }, [token, pathname, router]);

  return (
    <AuthContext.Provider
      value={{
        token,
        login,
        logout,
        isAuthenticated: Boolean(token),
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};
