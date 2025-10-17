import React from "react";
import { Navigate, useLocation } from "react-router-dom";

interface Props {
  roles?: string[];
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ roles, children }) => {
  const token = localStorage.getItem("authToken");
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")!)
    : null;

  const location = useLocation();

  // No autenticado, redirige a login
  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  //  Usuario autenticado pero sin rol permitido
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  //  Autenticado y con rol válido, permite acceso
  return <>{children}</>;
};

export default ProtectedRoute;
