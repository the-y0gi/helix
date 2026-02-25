"use client";

import { IconSearch } from "@tabler/icons-react";
import type { FilterBarValues } from "@/constants/constants";
import { cn } from "@/lib/utils";
import { Item, ItemContent, ItemDescription, ItemTitle } from "../ui/item";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "../ui/input";

export const PagesFilterBarButtons = ({
  PagesFilterBarValues,
  link,
  type,
}: {
  PagesFilterBarValues: (FilterBarValues & { element?: React.ReactNode })[];
  link?: string;
  type?: "filter" | "home";
}) => {
  const navigate = useRouter();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setSelectedId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-5xl mx-auto">
      {/* 1. Global Backdrop Blur */}
      <AnimatePresence>
        {selectedId !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-20 "
            onClick={() => setSelectedId(null)}
          />
        )}
      </AnimatePresence>

      {/* 2. Navbar Row */}
      <div className="relative z-30 flex items-center bg-transparent rounded-full">
        {PagesFilterBarValues.map((hv, i) => {
          const isActive = selectedId === i;
          return (
            <div
              key={i}
              className="relative w-full md:w-auto"
              onMouseEnter={() => selectedId !== null && setSelectedId(i)}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedId(i);
              }}
            >
              <Item
                className={cn(
                  "relative z-40 cursor-pointer rounded-full px-3 py-1 transition-all duration-300",
                  isActive ? "text-primary" : "text-gray-500 "
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-highlight"
                    className="absolute inset-0 z-10 rounded-full bg-gray-150 shadow-inner"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <ItemContent className="relative z-20 items-center gap-0 md:text-left">
                  <ItemTitle className="text-sm font-bold uppercase tracking-wide justify-start">
                    {hv.value}
                  </ItemTitle>
                  {/* <ItemDescription>{hv.description}</ItemDescription> */}
                  <div className="flex justify-center w-full">
                    <input
                      type="text"
                      readOnly={selectedId === null}
                      style={{ all: "unset", width: "100%", padding: "0", border: "none" }}
                      placeholder={"          " + hv.description}
                    />
                  </div>
                </ItemContent>
              </Item>
            </div>
          );
        })}

        {type === "home" && (
          <Button
            onClick={() => navigate.push(link || "/")}
            className="z-40 h-10 w-10  rounded-full bg-primary text-text  shadow-xl hover:scale-105 transition-transform ml-2"
          >
            <IconSearch size={24} stroke={3} />
          </Button>
        )}
      </div>

      {/* 3. The Large Dynamic Drawer (POSITIONING CHANGED) */}
     {/* 3. The Large Dynamic Drawer */}
<AnimatePresence>
  {selectedId !== null && (
    <motion.div
      layout // Essential for smooth transition between items
      key="drawer" // Keep the drawer as one consistent layout element
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{
        layout: { type: "spring", bounce: 0.1, duration: 0.3 },
        opacity: { duration: 0.2 }
      }}
      style={{ originX: 0.5 }}
      className={cn(
        "absolute left-1/2 -translate-x-1/2 z-40 md:w-[95vw] w-[90vw] min-h-[100px] max-w-xl  overflow-hidden md:rounded-[3rem] rounded-[1rem] border border-border-100 bg-background md:p-2 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.25)]",
        "bottom-full mb-4 md:bottom-auto md:top-full md:mt-6"
      )}
    >
      <motion.div layout className="p-7">
        <AnimatePresence mode="popLayout" initial={false}>
          {/* We use a internal key for content, but keep the parent drawer stable */}
          <motion.div
            key={selectedId}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="min-h-[100px] w-full ">
              {PagesFilterBarValues[selectedId].element}
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
    </div>
  );
};

 // <HotelFilterBar
        //   type={type}
        //   key={i}
        //   tagline={hv.tagline}
        //   content={hv.element}
        // >
        //   <div className="flex flex-col items-center gap-2 md:flex-row ">
        //     <div
        //       className={cn(
        //         "bg-border relative ",
        //         i === 0 && "hidden",
        //         "h-px w-6 md:h-4 md:w-px ",

        //         type === "filter" && "md:h-18",
        //       )}
        //     />

        //     <Item>
        //       <ItemContent className="gap-0 text-center md:text-left md:ml-3 items-center">
        //         <ItemTitle>{hv.value}</ItemTitle>
        //         <ItemDescription>{hv.description}</ItemDescription>
               
               
             
        //       </ItemContent>
        //     </Item>
        //   </div>
        // </HotelFilterBar>