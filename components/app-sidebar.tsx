"use client";

import * as React from "react";

// import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
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
  House,
  RotateCcwClock,
  FolderBookmark,
  Star,
  UserRoundPen,
  CameraIcon,
  FileTextIcon,
  Settings2Icon,
  CircleHelpIcon,
  SearchIcon,
  DatabaseIcon,
  FileChartColumnIcon,
  FileIcon,
  SquareLibrary,
  // RotateCcwClock
} from "lucide-react";

// My Import
// import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

const data = {
  user: {
    id: "001",
    email: "guest@example.com",
    pen_name: "Guest",
    photo: "/globe.svg",
    bio: "Guest Account, Limited Access.",
    createdAt: "",
    updatedAt: "",
  },
  navMain: [
    {
      title: "Home",
      url: "/home",
      icon: <House />,
    },
    {
      title: "History",
      url: "/history",
      icon: <RotateCcwClock />,
    },
    {
      title: "Bookmarked",
      url: "/bookmarked",
      icon: <FolderBookmark />,
    },
    {
      title: "Scored",
      url: "/scored",
      icon: <Star />,
    },
    {
      title: "Published",
      url: "/published",
      icon: <UserRoundPen />,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: <CameraIcon />,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: <FileTextIcon />,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: <FileTextIcon />,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: <Settings2Icon />,
    },
    {
      title: "Get Help",
      url: "#",
      icon: <CircleHelpIcon />,
    },
    {
      title: "Search",
      url: "#",
      icon: <SearchIcon />,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: <DatabaseIcon />,
    },
    {
      name: "Reports",
      url: "#",
      icon: <FileChartColumnIcon />,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: <FileIcon />,
    },
  ],
};
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // My Const
  // const { user, isLoading, signout } = useAuth();

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href={"/home"}>
              <SidebarMenuButton
                className="data-[slot=sidebar-menu-button]:p-1.5!"
              >
                <SquareLibrary className="size-5!" />
                <span className="text-base font-semibold">
                  Reading Platform
                </span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavDocuments items={data.documents} /> */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
