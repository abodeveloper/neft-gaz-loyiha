import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  RiCarouselView,
  RiDashboardLine,
  RiMedalLine,
  RiMenu2Line,
  RiNewspaperLine,
} from "@remixicon/react";
import { IconHelp } from "@tabler/icons-react";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";

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
        title: t("Menu"),
        url: "/dashboard/menus",
        icon: RiMenu2Line,
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
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5 hover:bg-inherit active:bg-inherit"
            >
              <div>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                  <RiMedalLine className="!size-5" />
                </div>
                <span className="text-base font-semibold">NGGI</span>
              </div>
            </SidebarMenuButton>
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
