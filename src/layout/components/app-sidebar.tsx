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
  RiDashboardLine,
  RiMedalLine,
  RiNewspaperLine,
  RiProfileLine
} from "@remixicon/react";
import { IconHelp, IconSettings } from "@tabler/icons-react";
import * as React from "react";
import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";

// O‘qituvchilar uchun menyu ma'lumotlari
const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard/home",
      icon: RiDashboardLine,
    },
    {
      title: "News & Announcements",
      url: "/dashboard/news-and-announcements",
      icon: RiNewspaperLine,
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
    {
      title: "Profile",
      url: "/dashboard/profile",
      icon: RiProfileLine,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/dashboard/profile",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
