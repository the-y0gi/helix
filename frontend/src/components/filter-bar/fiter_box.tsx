// "use client";

// import { SearchBoxValuesProps } from "@/constants/constants";
// import { AnimatePresence, motion } from "framer-motion";
// import React, { useEffect, useRef, useState } from "react";
// import { Button } from "../ui/button";
// import { Card } from "../ui/card";
// import { TabsNav } from "../ui/tabs-nav-aty";
// import { usePathname, useRouter } from "next/navigation";
// import { useIsMobile } from "@/hooks/use-mobile";
// import { pages } from "@/constants/pages";
// import { cn } from "@/lib/utils";
// import { Spinner } from "../spinner";
// import NProgress from "nprogress";
// import { RouterPush } from "../RouterPush";
// import { useHotelStore } from "@/store/hotel.store";
// const FilterBox = ({
//   FilterBoxValues,
//   link
// }: {
//   FilterBoxValues: SearchBoxValuesProps;
//   link?: string;
//   type?: "filter" | "home";
// }) => {
//   const router = useRouter();
//   const ismobile = useIsMobile();
//   const { city, setCity } = useHotelStore();
//   const [loading, setLoading] = useState(false);
//   const [activeIdx, setActiveIdx] = useState<number | null>(null);
//   const containerRef = useRef<HTMLDivElement | null>(null);
//   const [iscity, setiscity] = useState(false);
//   const hotelStorage = localStorage.getItem("hotel-storage");
//   useEffect(() => {
//     if (hotelStorage) {
//       const hotel = JSON.parse(hotelStorage);
//       setiscity(!!hotel?.state?.city);
//     }
//   }, [hotelStorage]);


//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         containerRef.current &&
//         !containerRef.current.contains(event.target as Node)
//       ) {
//         setActiveIdx(null);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);


//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-stretch md:px-6 lg:px-10 mx-auto py-3">

//       {/* CARD */}
//       <Card
//         className={cn(
//           "w-full flex flex-col gap-4 md:gap-6 shadow-xl border-none bg-card text-card-foreground rounded-[0.5rem] px-4 py-4 md:p-6",
//           ismobile && "py-3"
//         )}
//       >
//         {/* ... inside the FilterBox component ... */}

//         <div className="space-y-3">
//           {FilterBoxValues.search}

//           {/* 1. This container now handles the relative positioning for the dropdown */}
//           <div className="relative" ref={containerRef}>
//             <div className="flex gap-3">
//               {FilterBoxValues.filterBlocks.map((item, idx) => {
//                 const IconValues = item.icon;
//                 const isActive = activeIdx === idx;

//                 return (
//                   <div key={idx} className="flex-1">
//                     <div
//                       onClick={() => setActiveIdx(isActive ? null : idx)}
//                       className={cn(
//                         "flex md:flex-row flex-col w-full items-center gap-3 bg-secondary/50 border border-border rounded-[10px] px-2 md:px-5 py-3 hover:bg-secondary/80 transition-colors cursor-pointer relative z-10",
//                         isActive && "border-primary ring-1 ring-primary/20 bg-secondary"
//                       )}
//                     >
//                       <IconValues className="w-4 h-4 text-muted-foreground shrink-0" />
//                       <div className="flex-1 min-w-0">
//                         <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
//                           {item.label}
//                         </p>
//                         {!ismobile && (
//                           <p className="text-sm font-medium truncate">{item.text}</p>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>

//             {/* 2. Move AnimatePresence OUTSIDE the map, but inside the relative container */}
//             <AnimatePresence>
//               {activeIdx !== null && FilterBoxValues.filterBlocks[activeIdx]?.element && (
//                 <motion.div
//                   initial={{ opacity: 0, y: 10, scale: 0.98 }}
//                   animate={{ opacity: 1, y: 0, scale: 1 }}
//                   exit={{ opacity: 0, y: 10, scale: 0.98 }}
//                   transition={{ duration: 0.2, ease: "easeOut" }}
//                   className={cn(
//                     "absolute top-full mt-2 z-50 bg-background border border-border shadow-2xl rounded-2xl p-4",
//                     "left-0 right-0 mx-auto w-full max-w-[90%] md:max-w-[600px]" // Centers the dropdown
//                   )}
//                 >
//                   {FilterBoxValues.filterBlocks[activeIdx].element}
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>
//         </div>

