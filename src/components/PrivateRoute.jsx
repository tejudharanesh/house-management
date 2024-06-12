import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStatus } from "../hooks/useAuthStatus";
import Spinner from "./Spinner";

const PrivateRoute = () => {
  const { loading, isAuthenticated } = useAuthStatus();
  if (loading) {
    return <Spinner />;
  }
  return isAuthenticated ? <Outlet /> : <Navigate to="/sign-in" />;
};

export default PrivateRoute;
