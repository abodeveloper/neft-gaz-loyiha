import { useAuthStore } from "@/store/auth-store";
import { ReactNode, useEffect, useRef } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { toastService } from "@/lib/toastService";

export default function AdminProtectedRoute({
  children,
}: {
  children: ReactNode;
}) {
  const { isAuthenticated, user, loading, fetchMe } = useAuthStore();
  const location = useLocation();
  const calledRef = useRef(false);

  useEffect(() => {
    if (isAuthenticated && !user && !calledRef.current && !loading) {
      calledRef.current = true;
      fetchMe();
    }
  }, [isAuthenticated, user, loading, fetchMe]);

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  if (!isAuthenticated) {
    toastService.info("Iltimos, tizimga kiring");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}