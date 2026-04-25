import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { MyContext } from "../App";
import CircularProgress from "@mui/material/CircularProgress";

const ProtectedRoute = ({ children }) => {
  const context = useContext(MyContext);
  const location = useLocation();
  const token = localStorage.getItem("accesstoken");
  const isAdmin = context?.userData?.role === "ADMIN";

  // ✅ Đang check auth → chưa redirect, hiện loading
  if (context.isCheckingAuth) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (!token || !context.islogin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
