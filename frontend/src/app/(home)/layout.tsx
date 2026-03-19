'use client'
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CommonPagesStyles } from "@/styles/commonpages-styles";
import { IconArrowRampRight } from "@tabler/icons-react";
import dynamic from "next/dynamic";
import React from "react";
const NavWrapper = dynamic(() => import("@/components/navbar/nav.wraper"), {
  ssr: false,
});

type Props = {};

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
   
        <NavWrapper>
          
            <div className={cn(CommonPagesStyles, " md:flex-col  flex gap-4 w-full bg-background py-4 ")}>
              {children}
            </div>
          </NavWrapper>
   
  );
};

export default layout;
