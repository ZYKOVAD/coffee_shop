import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import type { ReactNode } from "react";
import type { UserRole } from "../types/auth";

interface Props {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)
  ) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}