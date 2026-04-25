"use client";
import { TabsNav } from "../ui/tabs-nav-aty";
import { FilterOfPages, pages } from "@/constants/pages";
import { Footer } from "../footer/FFooter";
import { FindTabsNav } from "./filter-nav-bar/find-filter-bars";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LOGO from "./logo";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "../ui/button";

import FilterBarLayout from "../filter-bar/filter-bar-layout";
import { Sign_in_hover } from "../auth/_components/sign-in-hover";
import Link from "next/link";
import TopRight from "./topRight";
import { BottomNav, MobileNavWrapper, PersistentHeader } from "./mobilenav";
import { ChevronDown, Mail, X } from "lucide-react";
import { PopLogin } from "./PopMessages";

const pagesNames = pages.map((page) => page.link.split("/")[1]);
const NavWrapper = ({ children }: { children: React.ReactNode }) => {
  const location = usePathname();
  const isMobile = useIsMobile();
  const [showAdPopup, setShowAdPopup] = useState(false);
  const [hasDismissed, setHasDismissed] = useState(false);


  const segments = location.split("/").filter(Boolean);

  const shouldShowNavbar = !(
    (segments.length === 1 && pagesNames.includes(segments[0])) ||
    segments.length === 0
  );
  const mobileHeight = isMobile ? "h-20" : "h-40";
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

    if (token) {
      setShowAdPopup(false);
      return;
    }

    if (!token && !hasDismissed) {
      const timer = setTimeout(() => {
        setShowAdPopup(true);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [location, hasDismissed]);


  // useEffect(() => {



  //   const timer = setTimeout(() => {
  //     toast.custom((t) => (
  //       <div className="group relative w-[320px] overflow-hidden rounded-2xl border border-border bg-background/80 shadow-2xl backdrop-blur-md transition-all duration-300 hover:shadow-orange-500/10 dark:bg-zinc-900/90">
  //         {/* Image Section with Badge */}
  //         <div className="relative h-44 w-full overflow-hidden">
  //           <img
  //             src="/room1.png"
  //             alt="Hotel Marina"
  //             className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
  //           />
  //           {/* Floating Badge */}
  //           <div className="absolute left-3 top-3 rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
  //             New Offer
  //           </div>

  //           {/* Gradient Overlay */}
  //           <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

  //           <div className="absolute bottom-3 left-3 right-3">
  //             <h3 className="text-lg font-bold leading-tight text-white">
  //               Hotel Marina launches <span className="text-orange-400">exclusive</span> discounts
  //             </h3>
  //           </div>
  //         </div>

  //         {/* Content Section */}
  //         <div className="flex flex-col gap-3 p-4">
  //           <p className="text-xs text-muted-foreground leading-relaxed">
  //             Experience luxury for less. Unlock member-only rates and seasonal suites starting today.
  //           </p>

  //           <div className="flex items-center gap-2">
  //             <Button
  //               size="sm"
  //               className="h-9 w-full bg-orange-500 font-semibold text-white hover:bg-orange-600 transition-all active:scale-95"
  //               onClick={() => {
  //                 router.push("/hotels");
  //                 toast.dismiss(t);
  //               }}
  //             >
  //               Book Now
  //             </Button>

  //             <Button
  //               size="sm"
  //               variant="outline"
  //               className="h-9 px-3 border-border hover:bg-secondary"
  //               onClick={() => toast.dismiss(t)}
  //             >
  //               Dismiss
  //             </Button>
  //           </div>
  //         </div>

  //         {/* Subtle Progress Bar Decoration */}
  //         <div className="h-1 w-full bg-orange-500/20">
  //           <div className="h-full bg-orange-500 animate-in slide-in-from-left duration-[5000ms]" />
  //         </div>
  //       </div>
  //     ), {
  //       duration: 5000,
  //     });
  //   }, 10000);

  //   return () => clearTimeout(timer);
  // }, []);
  // const navigate = useRouter();

  return (
    <div className=" flex flex-col pb-20 md:pb-0   ">
      <div
        className={cn(
          " top-0 left-0 z-50 w-full bg-card    flex flex-col justify-center bg-gradient-to-br from-zinc-100 to-transparent dark:bg-gradient-to-bl dark:from-zinc-700  border-b border-gray-300 dark:border-gray-700 ",
          "h-auto",
          "bg-background",
          isMobile ? "bg-transparent border-none shadow-md static" : ""

        )}
      >
        <div className="flex flex-col  justify-center md:py-3 md:px-5  sm:pr-3 px-2 h-full">

          <div className="flex  justify-between py-3     h-full">
            <LOGO />
            {(
              <div className="hidden md:flex flex-col items-center gap-[5px] h-full md:block">
                {shouldShowNavbar && (
                  <div className="md:w-[485px] lg:w-[585px] ">

                    <FindTabsNav mobile={false} tabs={FilterOfPages} />
                  </div>
                )}
              </div>
            )}
            <TopRight isMobile={isMobile} />
          </div>


          {(
            <div className="hidden md:flex flex-col items-center gap-[5px] h-full md:block -my-1">
              {!shouldShowNavbar && (
                <TabsNav mobile={false} tabs={pages} />
              )}
            </div>
          )}


        </div>
        {/* {!isMobile && !shouldShowNavbar && <PersistentHeader>
          <div className="flex h-14 items-center justify-around px-20 ">
            <TabsNav mobile={false} tabs={pages} containerClassName="shadow-none border-none bg-transparent" />
          </div>
        </PersistentHeader>} */}

      </div>

      <main
        className={cn(
          "flex-1 bg-card",
          // shouldShowNavbar ? "pt-21" : "pt-29",
          isMobile ? "pt-0" : "",
        )}
      >
        {!shouldShowNavbar && (
          <div className="mb-3 ">
            <FilterBarLayout pages={pages} />
            {/* <SearchBox tabs={FilterOfPages}/> */}
          </div>
        )}
        {children}
      </main>
      <div className="w-full border-1 mt-10" />

      <Footer />
      {/* CUSTOM LOGIN AD POPUP */}
      {showAdPopup && !hasDismissed && (
        <PopLogin setHasDismissed={setHasDismissed} setShowAdPopup={setShowAdPopup} />
      )}
      <MobileNavWrapper content={<div className="flex h-14 items-center justify-around">
        <BottomNav />
      </div>} isMobile={isMobile} />
    </div>
  );
};


export default NavWrapper;




