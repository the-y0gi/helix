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
export default function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useRouter();

  // Use a state for token to avoid hydration mismatch
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    setToken(storedToken);
    setLoading(false);
    if (!storedToken) {
      navigate.push("/");
    }
  }, [navigate]);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <LoaderOne />
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
      <Suspense fallback={<LoaderOne />}>
        <ProfileSidebarProvider
          className={cn("flex flex-col md:flex-row gap-4 justify-center")}
        >
          <TabsList className="grid h-auto w-fit shrink-0 grid-cols-1 gap-3 bg-transparent pt-0">
            <ProfileSidebar className="rounded-2xl gap-3" />
          </TabsList>
          {children}
        </ProfileSidebarProvider>
      </Suspense>
    </ErrorBoundary>
  );
}