//         <Button
//           disabled={loading || !city}
//           className="w-full bg-[#FE3230] hover:bg-primary/90 mt-2 text-primary-foreground h-12 md:h-14 rounded-[10px] text-lg font-bold shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
//           onClick={() => {
//             // NProgress.start();
//             RouterPush(router, "/hotels/find")
//             setLoading(true)
//           }}
//         >
//           {
//             loading ? <Spinner /> : iscity ? `Search ${link?.substring(1, link.length)}` : `Select city`
//           }
//         </Button>
//       </Card>

//       <div className="w-full pt-4 md:pt-0">
//         <div className="w-full h-[220px] sm:h-[280px] md:h-full rounded-xl overflow-hidden">
//           <LoopingVideoHero VIDEOS={FilterBoxValues?.videos || []} />
//         </div>
//       </div>

//       <AnimatePresence>
//         {activeIdx !== null && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/5 z-20 pointer-events-none"
//           />
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export function LoopingVideoHero({ VIDEOS }: { VIDEOS: string[] }) {
//   const [index, setIndex] = useState(0);
//   const videoRef = useRef<HTMLVideoElement>(null);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setIndex((prev) => (prev + 1) % VIDEOS.length);
//     }, 5000);
//     return () => clearInterval(interval);
//   }, [VIDEOS.length]);

//   return (
//     <div className="relative rounded-[0.5rem]   overflow-hidden shadow-2xl w-full md:max-w-[516px] md:h-[296px] h-[170px]  group bg-black">
//       <AnimatePresence mode="popLayout">
//         <motion.video
//           key={VIDEOS[index]}
//           ref={videoRef}
//           src={VIDEOS[index]}
//           initial={{ opacity: 0, scale: 1.1 }}
//           animate={{ opacity: 1, scale: 1 }}
//           exit={{ opacity: 0, scale: 0.95 }}
//           transition={{ duration: 0.8, ease: "easeInOut" }}
//           autoPlay
//           muted
//           playsInline
//           className="absolute inset-0 w-full h-full object-cover"
//         />
//       </AnimatePresence>

//       <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

//       <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2  ">
//         {VIDEOS.map((_, i) => (
//           <div
//             key={i}
//             className="h-1 w-8 rounded-full bg-white/20 overflow-hidden"
//           >
//             {index === i && (
//               <motion.div
//                 initial={{ width: 0 }}
//                 animate={{ width: "100%" }}
//                 transition={{ duration: 5, ease: "linear" }}
//                 className="h-full bg-white"
//               />
//             )}
//           </div>
//         ))}
//       </div>

//       <div className="absolute top-4 left-4 bg-black/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
//         <span className="flex items-center gap-2 text-white text-[10px] font-bold tracking-widest uppercase">
//           <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
//           Live Preview
//         </span>
//       </div>
//     </div>
//   );
// }
// export default FilterBox;
"use client";

import { SearchBoxValuesProps } from "@/constants/constants";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Spinner } from "../spinner";
import { RouterPush } from "../RouterPush";
import { useHotelStore } from "@/store/hotel.store";
import { useRouter } from "next/navigation";

