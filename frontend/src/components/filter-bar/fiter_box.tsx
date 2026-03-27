"use client";

import { SearchBoxValuesProps } from "@/constants/constants";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { TabsNav } from "../ui/tabs-nav-aty";
import { usePathname, useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { pages } from "@/constants/pages";
import { cn } from "@/lib/utils";
import { Spinner } from "../spinner";
import NProgress from "nprogress";
import { RouterPush } from "../RouterPush";
const FilterBox = ({
  FilterBoxValues,
}: {
  FilterBoxValues: SearchBoxValuesProps;
  link?: string;
  type?: "filter" | "home";
}) => {
  const router = useRouter();
  const ismobile = useIsMobile();
  const [loading, setLoading] = useState(false);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setActiveIdx(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-2 lg:gap-4 items-center md:px-10 mx-auto relative md:py-3">
      <Card
        className={cn(
          "md:p-6 px-4 py-4 gap-4 md:gap-6 shadow-xl border-none bg-card text-card-foreground rounded-[0.5rem] w-full lg:w-[910px] flex flex-col relative z-30",
          ismobile && "w-full py-3",
        )}
      >
        {/* ... inside the FilterBox component ... */}

        <div className="space-y-3">
          {FilterBoxValues.search}

          {/* 1. This container now handles the relative positioning for the dropdown */}
          <div className="relative" ref={containerRef}>
            <div className="flex gap-3">
              {FilterBoxValues.filterBlocks.map((item, idx) => {
                const IconValues = item.icon;
                const isActive = activeIdx === idx;

                return (
                  <div key={idx} className="flex-1">
                    <div
                      onClick={() => setActiveIdx(isActive ? null : idx)}
                      className={cn(
                        "flex md:flex-row flex-col w-full items-center gap-3 bg-secondary/50 border border-border rounded-[10px] px-2 md:px-5 py-3 hover:bg-secondary/80 transition-colors cursor-pointer relative z-10",
                        isActive && "border-primary ring-1 ring-primary/20 bg-secondary"
                      )}
                    >
                      <IconValues className="w-4 h-4 text-muted-foreground shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                          {item.label}
                        </p>
                        {!ismobile && (
                          <p className="text-sm font-medium truncate">{item.text}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 2. Move AnimatePresence OUTSIDE the map, but inside the relative container */}
            <AnimatePresence>
              {activeIdx !== null && FilterBoxValues.filterBlocks[activeIdx]?.element && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.98 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className={cn(
                    "absolute top-full mt-2 z-50 bg-background border border-border shadow-2xl rounded-2xl p-4",
                    "left-0 right-0 mx-auto w-full max-w-[90%] md:max-w-[600px]" // Centers the dropdown
                  )}
                >
                  {FilterBoxValues.filterBlocks[activeIdx].element}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <Button
          disabled={loading}
          className="w-full bg-[#FE3230] hover:bg-primary/90 mt-2 text-primary-foreground h-12 md:h-14 rounded-[10px] text-lg font-bold shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
          onClick={() => {
            // NProgress.start();
            RouterPush(router, "/hotels/find")
            setLoading(true)
          }}
        >
          {
            loading ? <Spinner /> : "Search Hotel"
          }
        </Button>
      </Card>

      <div className="pt-5 md:pt-0">
        <LoopingVideoHero VIDEOS={FilterBoxValues?.videos || []} />
      </div>

      <AnimatePresence>
        {activeIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/5 z-20 pointer-events-none"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export function LoopingVideoHero({ VIDEOS }: { VIDEOS: string[] }) {
  const [index, setIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % VIDEOS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [VIDEOS.length]);

  return (
    <div className="relative rounded-[0.5rem]  overflow-hidden shadow-2xl w-full md:max-w-[516px] md:h-[296px] h-[170px]  px-2 md:px-0 group bg-black">
      <AnimatePresence mode="popLayout">
        <motion.video
          key={VIDEOS[index]}
          ref={videoRef}
          src={VIDEOS[index]}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          autoPlay
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 ">
        {VIDEOS.map((_, i) => (
          <div
            key={i}
            className="h-1 w-8 rounded-full bg-white/20 overflow-hidden"
          >
            {index === i && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 5, ease: "linear" }}
                className="h-full bg-white"
              />
            )}
          </div>
        ))}
      </div>

      <div className="absolute top-4 left-4 bg-black/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
        <span className="flex items-center gap-2 text-white text-[10px] font-bold tracking-widest uppercase">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
          Live Preview
        </span>
      </div>
    </div>
  );
}
export default FilterBox;
