"use client";

import { ProfileSidebar } from "./_components/app-sidebar";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "./_components/site-header";
import { cn } from "@/lib/utils";
import { CommonPagesStyles } from "@/styles/commonpages-styles";
import { ProfileSidebarProvider } from "../../../providers/ProfileSidebarProvider";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabscn";
import { ErrorBoundary } from "react-error-boundary";
import { useEffect } from "react";
import { useCurrentUser } from "@/services/querys";
import { useRouter } from "next/navigation";



export default function layout({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading: loading, refetch } = useCurrentUser();
  const token = localStorage.getItem("accessToken");
  const navigate = useRouter();
  useEffect(() => {
    if (!token) {
      navigate.push("/");
    }
  }, [token]);
  return (
    <ErrorBoundary fallback={<p>unauthenticated</p>}>
      <ProfileSidebarProvider className={cn(" flex gap-4  ")}>
        <TabsList className="grid h-auto w-fit shrink-0 grid-cols-1 gap-3 bg-transparent pt-0">
          <ProfileSidebar className=" rounded-2xl gap-3" />
        </TabsList>
        {children}
      </ProfileSidebarProvider>
    </ErrorBoundary>
  );
}
