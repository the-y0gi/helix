"use client";

import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { useProfileSidebar } from "../../../../providers/ProfileSidebarProvider";
import { cn } from "@/lib/utils";
import { IconLogout, IconSettings } from "@tabler/icons-react";
import { AlertOverlay } from "@/components/ui/alert-dialouge";
import { TabsTrigger } from "@/components/ui/tabscn";
import TripsAccordion from "./trips_acordion";
import { useLogout } from "@/services/dailyfunctions";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "@/services/hotel/querys";
import { useAuthStore } from "@/store/auth.store";

export function ProfileSidebar({ className }: { className?: string }) {
  const { navMain, user } = useProfileSidebar();
  const { data: currUser, refetch} = useCurrentUser();
  const router = useRouter();

  return (
    <aside
      className={cn(
        "md:w-[280px] w-full rounded-xl bg-background p-4 shadow-sm flex flex-col md:block border border-border",
        className,
      )}
    >
      <div className="flex items-center gap-3 px-2 py-3 hidden md:block">
        <Image
          src={ currUser?.data?.avatar || user.avatar}
          alt={currUser?.data?.name || user.name}
          width={40}
          height={40}
          className="rounded-full object-cover"
        />
        <div>
          <p className="text-sm font-medium">{currUser?.data?.firstName}</p>
          <p className="text-xs text-muted-foreground">Customer Operations</p>
        </div>
      </div>

      <div className="my-3 h-px bg-border hidden md:block" />

      <nav className="md:flex-col flex flex-wrap md:gap-2 ">
        {navMain.map((item) => {
          if (item.value === "settings") return null;
          const Icon = item.icon;
          if (item.value === "trips") {
            return (
              <div key={item.value} className="flex py-2 px-3 cursor-pointer items-center rounded-lg hover:bg-muted/50 transition-colors">
                {Icon && <Icon className="h-5 w-5 mr-3 text-muted-foreground" />}
                <span className="text-sm font-medium">{item.content}</span>
              </div>
            );
          }
          return (
            <TabsTrigger
              className="py-2 md:px-3 justify-start rounded-lg hover:bg-muted/50 transition-colors data-[state=active]:bg-muted data-[state=active]:font-medium"
              key={item.name}
              value={item.value}
            >
              {Icon && <Icon className="h-5 w-5 mr-3 text-muted-foreground" />}
              <span className="text-sm">{item.content}</span>
            </TabsTrigger>
          );
        })}
        <div className="my-2 h-px bg-border" />
        <TabsTrigger className="py-2 px-3 justify-start rounded-lg hover:bg-muted/50 transition-colors data-[state=active]:bg-muted data-[state=active]:font-medium" value="settings">
          <IconSettings className="h-5 w-5 mr-3 text-muted-foreground" />
          <span className="text-sm">Settings</span>
        </TabsTrigger>
      </nav>

      <div className="mt-auto md:pt-4">
        <div className="cursor-pointer rounded-lg px-3 md:py-2 py-1 flex items-center gap-3 transition-colors">
          <IconLogout className="h-5 w-5" />
          <Logout refetch={refetch} />
        </div>
      </div>
    </aside>
  );
}

export const Logout = ({refetch}: {refetch: () => void}) => {
  const queryClient = useQueryClient();
  const currentUser = useAuthStore();

  const navigate = useRouter();
  const handleLogout = () => {

    localStorage.removeItem("accessToken");
    localStorage.removeItem("nextRoute");

    queryClient.removeQueries({ queryKey: ["current_user"] });
    refetch();
    window.location.reload();
    // navigate.push("/");
  };
  return (
    <AlertOverlay
      trigger="Log out"
      variant="ghost"
      handelSumbit={handleLogout}
      title="Logout"
      description="Are you sure to log-out"
      continueTitle="log-out"
      canecelTitle="cancel"
    />
  );
};
