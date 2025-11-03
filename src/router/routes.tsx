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

const CarouselsPage = lazy(() => import("@/features/carousels/CarouselsPage"));
const CreateCarouselPage = lazy(
  () => import("@/features/carousels/CreateCarouselPage")
);
const UpdateCarouselPage = lazy(
  () => import("@/features/carousels/UpdateCarouselPage")
);
const CarouselDetailPage = lazy(
  () => import("@/features/carousels/CarouselDetailPage")
);

const MenusPage = lazy(() => import("@/features/menu/MenusPage"));
const CreateMenuPage = lazy(() => import("@/features/menu/CreateMenuPage"));
const UpdateMenuPage = lazy(() => import("@/features/menu/UpdateMenuPage"));
const MenuDetailPage = lazy(() => import("@/features/menu/MenuDetailPage"));


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
      {
        path: "carousels",
        children: [
          { index: true, element: <CarouselsPage /> },
          { path: "create", element: <CreateCarouselPage /> },
          { path: "update/:id", element: <UpdateCarouselPage /> },
          { path: "view/:id", element: <CarouselDetailPage /> },
        ],
      },
      {
        path: "menus",
        children: [
          { index: true, element: <MenusPage /> },
          { path: "create", element: <CreateMenuPage /> },
          { path: "update/:id", element: <UpdateMenuPage /> },
          { path: "view/:id", element: <MenuDetailPage /> },
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
