import NavWrapper from "@/components/navbar/nav.wraper";
import { cn } from "@/lib/utils";
import { CommonPagesStyles } from "@/styles/commonpages-styles";
import React from "react";

type Props = {};

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
   
        <NavWrapper>
            <div className={cn(CommonPagesStyles, " md:flex-col  flex gap-4 ")}>
              {children}
            </div>
          </NavWrapper>
   
  );
};

export default layout;
