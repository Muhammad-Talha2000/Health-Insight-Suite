import { useState, useCallback } from "react";
import { useLocation } from "wouter";

const AUTH_KEY = "hims_auth_user";

export interface AuthUser {
  name: string;
  role: string;
  department: string;
  username: string;
}

const DEMO_USERS: Record<string, AuthUser & { password: string }> = {
  admin: { name: "Dr. Admin User", role: "Administrator", department: "Administration", username: "admin", password: "hims2026" },
  doctor: { name: "Dr. Faisal Qureshi", role: "Doctor", department: "Internal Medicine", username: "doctor", password: "hims2026" },
  nurse: { name: "Sr. Nurse Fatima", role: "Nurse", department: "General Ward A", username: "nurse", password: "hims2026" },
  pharmacist: { name: "Mr. Asif Raza", role: "Pharmacist", department: "Pharmacy", username: "pharmacist", password: "hims2026" },
};

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem(AUTH_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [, setLocation] = useLocation();

  const login = useCallback((username: string, password: string): boolean => {
    const found = DEMO_USERS[username];
    if (found && found.password === password) {
      const { password: _p, ...authUser } = found;
      localStorage.setItem(AUTH_KEY, JSON.stringify(authUser));
      setUser(authUser);
      setLocation("/dashboard");
      return true;
    }
    return false;
  }, [setLocation]);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_KEY);
    setUser(null);
    setLocation("/login");
  }, [setLocation]);

  return { user, isAuthenticated: !!user, login, logout };
}
