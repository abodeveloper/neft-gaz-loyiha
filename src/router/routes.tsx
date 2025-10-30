import { lazy } from "react";
import { Navigate } from "react-router-dom";
import AdminProtectedRoute from "./AdminProtectedRoute";

// Foydalanuvchi sahifalari
const LoginPage = lazy(() => import("@/features/auth/pages/LoginPage"));
const Layout = lazy(() => import("@/layout/layout"));

const NewsPage = lazy(() => import("@/features/news/NewsPage"));
const CreateNewsPage = lazy(() => import("@/features/news/CreateNewsPage"));
const UpdateNewsPage = lazy(() => import("@/features/news/UpdateNewsPage"));
const NewsDetailPage = lazy(() => import("@/features/news/NewsDetailPage"));

export const routes = [
  {
    path: "/login",
    element: <LoginPage />,
  },
  // Admin routes
  {
    path: "/dashboard",
    element: (
      <AdminProtectedRoute>
        <Layout />
      </AdminProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="home" /> },
      { path: "home", element: <div>Home</div> },
      {
        path: "news-and-announcements",
        children: [
          { index: true, element: <NewsPage /> },
          { path: "create", element: <CreateNewsPage /> },
          { path: "update/:id", element: <UpdateNewsPage /> },
          { path: "view/:id", element: <NewsDetailPage /> },
        ],
      },
      { path: "profile", element: <div>Profile</div> },
      {
        path: "*",
        element: <Navigate to="/dashboard" />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/login" />,
  },
];
