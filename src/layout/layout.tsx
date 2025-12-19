import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { AppSidebar } from "@/layout/components/app-sidebar";
import { SiteHeader } from "@/layout/components/site-header";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      {/* O'ZGARISH 1: SidebarInsetga balandlik va flex beramiz, overflow-hidden ota konteynerga qo'yiladi */}
      <SidebarInset className="flex flex-col h-screen overflow-hidden">
        {/* Header endi oqim bo'yicha eng tepada turadi, unga sticky shart emas (lekin qolsa ham zarari yo'q) */}
        <SiteHeader />

        {/* O'ZGARISH 2: Asosiy kontent skroll bo'lishi uchun flex-1 va overflow-y-auto beramiz */}
        <div className="flex-1 overflow-y-auto p-4 pb-[40px]">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
