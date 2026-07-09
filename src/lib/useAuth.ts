"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export interface AuthUser {
  id: string;
  username: string;
  name: string;
  role: "admin" | "kasir" | "dapur" | "pelayan";
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then((data) => {
        setUser(data.user);
        setLoading(false);
      })
      .catch(() => {
        setUser(null);
        setLoading(false);
      });
  }, []);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return { user, loading, logout };
}

// Check if a role has access to a path
export function hasAccess(role: string, path: string): boolean {
  const ROLE_ACCESS: Record<string, string[]> = {
    admin: ["*"],
    kasir: ["/", "/cashier", "/orders", "/customers", "/tables", "/products", "/loyalty", "/queue", "/settings"],
    dapur: ["/", "/kitchen", "/queue", "/display", "/orders"],
    pelayan: ["/", "/orders", "/tables", "/queue", "/display"],
  };

  const allowedPaths = ROLE_ACCESS[role] || [];
  if (allowedPaths.includes("*")) return true;
  return allowedPaths.some((p) => path === p || path.startsWith(p + "/"));
}
