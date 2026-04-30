// "use client";

// import { motion, useScroll, useMotionValueEvent } from "framer-motion";
// import { cn } from "@/lib/utils";
// import type { Pages } from "@/constants/constants";
// import { usePathname, useRouter } from "next/navigation";
// import { useIsMobile } from "@/hooks/use-mobile";
// import { useState } from "react";
// import Image from "next/image";
// import { RouterPush } from "../RouterPush";

// export const TabsNav = ({
//   tabs: propTabs,
//   containerClassName,
//   activeTabClassName,
//   tabClassName,
// }: {
//   mobile: boolean;
//   tabs: Pages[];
//   containerClassName?: string;
//   activeTabClassName?: string;
//   tabClassName?: string;
// }) => {
//   const navigate = useRouter();
//   const location = usePathname();
//   const ismobile = useIsMobile();

//   const [isVisible, setIsVisible] = useState(true);
//   const imgsize = ismobile ? 28 : 38;
//   const active = propTabs.find((tab) => location.endsWith(tab.link)) || propTabs[0];

//   return (
//     <motion.div
//       initial={false}
//       animate={{ y: isVisible ? 0 : -100 }}
//       // flex justify-center ensures the stretched bar stays centered over the 910px card
//       className={cn("sticky top-0 z-10 w-full flex justify-center py-2 px-4 ", ismobile ? " z-50 " : "")}
//     >
//       <div
//         className={cn(
//           // STRETCH: Increased max-width by 100px (from 910px to 1010px)
//           "flex items-center w-full max-w-[1010px] mx-auto",
//           "bg-white dark:bg-zinc-900 rounded-[14px] p-1.5",
//           "border border-black/5 dark:border-white/10 shadow-sm",
//           containerClassName,
//         )}
//       >
//         {propTabs.map((tab, index) => (
//           <div key={tab.title} className="flex flex-1 items-center">
//             <button
//               onClick={() => RouterPush(navigate, tab.link)}
//               className={cn(
//                 // STRETCH: Increased horizontal padding (px-14) to fill the extra width
//                 "relative flex-1 flex items-center justify-center md:px-14 px-5 py-2 rounded-[14px]",
//                 "md:text-lg text-sm font-medium transition-colors whitespace-nowrap",
//                 "hover:bg-pink-100 dark:hover:bg-zinc-800 border-none",
//                 tabClassName
//               )}
//             >
//               {active.title === tab.title && (
//                 <motion.div
//                   layoutId="active-nav-tab"
//                   transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
//                   className={cn(
//                     "absolute inset-0 rounded-full bg-pink-100 dark:bg-zinc-800",
//                     activeTabClassName
//                   )}
//                 />
//               )}

//               <span className="relative z-20 flex gap-3 items-center">
//                 {tab.iconUrl && (
//                   <div className="flex-shrink-0 -ml-2">
//                     <Image
//                       className="rounded-full object-cover hover:scale-150 transition-all duration-300"
//                       src={tab.iconUrl}
//                       alt={tab.title}
//                       width={imgsize}
//                       height={imgsize}
//                       priority
//                     />
//                   </div>
//                 )}
//                 {!ismobile && <span className="hidden sm:block text-sm">{tab.title}</span>}
//               </span>
//             </button>

//             {index < propTabs.length - 1 && !ismobile && (
//               <div className="h-6 w-px bg-black/10 dark:bg-white/10 mx-1 opacity-50" />
//             )}
//           </div>
//         ))}
//       </div>
//     </motion.div>
//   );
// };
























