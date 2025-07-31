import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface User {
  user_id: string;                    // Required: always present from DB
  email: string;                      // Required: primary identifier
  full_name?: string;                // Optional: user may not fill this yet
  email_verified: boolean;           // Required: important for access control
  subscription_plan?: "free" | "pro" | "business"; // Optional & strict
  plan_expires?: string | null;     // Optional: ISO date or null if on Free plan
  last_payment?: string | null;     // Optional: track last successful payment
  payment_method?: "card" | "paypal" | "mobile_money" | "crypto"; // Optional enum
  created_at: string;               // Required: useful for logging/analytics
  updated_at?: string;  

}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (user: User) => {
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
