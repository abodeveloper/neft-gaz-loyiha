import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem
} from "@/components/ui/sidebar";
import {
  RiCarouselView,
  RiDashboardLine,
  RiFileList3Line,
  RiFlaskLine,
  RiGraduationCapLine,
  RiMenu2Line,
  RiNewspaperLine,
  RiOrganizationChart,
  RiPagesLine,
  RiTeamLine,
  RiUserCommunityLine
} from "@remixicon/react";
import { IconHelp } from "@tabler/icons-react";
import { Atom, Building2 } from "lucide-react";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";

import Logo from "@/assets/logo.png";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { t } = useTranslation();

  const data = {
    navMain: [
      {
        title: t("Dashboard"),
        url: "/dashboard/home",
        icon: RiDashboardLine,
      },
      {
        title: t("Company"),
        url: "/dashboard/company",
        icon: RiOrganizationChart,
      },
      {
        title: t("Menu"),
        url: "/dashboard/menus",
        icon: RiMenu2Line,
      },
      {
        title: t("Pages"),
        url: "/dashboard/menu-pages",
        icon: RiPagesLine,
      },
      {
        title: t("Employees"),
        url: "/dashboard/employees",
        icon: RiUserCommunityLine,
      },
      {
        title: t("News & Announcements"),
        url: "/dashboard/news-and-announcements",
        icon: RiNewspaperLine,
      },
      {
        title: t("Carousels"),
        url: "/dashboard/carousels",
        icon: RiCarouselView,
      },
      {
        title: t("Partners"),
        url: "/dashboard/partners",
        icon: RiTeamLine,
      },
      {
        title: t("Laboratories"),
        url: "/dashboard/laboratories",
        icon: RiFlaskLine, // Laboratoriya uchun kolba
      },
      {
        title: t("Departments"),
        url: "/dashboard/departments",
        icon: Building2, // Bo'lim yoki bino ramzi
      },
      {
        title: t("Scientific Directions"),
        url: "/dashboard/scientific-directions",
        icon: Atom, // Ilm-fan va atom ramzi
      },
      {
        title: t("Postgraduate Educations"),
        url: "/dashboard/postgraduate-educations",
        icon: RiGraduationCapLine, // Oliy ta'lim/bitiruvchilar ramzi
      },
      {
        title: t("Applications"),
        url: "/dashboard/applications",
        icon: RiFileList3Line, // Arizalar ro'yxati
      },
      // {
      //   title: "Biz haqimizda",
      //   url: "#",
      //   icon: RiBookLine,
      //   isActive: false,
      //   items: [
      //     { title: "Universitet haqida", url: "/teacher/tests/mock" },
      //     { title: "Rahbariyat", url: "/teacher/tests/thematic" },
      //     { title: "Tashkiliy tuzilma", url: "/teacher/tests/thematic" },
      //     { title: "Ilmiy kengash", url: "/teacher/tests/thematic" },
      //     { title: "Yutuqlar", url: "/teacher/tests/thematic" },
      //   ],
      // },
      // {
      //   title: "Groups",
      //   url: "/teacher/groups",
      //   icon: RiUserCommunityLine,
      // },
      // {
      //   title: t("Profile"),
      //   url: "/dashboard/profile",
      //   icon: RiProfileLine,
      // },
    ],
    navSecondary: [
      // {
      //   title: t("Settings"),
      //   url: "/dashboard/profile",
      //   icon: IconSettings,
      // },
      {
        title: t("Get Help"),
        url: "#",
        icon: IconHelp,
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader
        className={
          "flex flex-row items-center justify-between gap-3 border-b h-16"
        }
      >
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="px-1 flex items-center gap-2">
              <img src={Logo} alt="" width={50} />
              <span className="text-base font-semibold">NGGI</span>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
