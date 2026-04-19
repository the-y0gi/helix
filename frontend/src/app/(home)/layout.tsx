'use client'
import { cn } from "@/lib/utils";
import { CommonPagesStyles } from "@/styles/commonpages-styles";
import dynamic from "next/dynamic";
import React from "react";
const NavWrapper = dynamic(() => import("@/components/navbar/nav.wraper"), {
  ssr: false,
});



const layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (

    <NavWrapper>

      <div className={cn(CommonPagesStyles, " md:flex-col  flex gap-4 w-full bg-background py-4 ")}>
        {children}
      </div>
    </NavWrapper>

  );
};

export default layout;
