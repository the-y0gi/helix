import type { Pages } from "@/constants/constants";
import Search_bar_filter from "./search-bar-nav";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { IconArrowRampRight } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
export const FindTabsNav = ({
  mobile,
  tabs: propTabs,

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
    
  );
};
