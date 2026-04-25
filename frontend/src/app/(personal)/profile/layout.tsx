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
import React, { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { LoaderOne } from "@/components/ui/acer-loader";
import { PageSkeleton } from "@/components/loader/skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { RouterPush } from "@/components/RouterPush";
import { useCurrentUser } from "@/services/hotel/querys";
export default function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useRouter();

  // Use a state for token to avoid hydration mismatch
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { data, isLoading } = useCurrentUser()

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    setToken(storedToken);
    setLoading(false);
    if (!storedToken) {
      RouterPush(navigate, '/');
    }
  }, [navigate]);

  if (loading || !data || isLoading) {
    return (
      <div className="w-full min-h-screen pt-6">
        <ProfileLayoutSkeleton />
      </div>
    );
  }

  if (!token) {
    return (
      <div className="w-full flex items-center justify-center">
        <p>Unauthorise</p>
        <LoaderOne />
      </div>
    );
  }

  return (
    <ErrorBoundary fallback={<p>unauthenticated</p>}>
      <Suspense fallback={<div className="w-full min-h-screen pt-6">
        <ProfileLayoutSkeleton />
      </div>}>
        <ProfileSidebarProvider
          className={cn("flex flex-col md:flex-row gap-4 md:justify-center ")}
        >
          <TabsList className="grid h-auto w-fit shrink-0 grid-cols-1 gap-3 bg-transparent pt-0 ">
            <ProfileSidebar className="rounded-2xl gap-3 border-none " />
          </TabsList>
          {children}
        </ProfileSidebarProvider>
      </Suspense>
    </ErrorBoundary>

  );
}

export function ProfileLayoutSkeleton() {
  return (
    <div className={cn("flex flex-col md:flex-row gap-4 md:justify-center")}>
      <div className="flex w-full flex-col md:flex-row items-start justify-between gap-4 px-2 md:px-0">
        
        {/* Sidebar Skeleton */}
        <div className="grid h-auto w-fit shrink-0 grid-cols-1 gap-3 bg-transparent pt-0">
          <aside className="md:w-[280px] w-full rounded-2xl gap-3 border-none bg-background p-4 shadow-none md:shadow-sm flex flex-col md:block">
            {/* User Profile Block (Hidden on Mobile) */}
          <div className="hidden md:flex items-center gap-3 px-2 py-3">
            <Skeleton className="h-10 w-10 rounded-full shrink-0" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>

          <div className="hidden md:block my-3 h-px bg-border" />

          {/* Navigation Links Skeleton */}
          <nav className="md:flex-col flex overflow-x-auto md:gap-2 -mx-4 md:mx-0 px-5 md:px-0 gap-3 pb-2 md:pb-0 scrollbar-hide">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-center py-2.5 px-5 h-11 md:h-10 md:w-full min-w-max rounded-full md:rounded-lg border md:border-transparent bg-muted/10 md:bg-transparent md:justify-start">
                <Skeleton className="h-5 w-5 mr-2 md:mr-3 rounded-full shrink-0 md:rounded-md" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
            <div className="hidden md:block my-2 h-px bg-border" />
            <div className="hidden md:flex items-center justify-start py-2.5 px-5 h-10 w-full rounded-lg">
              <Skeleton className="h-5 w-5 mr-3 rounded-md shrink-0" />
              <Skeleton className="h-4 w-20" />
            </div>
          </nav>
        </aside>
      </div>

      {/* Main Content Area Skeleton */}
      <div className="flex-1 w-full flex flex-col gap-4">
        
        {/* Generic Top Header Card Skeleton */}
        <div className="rounded-xl shadow-sm border border-border flex flex-col gap-3 p-6 w-full bg-background">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>

        {/* Generic Main Content Card Skeleton */}
        <div className="rounded-xl shadow-sm p-6 border border-border bg-background w-full space-y-6">
           <Skeleton className="h-40 w-full rounded-lg" />
           <div className="space-y-3">
             <Skeleton className="h-4 w-full" />
             <Skeleton className="h-4 w-full" />
             <Skeleton className="h-4 w-5/6" />
             <Skeleton className="h-4 w-4/6" />
           </div>
        </div>
      </div>
      </div>
    </div>
  );
}
