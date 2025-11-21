import { lazy } from "react";
import { Navigate } from "react-router-dom";
import AdminProtectedRoute from "./AdminProtectedRoute";

// Foydalanuvchi sahifalari
const LoginPage = lazy(() => import("@/features/auth/pages/LoginPage"));
const Layout = lazy(() => import("@/layout/layout"));

const HomePage = lazy(() => import("@/features/home/HomePage"));

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

const MenusPage = lazy(() => import("@/features/menu/MenusPage"));
const CreateMenuPage = lazy(() => import("@/features/menu/CreateMenuPage"));
const UpdateMenuPage = lazy(() => import("@/features/menu/UpdateMenuPage"));
const MenuDetailPage = lazy(() => import("@/features/menu/MenuDetailPage"));

const MenuPagesPage = lazy(() => import("@/features/menu-pages/MenuPagesPage"));
const MenuPageDetailPage = lazy(
  () => import("@/features/menu-pages/detail/MenuPageDetailPage")
);
const CreatePageImagePage = lazy(
  () => import("@/features/menu-pages/detail/page-images/CreatePageImagePage")
);
const UpdatePageImagePage = lazy(
  () => import("@/features/menu-pages/detail/page-images/UpdatePageImagePage")
);
const CreatePageFilePage = lazy(
  () => import("@/features/menu-pages/detail/page-files/CreatePageFilePage")
);
const UpdatePageFilePage = lazy(
  () => import("@/features/menu-pages/detail/page-files/UpdatePageFilePage")
);

const EmployeesPage = lazy(() => import("@/features/employees/EmployeesPage"));
const CreateEmployeesPage = lazy(
  () => import("@/features/employees/CreateEmployeePage")
);
const UpdateEmployeesPage = lazy(
  () => import("@/features/employees/UpdateEmployeePage")
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
      { path: "home", element: <HomePage /> },
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
      {
        path: "menu-pages",
        children: [
          { index: true, element: <MenuPagesPage /> },
          { path: "create", element: <CreateMenuPage /> },
          { path: "update/:id", element: <UpdateMenuPage /> },
          { path: "view/:id", element: <MenuPageDetailPage /> },
          { path: "view/:id/images/create", element: <CreatePageImagePage /> },
          {
            path: "view/:id/images/update/:itemId",
            element: <UpdatePageImagePage />,
          },
          { path: "view/:id/files/create", element: <CreatePageFilePage /> },
          {
            path: "view/:id/files/update/:itemId",
            element: <UpdatePageFilePage />,
          },
        ],
      },
      {
        path: "employees",
        children: [
          { index: true, element: <EmployeesPage /> },
          { path: "create", element: <CreateEmployeesPage /> },
          { path: "update/:id", element: <UpdateEmployeesPage /> },
          { path: "view/:id", element: <MenuPageDetailPage /> },
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