const FilterBox = ({
  FilterBoxValues,
  link
}: {
  FilterBoxValues: SearchBoxValuesProps;
  link?: string;
  type?: "filter" | "home";
}) => {
  const router = useRouter();
  const ismobile = useIsMobile();
  const { city } = useHotelStore();
  const [loading, setLoading] = useState(false);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [iscity, setiscity] = useState(false);

  const hotelStorage = typeof window !== 'undefined' ? localStorage.getItem("hotel-storage") : null;

  useEffect(() => {
    if (hotelStorage) {
      const hotel = JSON.parse(hotelStorage);
      setiscity(!!hotel?.state?.city);
    }
  }, [hotelStorage]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActiveIdx(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    /* Change 1: Updated Grid to handle side-by-side on desktop better */
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6 items-start md:px-6 lg:px-10 mx-auto py-3">

      {/* CARD - Takes 3 columns on large screens */}
      <Card
        className={cn(
          "lg:col-span-3 w-full flex flex-col gap-4 md:gap-6 shadow-xl border-none bg-card text-card-foreground rounded-[0.5rem] px-4 py-4 md:p-6",
          ismobile && "py-3"
        )}
      >
        <div className="space-y-3">
          {FilterBoxValues.search}

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

            <AnimatePresence>
              {activeIdx !== null && FilterBoxValues.filterBlocks[activeIdx]?.element && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.98 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className={cn(
                    "absolute top-full mt-2 z-50 bg-background border border-border shadow-2xl rounded-2xl p-4",
                    "left-0 right-0 mx-auto w-full max-w-[90%] md:max-w-[600px]"
                  )}
                >
                  {FilterBoxValues.filterBlocks[activeIdx].element}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <Button
          disabled={loading || !city}
          className="w-full bg-[#FE3230] hover:bg-red-600 mt-2 text-primary-foreground h-12 md:h-14 rounded-[10px] text-lg font-bold shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
          onClick={() => {
            RouterPush(router, "/hotels/find");
            setLoading(true);
          }}
        >
          {loading ? <Spinner /> : iscity ? `Search ${link?.substring(1, link.length)}` : `Select city`}
        </Button>
      </Card>

      {/* VIDEO CONTAINER - Takes 2 columns on large screens */}
      <div className="lg:col-span-2 w-full h-full lg:px-0 px-2">
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


const DUMMY_TEXTS = [
  "Experience Innovation",
  "Seamless Integration",
  "Next-Gen Solutions",
  "Future of Design"
];

export function LoopingVideoHero({ VIDEOS }: {
  VIDEOS: {
    title: string
    description: string
    link: string
  }[]
}) {
  const [index, setIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % VIDEOS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [VIDEOS.length]);

  return (
    <div className="relative rounded-[0.5rem] overflow-hidden shadow-2xl w-full h-[220px] md:h-[296px] lg:h-full group bg-black min-h-[220px]">
      <AnimatePresence mode="popLayout">
        <motion.video
          key={`video-${index}`}
          ref={videoRef}
          src={VIDEOS[index].link}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          autoPlay
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />

        <motion.div
          key={`text-${index}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="absolute inset-0 flex items-end mb-5 justify-start  z-10 pointer-events-none"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1]
              }}
              className="flex flex-col gap-1 md:gap-3 p-4 md:p-8 lg:p-12 w-full max-w-[90%]  pointer-events-none"
            >
              <h2 className="text-zinc-100 font-bold drop-shadow-2xl tracking-tight
      text-2xl        
      sm:text-3xl     
        
    ">
                {VIDEOS[index].title}
              </h2>

              <p className="text-zinc-300 font-medium drop-shadow-md leading-relaxed
      text-xs         
      sm:text-sm      
          
      max-w-prose     
    ">
                {VIDEOS[index].description}
              </p>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40 pointer-events-none" />

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {VIDEOS.map((_, i) => (
          <div key={i} className="h-1 w-8 rounded-full bg-white/20 overflow-hidden">
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

      <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 z-20">
        <span className="flex items-center gap-2 text-white text-[10px] font-bold tracking-widest uppercase">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
          Live Preview
        </span>
      </div>
    </div>
  );
}

export default FilterBox;