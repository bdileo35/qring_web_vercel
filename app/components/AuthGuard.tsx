"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: "User" | "Admin" | "SuperAdmin";
  redirectTo?: string;
}

export default function AuthGuard({ 
  children, 
  requiredRole = "User", 
  redirectTo = "/login" 
}: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem("isLoggedIn");
      const role = localStorage.getItem("userRole");
      
      if (isLoggedIn === "true" && role) {
        setUserRole(role);
        
        // Verificar si el rol es suficiente
        const roleHierarchy = {
          "User": 1,
          "Admin": 2,
          "SuperAdmin": 3
        };
        
        const userLevel = roleHierarchy[role as keyof typeof roleHierarchy] || 0;
        const requiredLevel = roleHierarchy[requiredRole] || 0;
        
        if (userLevel >= requiredLevel) {
          setIsAuthenticated(true);
        } else {
          // Rol insuficiente, redirigir
          router.push(redirectTo);
        }
      } else {
        // No autenticado, redirigir al login
        router.push(redirectTo);
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, [router, requiredRole, redirectTo]);

  if (isLoading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f4f6fa"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ 
            fontSize: "24px", 
            marginBottom: "16px",
            color: "#1a4fa3"
          }}>
            🔐 Verificando autenticación...
          </div>
          <div style={{ 
            width: "40px", 
            height: "40px", 
            border: "4px solid #e0e0e0", 
            borderTop: "4px solid #1a4fa3", 
            borderRadius: "50%", 
            animation: "spin 1s linear infinite",
            margin: "0 auto"
          }}></div>
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // El router ya está redirigiendo
  }

  return <>{children}</>;
} 