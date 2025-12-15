import {
  SidebarInset,
  SidebarProvider
} from "@/components/ui/sidebar";

import { AppSidebar } from "@/layout/components/app-sidebar";
import { SiteHeader } from "@/layout/components/site-header";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <div className="p-4 pb-[40px] min-h-screen">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
