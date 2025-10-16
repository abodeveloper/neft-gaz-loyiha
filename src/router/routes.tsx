import { lazy } from "react";
import { Navigate } from "react-router-dom";
import AdminProtectedRoute from "./AdminProtectedRoute";

// Foydalanuvchi sahifalari
const LoginPage = lazy(() => import("@/features/auth/pages/LoginPage"));
const Layout = lazy(() => import("@/layout/layout"));

const NewsPage = lazy(() => import("@/features/news/NewsPage"));
const CreateNewsPage = lazy(() => import("@/features/news/CreateNewsPage"));
const UpdateNewsPage = lazy(() => import("@/features/news/UpdateNewsPage"));

//Admin sahifalari
const TeacherDashboardPage = lazy(
  () => import("@/features/teacher/dashboard/DashboardPage")
);

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
      { path: "news-and-announcements", element: <NewsPage /> },
      { path: "news-and-announcements/create", element: <CreateNewsPage /> },
      {
        path: "news-and-announcements/update/:id",
        element: <UpdateNewsPage />,
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
