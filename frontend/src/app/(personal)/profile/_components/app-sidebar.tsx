"use client";

import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { Item, ItemMedia, ItemContent, ItemTitle } from "@/components/ui/item";
import { useProfileSidebar } from "../../../../providers/ProfileSidebarProvider";
import { cn } from "@/lib/utils";
import { PersonStanding } from "lucide-react";
import { IconLogout, IconSettings } from "@tabler/icons-react";
import { AlertOverlay } from "@/components/ui/alert-dialouge";
import { TabsTrigger } from "@/components/ui/tabscn";
import TripsAccordion from "./trips_acordion";

export function ProfileSidebar({ className }: { className?: string }) {
  const { navMain, user } = useProfileSidebar();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "w-[280px] rounded-xl bg-white p-4 shadow-sm flex flex-col hidden md:block",
        className,
      )}
    >
      <div className="flex items-center gap-3 px-2 py-3">
        <Image
          src={user.avatar}
          alt={user.name}
          width={40}
          height={40}
          className="rounded-full object-cover"
        />
        <div>
          <p className="text-sm font-medium">{user.name}</p>
          <p className="text-xs text-muted-foreground">Customer Operations</p>
        </div>
      </div>

      <div className="my-3 h-px bg-border" />

      <nav className="flex flex-col gap-3">
        {navMain.map((item) => {
          if (item.value === "settings") return null;
          // const isTripsOpen =
          const Icon = item.icon;
          if (item.value === "trips") {
            return (
              
                <div className="flex py-1.5 justify-start cursor-pointer  text-bold px-2 items-start">
                  {Icon && <Icon className="h-5 w-5 bg-transparent mt-2" />}
                  <div>{item.content}</div>
                </div>
            );
          }
          return (
            <TabsTrigger
              className="py-1.5 flex justify-start"
              key={item.name}
              value={item.value}
            >
              {Icon && <Icon className="h-5 w-5 bg-transparent" />}
              <div className="text-sm">{item.content}</div>
            </TabsTrigger>
          );
        })}
        <div className=" h-px bg-border" />
        <TabsTrigger className="py-1.5 flex justify-start" value={"settings"}>
          <IconSettings className="h-5 w-5 bg-transparent" />
          <div className="text-sm">
            <p>Settings</p>
          </div>
        </TabsTrigger>
      </nav>

      <div className="mt-auto pt-4">
        <div className="cursor-pointer rounded-lg px-3 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2">
          <span className=" text-red-600">
            <IconLogout />
          </span>
          <Logout />
        </div>
      </div>
    </aside>
  );
}

const Logout = () => {
  const handelLogout = () => {
    console.log("logout");
  };
  return (
    <AlertOverlay
      trigger="Log out"
      variant="ghost"
      handelSumbit={handelLogout}
      title="Logout"
      description="Are you sure to log-out"
      continueTitle="log-out"
      canecelTitle="cancel"
    />
  );
};
