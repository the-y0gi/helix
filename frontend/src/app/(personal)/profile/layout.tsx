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
import { useRouter } from "next/navigation";
import { LoaderOne } from "@/components/ui/acer-loader";

export default function layout({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("accessToken");
  const navigate = useRouter();
  useEffect(() => {
    if (!token) {
      navigate.push("/");
    }
  }, [token]);
  if(!token){
    return (
      <div className="w-full flex items-center justify-center">
      <p>Unauthorise</p>
      <LoaderOne />
    </div>
    )
  }
  return (
    <ErrorBoundary fallback={<p>unauthenticated</p>}>
      <ProfileSidebarProvider
        className={cn("flex flex-col md:flex-row gap-4 justify-center")}
      >
        <TabsList className="grid h-auto w-fit shrink-0 grid-cols-1 gap-3 bg-transparent pt-0">
          <ProfileSidebar className="rounded-2xl gap-3" />
        </TabsList>
        {children}
      </ProfileSidebarProvider>
    </ErrorBoundary>
  );
}
