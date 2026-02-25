'use client'
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import Search_bar_filter from "../navbar/filter-nav-bar/search-bar-nav";
import type { Pages } from "@/constants/constants";
import { usePathname, useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";

export const TabsNav = ({
  shouldShowNavbar,
  mobile,
  tabs: propTabs,
  containerClassName,
  activeTabClassName,
  tabClassName,
}: {
  shouldShowNavbar?: boolean;
  mobile: boolean;
  tabs: Pages[];
  containerClassName?: string;
  activeTabClassName?: string;
  tabClassName?: string;
}) => {
  const navigate = useRouter();
  const location = usePathname();

  const active =
    propTabs.find((tab) => location.endsWith(tab.link)) || propTabs[0];
const ismobile = useIsMobile(); 
  if(ismobile){
    return (
       < div className="flex flex-col-reverse ">
      <div
        className={cn(
          "flex  items-center gap-2 relative overflow-x-auto no-scrollbar ",
          "bg-white dark:bg-background md:dark:bg-zinc-900",
          "rounded-full px-1 py-1",
          "md:shadow-[0_8px_30px_rgba(0,0,0,0.12)]",
          "border border-black/5 dark:border-white/10",
         
          containerClassName
        )}
      >
        {propTabs.map((tab, i) => {
          return (
            <div
            className={cn(
              "md:flex gap-1 items-center w-full ",
              mobile ? "flex-col" : "md:flex md:items-center"
            )}
            key={i}
          >
            {/* <div
              className={cn(
                "h-px w-full bg-border",
                mobile ? "w-full" : "md:h-4 md:w-px",
                `${i === 0 && "hidden"}`
              )}
            /> */}
            <button
              key={tab.title}
              onClick={() => navigate.push(tab.link)}
              className={cn(
                " relative px-2 py-2 rounded-full w-full text-left",
                "text-sm font-medium",
                "transition-colors",
                mobile ? "w-full text-left" : "",
                tabClassName
              )}
            >
              {active.title === tab.title && (
                <motion.div
                  layoutId="clickedbutton"
                  transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                  className={cn(
                    "absolute inset-0 rounded-full",
                    "bg-pink-100 dark:bg-zinc-800",
                    "shadow-[0_4px_14px_rgba(0,0,0,0.15)]",
                    activeTabClassName
                  )}
                />
              )}

              <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
                {tab.title}
              </span>
            </button>
          </div>
          )
        })}
      </div>
      <Search_bar_filter filter_bar={active} mobile={mobile} />
    </div>
    )
  }

  return (
    < >
      <div
        className={cn(
          "flex  items-center gap-2 relative overflow-x-auto no-scrollbar ",
          "bg-white dark:bg-transparent md:dark:bg-zinc-900",
          "md:rounded-full px-1 py-1",
          "md:shadow-[0_8px_30px_rgba(0,0,0,0.12)]",
          "border border-black/5 dark:border-white/10",
         
          containerClassName
        )}
      >
        {propTabs.map((tab, i) => {
          return (
            <div
            className={cn(
              "md:flex gap-3 items-center w-full gap-2",
              mobile ? "flex-col" : "md:flex md:items-center"
            )}
            key={i}
          >
            <div
              className={cn(
                "h-px w-full bg-border",
                mobile ? "w-full" : "md:h-4 md:w-px",
                `${i === 0 && "hidden"}`
              )}
            />
            <button
              key={tab.title}
              onClick={() => navigate.push(tab.link)}
              className={cn(
                " relative px-5 py-2 rounded-full w-full text-left",
                "text-sm font-medium",
                "transition-colors",
                mobile ? "w-full text-left" : "",
                tabClassName
              )}
            >
              {active.title === tab.title && (
                <motion.div
                  layoutId="clickedbutton"
                  transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                  className={cn(
                    "absolute inset-0 rounded-full",
                    "bg-pink-100 dark:bg-zinc-800",
                    "shadow-[0_4px_14px_rgba(0,0,0,0.15)]",
                    activeTabClassName
                  )}
                />
              )}

              <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
                {tab.title}
              </span>
            </button>
          </div>
          )
        })}
      </div>
      <Search_bar_filter filter_bar={active} mobile={mobile} />
    </>
  );
};
