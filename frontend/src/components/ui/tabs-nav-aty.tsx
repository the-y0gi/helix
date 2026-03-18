"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Pages } from "@/constants/constants";
import { usePathname, useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import Image from "next/image";

export const TabsNav = ({
  tabs: propTabs,
  containerClassName,
  activeTabClassName,
  tabClassName,
}: {
  mobile: boolean;
  tabs: Pages[];
  containerClassName?: string;
  activeTabClassName?: string;
  tabClassName?: string;
}) => {
  const navigate = useRouter();
  const location = usePathname();
  const ismobile = useIsMobile();

  const [isVisible, setIsVisible] = useState(true);
  const imgsize = ismobile ? 28 : 38;
  const active = propTabs.find((tab) => location.endsWith(tab.link)) || propTabs[0];

  return (
    <motion.div 
      initial={false}
      animate={{ y: isVisible ? 0 : -100 }}
      // flex justify-center ensures the stretched bar stays centered over the 910px card
      className="sticky top-0 z-10 w-full flex justify-center py-2 px-4"
    >
      <div
        className={cn(
          // STRETCH: Increased max-width by 100px (from 910px to 1010px)
          "flex items-center w-full max-w-[1010px] mx-auto",
          "bg-white dark:bg-zinc-900 rounded-[14px] p-1.5",
          "border border-black/5 dark:border-white/10 shadow-sm",
          containerClassName
        )}
      >
        {propTabs.map((tab, index) => (
          <div key={tab.title} className="flex flex-1 items-center">
            <button
              onClick={() => navigate.push(tab.link)}
              className={cn(
                // STRETCH: Increased horizontal padding (px-14) to fill the extra width
                "relative flex-1 flex items-center justify-center md:px-14 px-5 py-2 rounded-[14px]",
                "md:text-lg text-sm font-medium transition-colors whitespace-nowrap",
                "hover:bg-pink-100 dark:hover:bg-zinc-800 border-none",
                tabClassName
              )}
            >
              {active.title === tab.title && (
                <motion.div
                  layoutId="active-nav-tab"
                  transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                  className={cn(
                    "absolute inset-0 rounded-full bg-pink-100 dark:bg-zinc-800",
                    activeTabClassName
                  )}
                />
              )}

              <span className="relative z-20 flex gap-3 items-center">
                {tab.iconUrl && (
                  <div className="flex-shrink-0 -ml-2">
                    <Image
                      className="rounded-full object-cover"
                      src={tab.iconUrl}
                      alt={tab.title}
                      width={imgsize}
                      height={imgsize}
                      priority
                    />
                  </div>
                )}
                {!ismobile && <span className="hidden sm:block text-sm">{tab.title}</span>}
              </span>
            </button>

            {index < propTabs.length - 1 && !ismobile && (
              <div className="h-6 w-px bg-black/10 dark:bg-white/10 mx-1 opacity-50" />
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};
























{
  /* <div className="w-full flex justify-center overflow-visible">
        <AnimatePresence mode="wait">
          {isVisible && (
            <motion.div
              key="filter-wrapper"
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-full max-w-5xl"
            >
              <Search_bar_filter filter_bar={active} mobile={ismobile} />
            </motion.div>
          )}
        </AnimatePresence>
      </div> */
}
