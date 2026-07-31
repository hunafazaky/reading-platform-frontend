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
  HouseIcon,
  ClockCounterClockwiseIcon,
  BookmarksIcon,
  StarFourIcon,
  FolderUserIcon,
  CameraIcon,
  FileTextIcon,
  GearIcon,
  InfoIcon,
  MagnifyingGlassIcon,
  DatabaseIcon,
  PresentationChartIcon,
  FileIcon,
  BooksIcon,
  // ClockCounterClockwiseIcon
} from "@phosphor-icons/react";

// My Import
import { useAuth } from "@/context/AuthContext";
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
      icon: <HouseIcon />,
    },
    {
      title: "History",
      url: "/history",
      icon: <ClockCounterClockwiseIcon />,
    },
    {
      title: "Bookmarked",
      url: "/bookmarked",
      icon: <BookmarksIcon />,
    },
    {
      title: "Scored",
      url: "/scored",
      icon: <StarFourIcon />,
    },
    {
      title: "Published",
      url: "/published",
      icon: <FolderUserIcon />,
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
      icon: <GearIcon />,
    },
    {
      title: "Get Help",
      url: "#",
      icon: <InfoIcon />,
    },
    {
      title: "Search",
      url: "#",
      icon: <MagnifyingGlassIcon />,
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
      icon: <PresentationChartIcon />,
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
  const { user } = useAuth();

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href={"/home"}>
              <SidebarMenuButton className="data-[slot=sidebar-menu-button]:p-1.5!">
                <BooksIcon className="size-5!" color="#00598a" weight="fill" />
                <span className="text-base font-semibold">
                  Reading Platform
                </span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {user && (
          <>
            <NavMain items={data.navMain} />
            {/* <NavDocuments items={data.documents} /> */}
            <NavSecondary items={data.navSecondary} className="mt-auto" />
          </>
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
