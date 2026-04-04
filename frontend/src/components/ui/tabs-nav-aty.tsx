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

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Pages } from "@/constants/constants";
import { usePathname, useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import Image from "next/image";
import { RouterPush } from "../RouterPush";

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
  const imgsize = ismobile ? 28 : 34; // Slightly tighter icon for better scaling
  const active = propTabs.find((tab) => location.endsWith(tab.link)) || propTabs[0];

  return (
    <motion.div
      initial={false}
      animate={{ y: isVisible ? 0 : -100 }}
      // flex justify-center ensures the stretched bar stays centered over the 910px card
      className={cn("sticky top-0 z-10 w-full flex justify-center py-2 px-4 ", ismobile ? " z-50 " : "")}
    >
      <div
        className={cn(
          /* FIX: 'w-full' makes it fluid. 
             'max-w-[1010px]' ensures it never grows larger than original.
             'transition-all' ensures smooth resizing.
          */
          "flex items-center w-full  mx-auto",
          "bg-white dark:bg-zinc-900 rounded-[14px] p-1.5",
          "border border-black/5 dark:border-white/10 shadow-sm md:min-w-[510px] lg:min-w-[810px] xl:min-w-[910px]",
          containerClassName,
        )}
      >
        {propTabs.map((tab, index) => (
          <div key={tab.title} className="flex flex-1 items-center">
            <button
              onClick={() => RouterPush(navigate, tab.link)}
              className={cn(
                /* FIX: Removed hardcoded px-14. 
                   Using flex-1 and smaller padding lets the buttons 
                   shrink and grow based on the container width.
                */
                "relative flex-1 flex items-center justify-center px-2 md:px-4 py-2 rounded-[12px]",
                "md:text-base text-sm font-medium transition-all whitespace-nowrap",
                "hover:bg-pink-50 dark:hover:bg-zinc-800 border-none",
                tabClassName
              )}
            >
              {active.title === tab.title && (
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
                  <div className="flex-shrink-0">
                    <Image
                      className="rounded-full object-cover transition-transform duration-300"
                      src={tab.iconUrl}
                      alt={tab.title}
                      width={imgsize}
                      height={imgsize}
                      priority
                    />
                  </div>
                )}
                {/* Text stays hidden on very small screens, but scales on desktop */}
                {(
                  <span className="hidden lg:block text-sm lg:text-base">
                    {tab.title}
                  </span>
                )}
              </span>
            </button>

            {/* Visual Separator */}
            {index < propTabs.length - 1 && !ismobile && (
              <div className="h-5 w-px bg-black/10 dark:bg-white/10 mx-1 opacity-30" />
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};