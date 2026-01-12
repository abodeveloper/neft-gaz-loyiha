import { lazy } from "react";
import { Navigate } from "react-router-dom";
import AdminProtectedRoute from "./AdminProtectedRoute";

// Foydalanuvchi sahifalari
const LoginPage = lazy(() => import("@/features/auth/pages/LoginPage"));
const Layout = lazy(() => import("@/layout/layout"));

const DashboardPage = lazy(() => import("@/features/dashboard/DashboardPage"));
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


const LaboratoriesPage = lazy(() => import("@/features/laboratories/LaboratoriesPage"));
const CreateLaboratoryPage = lazy(() => import("@/features/laboratories/CreateLaboratoryPage"));
const UpdateLaboratoryPage = lazy(
  () => import("@/features/laboratories/UpdateLaboratoryPage")
);

const DepartmentsPage = lazy(
  () => import("@/features/departments/DepartmentsPage")
);
const CreateDepartmentPage = lazy(
  () => import("@/features/departments/CreateDepartmentPage")
);
const UpdateDepartmentPage = lazy(
  () => import("@/features/departments/UpdateDepartmentPage")
);

const ScientificDirectionsPage = lazy(
  () => import("@/features/scientific-directions/ScientificDirectionsPage")
);
const CreateScientificDirectionPage = lazy(
  () => import("@/features/scientific-directions/CreateScientificDirectionPage")
);
const UpdateScientificDirectionPage = lazy(
  () => import("@/features/scientific-directions/UpdateScientificDirectionPage")
);


const PostgraduateEducationsPage = lazy(
  () => import("@/features/postgraduate-educations/PostgraduateEducationsPage")
);
const CreatePostgraduateEducationPage = lazy(
  () =>
    import("@/features/postgraduate-educations/CreatePostgraduateEducationPage")
);
const UpdatePostgraduateEducationPage = lazy(
  () =>
    import("@/features/postgraduate-educations/UpdatePostgraduateEducationPage")
);

const ApplicationsPage = lazy(
  () =>
    import("@/features/applications/ApplicationsPage")
);

const CompanyPage = lazy(
  () => import("@/features/company/CompanyPage")
);

const UpdateCompanyPage = lazy(
  () => import("@/features/company/UpdateCompanyPage")
);


const PartnersPage = lazy(
  () => import("@/features/partners/PartnersPage")
);
const CreatePartnerPage = lazy(
  () =>
    import("@/features/partners/CreatePartnerPage")
);
const UpdatePartnerPage = lazy(
  () =>
    import("@/features/partners/UpdatePartnerPage")
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
      { path: "home", element: <DashboardPage /> },
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
        path: "partners",
        children: [
          { index: true, element: <PartnersPage /> },
          { path: "create", element: <CreatePartnerPage /> },
          { path: "update/:id", element: <UpdatePartnerPage /> },
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
      {
        path: "laboratories",
        children: [
          { index: true, element: <LaboratoriesPage /> },
          { path: "create", element: <CreateLaboratoryPage /> },
          { path: "update/:id", element: <UpdateLaboratoryPage /> },
        ],
      },
      {
        path: "departments",
        children: [
          { index: true, element: <DepartmentsPage /> },
          { path: "create", element: <CreateDepartmentPage /> },
          { path: "update/:id", element: <UpdateDepartmentPage /> },
        ],
      },
      {
        path: "scientific-directions",
        children: [
          { index: true, element: <ScientificDirectionsPage /> },
          { path: "create", element: <CreateScientificDirectionPage /> },
          { path: "update/:id", element: <UpdateScientificDirectionPage /> },
        ],
      },
      {
        path: "postgraduate-educations",
        children: [
          { index: true, element: <PostgraduateEducationsPage /> },
          { path: "create", element: <CreatePostgraduateEducationPage /> },
          { path: "update/:id", element: <UpdatePostgraduateEducationPage /> },
        ],
      },
      { path: "applications", element: <ApplicationsPage /> },
      {
        path: "company",
        children: [
          { index: true, element: <CompanyPage /> },
          { path: "update", element: <UpdateCompanyPage /> },
        ],
      },
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
