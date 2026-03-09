'use client'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { cn } from "@/lib/utils";
import Search_bar_filter from "../navbar/filter-nav-bar/search-bar-nav";
import type { Pages } from "@/constants/constants";
import { usePathname, useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";

export const TabsNav = ({
  tabs: propTabs,
  containerClassName,
  activeTabClassName,
  tabClassName,
  mobile,
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

  // State to control visibility
  const [isVisible, setIsVisible] = useState(true);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;

    if (ismobile) {
      if (latest < 50) setIsVisible(true);
      else if (latest > previous) setIsVisible(false); // scrolling down → hide
      else setIsVisible(true); // scrolling up → show
    } else {
      if (latest < 50) setIsVisible(true);
      else if (latest > previous) setIsVisible(false);
      else setIsVisible(true);
    }
  });

  const active = propTabs.find((tab) => location.endsWith(tab.link)) || propTabs[0];

  return (
    <div className="sticky top-0 z-50 w-full flex flex-col items-center bg-transparent pb-2 ">
      {/* SEARCH FILTER SECTION */}
      <div className="w-full flex justify-center overflow-visible">
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
      </div>

      {/* TABS BAR - centered + safe side padding on mobile */}
      <div
        className={cn(
          "flex items-center justify-center gap-1.5 mt-2 ", // centered + tighter gap
          "bg-white dark:bg-zinc-900 rounded-full px-3 py-1.5", // reduced side padding
          "max-w-[min(95vw,420px)] mx-auto", // ← key fix: prevents touching screen edges
          "border border-black/5 dark:border-white/10 shadow-sm",
          containerClassName
        )}
      >
        {propTabs.map((tab) => (
          <button
            key={tab.title}
            onClick={() => navigate.push(tab.link)}
            className={cn(
              "relative px-3.5 py-1.5 rounded-full",
              "text-xs sm:text-sm font-medium transition-colors whitespace-nowrap",
              "flex-shrink-0 min-w-0", // allow slight compression if needed
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
            <span className="relative z-20">{tab.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
};