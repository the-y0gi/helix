"use client";
import React, { Suspense } from "react";
import { Footer } from "../footer/FFooter";
import { cn } from "@/lib/utils";
// import { MenuBar } from "../menubar";
import { Headset } from "lucide-react";
import dynamic from "next/dynamic";
import LOGO from "./logo";
const MenuBar = dynamic(() => import("../menubar").then(mod => ({ default: mod.MenuBar })), {
  ssr: false,
});
type Props = {};

const PersonalNavWroper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col w-full">
      <div
        className={cn(
          "fixed top-0 left-0 z-50 w-full bg-card   flex flex-col justify-center h-30 bg-gradient-to-br from-zinc-200 to-transparent backdrop-blur-md dark:bg-gradient-to-br dark:from-zinc-700 dark:to-transparent backdrop-blur-lg border-b border-gray-300 dark:border-gray-700",
        )}
      >
        <div className="flex items-center justify-between py-3 px-9">
          <LOGO />

          <div className="hidden md:flex flex-col items-center gap-[5px] h-full justify-evenly">
          </div>

          <div className="flex gap-9 p-1 justify-center items-center">
            <div>
              <Headset color="blue" size={25} />
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