// {
//   /* <div className="w-full flex justify-center overflow-visible">
//         <AnimatePresence mode="wait">
//           {isVisible && (
//             <motion.div
//               key="filter-wrapper"
//               initial={{ opacity: 0, y: -20, height: 0 }}
//               animate={{ opacity: 1, y: 0, height: "auto" }}
//               exit={{ opacity: 0, y: -20, height: 0 }}
//               transition={{ type: "spring", stiffness: 300, damping: 30 }}
//               className="w-full max-w-5xl"
//             >
//               <Search_bar_filter filter_bar={active} mobile={ismobile} />
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div> */
// }
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Pages } from "@/constants/constants";
import { usePathname, useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { RouterPush } from "../RouterPush";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const TabsNav = ({
  tabs: propTabs,
  containerClassName,
  activeTabClassName,
  className,
  tabClassName,
}: {
  mobile: boolean;
  tabs: Pages[];
  containerClassName?: string;
  activeTabClassName?: string;
  tabClassName?: string;
  className?: string;
}) => {
  const navigate = useRouter();
  const location = usePathname();
  const ismobile = useIsMobile();

  const [isVisible, setIsVisible] = useState(true);
  const imgsize = ismobile ? 28 : 34;
  const active = propTabs.find((tab) => location.endsWith(tab.link));

  // Scroll arrow state
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction === "left" ? -670 : 670, behavior: "smooth" });
  };

  return (
    <motion.div
      initial={false}
      animate={{ y: isVisible ? 0 : -100 }}
      className={cn(
        "z-10 w-full flex justify-center",
        ismobile ? "z-50 pb-0" : "",
        className
      )}
    >
      {/* Wrapper for arrows + scrollable container */}
      <div className="relative w-full flex items-center">
        {/* Left arrow + fade — mobile only */}
        <AnimatePresence>
          {ismobile && canScrollLeft && (
            <motion.div
              key="scroll-left-zone"
              initial={{ x: -40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -40, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="absolute left-0 z-30 flex items-center h-full"
              style={{ pointerEvents: "none" }}
            >
              {/* Gradient fade mask */}
              <div className="absolute left-0 top-0 h-full w-12 bg-gradient-to-r from-background via-background/60 to-transparent pointer-events-auto"
                onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}
              />
              <button
                onClick={(e) => { e.stopPropagation(); e.preventDefault(); scroll("left"); }}
                className="relative z-10 flex items-center justify-center w-8 h-14 rounded-tr-xl rounded-br-xl bg-background/90 dark:bg-zinc-800/90 backdrop-blur-md border border-border/50 shadow-lg active:scale-90 transition-transform"
                style={{ pointerEvents: "auto" }}
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4 text-foreground/80" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div
          ref={scrollRef}
          className={cn(
            "flex items-center w-full mx-auto",
            "bg-white dark:bg-zinc-900 rounded-[14px] p-1.5",
            "border border-black/5 dark:border-white/10 shadow-sm md:min-w-[410px] lg:min-w-[710px] xl:min-w-[910px] overflow-x-auto",
            containerClassName,
            ismobile ? "border-none shadow-none scrollbar-hide" : ""
          )}
        >
          {propTabs.map((tab, index) => (
            <div key={tab.title} className="flex flex-1 items-center min-w-19 min-h-16">
              <Link
                href={tab.link}
                className={cn(
                  "relative flex-1 flex items-center justify-center px-2 sm:px-4 py-2 rounded-[12px]",
                  "md:text-base text-sm font-medium transition-all whitespace-nowrap",
                  "hover:bg-pink-50 dark:hover:bg-zinc-800 border-none",
                  tabClassName
                )}
              >
                {active?.title === tab.title && (
                  <motion.div
                    layoutId="active-nav-tab"
                    transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                    className={cn(
                      "absolute inset-0 rounded-[12px] bg-pink-100 dark:bg-zinc-800",
                      activeTabClassName
                    )}
                  />
                )}

                <span className="relative z-20 flex gap-2 md:gap-3 items-center">
                  {tab.iconUrl && (
                    <div className="shrink-0">
                      <Image
                        className={cn(
                          "rounded-full object-cover transition-transform duration-300 scale-145",
                          tab.iconUrl === active?.iconUrl && "scale-100"
                        )}
                        src={tab.iconUrl}
                        alt={tab.title}
                        width={imgsize}
                        height={imgsize}
                        priority
                      />
                    </div>
                  )}
                  {(
                    <span className="hidden lg:block text-xs sm:text-sm">
                      {tab.title}
                    </span>
                  )}
                </span>
              </Link>

              {/* Visual Separator */}
              {index < propTabs.length - 1 && !ismobile && (
                <div className="h-5 w-px bg-black/10 dark:bg-white/10 mx-1 opacity-30" />
              )}
            </div>
          ))}
        </div>

        {/* Right arrow + fade — mobile only */}
        <AnimatePresence>
          {ismobile && canScrollRight && (
            <motion.div
              key="scroll-right-zone"
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 40, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="absolute right-0 z-30 flex items-center justify-end h-full"
              style={{ pointerEvents: "none" }}
            >
              {/* Gradient fade mask */}
              <div className="absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-background via-background/60 to-transparent pointer-events-auto"
                onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}
              />
              <button
                onClick={(e) => { e.stopPropagation(); e.preventDefault(); scroll("right"); }}
                className="relative z-10 flex items-center justify-center w-8 h-14 rounded-tl-xl rounded-bl-xl bg-background/90 dark:bg-zinc-800/90 backdrop-blur-md border border-border/50 shadow-lg active:scale-90 transition-transform"
                style={{ pointerEvents: "auto" }}
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4 text-foreground/80" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
// "use client";

// import { 
//   motion, 
//   useMotionValue, 
//   useSpring, 
//   useTransform, 
//   AnimatePresence 
// } from "framer-motion";
// import { cn } from "@/lib/utils";
// import type { Pages } from "@/constants/constants";
// import { usePathname } from "next/navigation";
// import { useIsMobile } from "@/hooks/use-mobile";
// import { useRef, useState } from "react";
// import Image from "next/image";
// import Link from "next/link";

// export const TabsNav = ({
//   tabs: propTabs,
//   containerClassName,
//   activeTabClassName,
//   tabClassName,
// }: {
//   mobile: boolean;
//   tabs: Pages[];
//   containerClassName?: string;
//   activeTabClassName?: string;
//   tabClassName?: string;
// }) => {
//   const location = usePathname();
//   const ismobile = useIsMobile();
  
//   let mouseX = useMotionValue(Infinity);
//   const active = propTabs.find((tab) => location.endsWith(tab.link)) || propTabs[0];

//   return (
//     <motion.div
//       initial={false}
//       onMouseMove={(e) => !ismobile && mouseX.set(e.pageX)}
//       onMouseLeave={() => !ismobile && mouseX.set(Infinity)}
//       className={cn("sticky top-0 z-10 w-full flex justify-center py-2 px-4 ", ismobile ? " z-50 " : "")}
//     >
//       <div
//         className={cn(
//           "flex items-center w-full mx-auto transition-all",
//           "bg-white dark:bg-zinc-900 rounded-[14px] p-1.5",
//           "border border-black/5 dark:border-white/10 shadow-sm md:min-w-[410px] lg:min-w-[710px] xl:min-w-[910px]",
//           containerClassName,
//         )}
//       >
//         {propTabs.map((tab, index) => (
//           <div key={tab.title} className="flex flex-1 items-center">
//             <TabItem 
//               tab={tab} 
//               mouseX={mouseX} 
//               active={active.title === tab.title}
//               tabClassName={tabClassName}
//               activeTabClassName={activeTabClassName}
//               ismobile={ismobile}
//             />
//             {index < propTabs.length - 1 && !ismobile && (
//               <div className="h-5 w-px bg-black/10 dark:bg-white/10 mx-1 opacity-30" />
//             )}
//           </div>
//         ))}
//       </div>
//     </motion.div>
//   );
// };

// function TabItem({ tab, mouseX, active, tabClassName, activeTabClassName, ismobile }: any) {
//   let ref = useRef<HTMLAnchorElement>(null);

//   let distance = useTransform(mouseX, (val:number) => {
//     let bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
//     return val - bounds.x - bounds.width / 2;
//   });

//   let scaleTransform = useTransform(distance, [-150, 0, 150], [1, 1.3, 1]);
  
//   let scale = useSpring(scaleTransform, {
//     mass: 0.1,
//     stiffness: 150,
//     damping: 12,
//   });

//   const [hovered, setHovered] = useState(false);

//   return (
//     <Link
//       ref={ref}
//       href={tab.link}
//       onMouseEnter={() => setHovered(true)}
//       onMouseLeave={() => setHovered(false)}
//       className={cn(
//         "relative flex-1 flex items-center justify-center px-2 sm:px-4 py-2 rounded-[12px]",
//         "md:text-base text-sm font-medium transition-all whitespace-nowrap",
//         "hover:bg-pink-50 dark:hover:bg-zinc-800 border-none",
//         tabClassName
//       )}
//     >
//       {active && (
//         <motion.div
//           layoutId="active-nav-tab"
//           transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
//           className={cn(
//             "absolute inset-0 rounded-[12px] bg-pink-100 dark:bg-zinc-800",
//             activeTabClassName
//           )}
//         />
//       )}


//       <motion.span 
//         style={{ scale: ismobile ? 1 : scale }} 
//         className="relative z-20 flex gap-2 md:gap-3 items-center"
//       >
//         {tab.iconUrl && (
//           <div className="shrink-0">
//             <Image
//               className={cn(
//                 "rounded-full object-cover transition-transform duration-300",
//                 active ? "scale-100" : "scale-110"
//               )}
//               src={tab.iconUrl}
//               alt={tab.title}
//               width={34}
//               height={34}
//               priority
//             />
//           </div>
//         )}
//         <span className="hidden lg:block text-xs sm:text-sm">
//           {tab.title}
//         </span>
//       </motion.span>
//     </Link>
//   );
// }