"use client";
import { usePathname } from "next/navigation";
import React, { Suspense } from "react";
import { Footer } from "../footer/FFooter";
import { cn } from "@/lib/utils";
// import { MenuBar } from "../menubar";
import { IconHeadphones } from "@tabler/icons-react";
import { Headset } from "lucide-react";
import dynamic from "next/dynamic";
const MenuBar = dynamic(() => import("../menubar").then(mod => ({ default: mod.MenuBar })), {
  ssr: false,
});
type Props = {};

const PersonalNavWroper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <div
        className={cn(
          "fixed top-0 left-0 z-50 w-full bg-card   flex flex-col justify-center h-30",
        )}
      >
        <div className="flex items-center justify-between py-3 px-9">
          <div className="h-12 w-[120px] p-2 rounded-full transition hover:scale-105">
            <img
              src="/logo.png"
              alt="Company logo"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="hidden md:flex flex-col items-center gap-[5px] h-full justify-evenly">
          </div>

          <div className="flex gap-9 p-1 justify-center items-center">
            <div>
              <Headset color="blue" size={25}/>
            </div>
            <Suspense>
            <MenuBar />
          </Suspense>
          </div>
        </div>
      </div>

      <main className={cn("flex-1 mt-34")}>{children}</main>
      <div className="w-full border-1 mt-10" />

      <Footer />
    </div>
  );
};

export default PersonalNavWroper;
