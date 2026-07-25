"use client";

import * as React from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarMenuButton,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { BooksIcon } from "@phosphor-icons/react";
import { History, ListStart, Bookmark } from "lucide-react";

const brand = {
  name: "Reading Platform",
  logo: <BooksIcon />,
  plan: "Social and Entertainment",
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useAuthStore((state) => state.user);

  const userData = {
    pen_name: user?.pen_name || "Guest",
    email: user?.email || "u@example.com",
    photo: user?.photo || "/dragon-book.avif",
  };

  const navItems = [
    {
      title: "Timeline",
      url: "/timeline",
      icon: ListStart,
    },
    {
      title: "Bookmarks",
      url: "/bookmarks",
      icon: Bookmark,
    },
    {
      title: "History",
      url: "/history",
      icon: History,
    },
  ];

  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Link href="/" className="flex">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground mr-2">
              {brand.logo}
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{brand.name}</span>
              <span className="truncate text-xs">{brand.plan}</span>
            </div>
          </Link>
        </SidebarMenuButton>
        <NavMain items={navItems} />
      </SidebarHeader>
      <SidebarContent />
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
