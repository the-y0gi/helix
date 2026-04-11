"use client";
import { TabsNav } from "../ui/tabs-nav-aty";
import { FilterOfPages, pages } from "@/constants/pages";
import { MobileNav } from "./mobile-nav/sheet-nav";
import { Footer } from "../footer/FFooter";
import { FindTabsNav } from "./filter-nav-bar/find-filter-bars";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import LOGO from "./logo";
import { useIsMobile } from "@/hooks/use-mobile";
import { IconArrowRampRight } from "@tabler/icons-react";
import { Button } from "../ui/button";
import { ChevronRight, X } from "lucide-react";
import { SheetNavigation } from "@/app/(home)/hotels/find/_components/sheetNavigation";
import SearchBox from "@/app/(home)/hotels/search-";
import FilterBarLayout from "../filter-bar/filter-bar-layout";
import { Sign_in_hover } from "../auth/_components/sign-in-hover";
import { toast } from "sonner";
import Link from "next/link";

const pagesNames = pages.map((page) => page.link.split("/")[1]);
const NavWrapper = ({ children }: { children: React.ReactNode }) => {
  const location = usePathname();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false)
  const [showAdPopup, setShowAdPopup] = useState(false);
  const [hasDismissed, setHasDismissed] = useState(false);
  const router = useRouter()
  const showChevronRight = location.includes("/hotels/find")
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
          "fixed top-0 left-0 z-50 w-full bg-card    flex flex-col justify-center bg-gradient-to-br from-zinc-100 to-transparent dark:bg-gradient-to-bl dark:from-zinc-700  border-b border-gray-300 dark:border-gray-700 ",
          "h-auto",
          "bg-background",
          isMobile ? "bg-transparent border-none static" : ""

        )}
      >
        <div className="flex  justify-between py-3 md:px-5  sm:pr-3 px-2 h-full">

          <LOGO />


          {(
            <div className="hidden md:flex flex-col items-center gap-[5px] h-full md:block">
              {shouldShowNavbar ? (
                <div className="md:w-[485px] lg:w-[585px] ">

                  <FindTabsNav mobile={false} tabs={FilterOfPages} />
                </div>
              ) : (
                <TabsNav mobile={false} tabs={pages} />
              )}
            </div>
          )}
          <TopRight isMobile={isMobile}/>

         
        </div>
        {/* {shouldShowNavbar && showChevronRight && <div className="block xl:hidden h-10 w-full    ">
          <SheetNavigation
            setOpen={setOpen}
            content={
              <Button variant={"ghost"} className="border-r">
                {<ChevronRight className="h-4 w-4" />}
              </Button>
            }
          />
        </div>} */}
      </div>

      <main
        className={cn(
          "flex-1 bg-card",
          shouldShowNavbar ? "pt-21" : "pt-29",
          isMobile ? "pt-0" : "",
        )}
      >
        {!shouldShowNavbar && (
          <div className=" ">
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
        <div className="fixed bottom-24 z-60 right-4 md:bottom-10 md:right-10 w-[280px] md:w-[320px] bg-card border shadow-2xl rounded-2xl overflow-hidden flex flex-col animate-in slide-in-from-right-8 fade-in duration-1200">
          <button
            onClick={() => {
              setHasDismissed(true);
              setShowAdPopup(false);
            }}
            className="absolute z-61 top-2 right-2  p-1 bg-black/40 text-white rounded-full hover:bg-black/60 backdrop-blur-sm transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          {/* Reduced height from h-34 to h-24 */}
          <div className="h-24 md:h-34 bg-muted relative w-full">
            <img
              src="/story/key.png"
              alt="Login to unlock features"
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-3">
              <h3 className="font-semibold text-base text-white leading-tight">
                Unlock the best experience
              </h3>
            </div>
          </div>

          {/* Reduced padding and gaps */}
          <div className="p-3 flex flex-col gap-2">
            <p className="text-xs text-foreground/80 leading-normal">
              Log in to save favorites, access deals, and manage bookings effortlessly.
            </p>
            {isMobile ? <Link href={"/login"}><Button
              size="sm"
              className="w-full h-8 mt-1 text-xs"
            >
              Log In Now
            </Button></Link> : <Sign_in_hover
              tag="Log-in"
              forLike={{
                content: (
                  <Button
                    size="sm"
                    className="w-full h-8 mt-1 text-xs"
                  >
                    Log In Now
                  </Button>
                ),
                type: "nextRoute",
                do: "/profile"
              }}
            />}
          </div>
        </div>
        // <div className=" fixed bottom-4 right-4 md:bottom-10 md:right-10  w-[320px] bg-card border shadow-2xl rounded-2xl overflow-hidden flex flex-col animate-in slide-in-from-right-8 fade-in duration-1200">
        //   <button
        //     onClick={() => {
        //       setHasDismissed(true);
        //       setShowAdPopup(false);
        //     }}
        //     className="absolute top-2 right-2 z-10 p-1.5 bg-black/40 text-white rounded-full hover:bg-black/60 backdrop-blur-sm transition-colors"
        //   >
        //     <X className="w-4 h-4" />
        //   </button>

        //   <div className="h-34 bg-muted relative w-full">
        //     <img
        //       src="/key.png"
        //       alt="Login to unlock features"
        //       className="w-full h-full object-cover object-top"
        //     />

        //     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
        //       <h3 className="font-semibold text-lg text-white leading-tight">
        //         Unlock the best experience
        //       </h3>
        //     </div>
        //   </div>
        //   <div className="p-4 flex flex-col gap-3">
        //     <p className="text-sm text-foreground/80  ">Log in to save your favorite hotels, access exclusive deals, and manage your bookings effortlessly.</p>
        //     <Sign_in_hover
        //       forLike={{
        //         content: (
        //           <Button
        //             size="sm"
        //             className="w-full mt-2"

        //           >
        //             Log In Now
        //           </Button>
        //         ),
        //         type: "nextRoute",
        //         do: "/profile"
        //       }}
        //     />
        //   </div>
        // </div>
      )}
      {/* CUSTOM MOBILE BOTTOM BAR (Instagram/YouTube Style) */}
      {isMobile &&  (
        <nav className="fixed bottom-0 left-0 right-0 z-[100]  bg-background rounded-tl-3xl rounded-tr-3xl  dark:border-zinc-800 px-2 pb-safe shadow-[0_-1px_10px_rgba(0,0,0,0.05)]">
          <div className="flex h-full items-center justify-around ">
            <BottomNav/>
            
          </div>
        </nav>
      )}
    </div>
  );
};

export default NavWrapper;

import React from 'react';
import { Home, Search, Percent, History, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNextGoingRoute } from "@/hooks/auth/route.hook";
import { useCurrentUser } from "@/services/hotel/querys";
import { RouterPush } from "../RouterPush";
import TopRight from "./topRight";
import { FloatingDockFeatues } from "./not-in-use-features-bar";

export function BottomNav() {
  const { data: user, isLoading, refetch } = useCurrentUser();
    const pathname = usePathname();
    const { goWithAuth } = useNextGoingRoute();
    const isMobile = useIsMobile()
    const isLoggedIn = !!user?.data;
    const router = useRouter()
  const iconSize = 26;
  const labelStyle = "text-[11px] font-medium text-white mt-1";
  const itemStyle = "flex flex-col items-center justify-center flex-1";

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-white/10 px-2 py-3">
      <nav className="flex items-center justify-around max-w-lg mx-auto">
        
        {/* Home */}
        <motion.button whileTap={{ scale: 0.9 }} className={itemStyle} onClick={()=>RouterPush(router , `/hotels`)}>
          <Home size={iconSize} color="white" fill="white" />
          <span className={labelStyle}>Home</span>
        </motion.button>

        {/* Search */}
        <motion.button whileTap={{ scale: 0.9 }} className={itemStyle} 
        // onClick={()=>RouterPush(router , `/login`)}
        >
          <Search size={iconSize} color="white" strokeWidth={2.0} />
          <span className={labelStyle}>Search</span>
        </motion.button>

        {/* Offers */}
        <motion.button whileTap={{ scale: 0.9 }} className={itemStyle}
        //  onClick={()=>RouterPush(router , `/login`)}
         >
          <Percent size={iconSize} color="white" strokeWidth={2.0} />
          <span className={labelStyle}>Offers</span>
        </motion.button>

        {/* My Bookings */}
        {isLoggedIn&&<motion.button whileTap={{ scale: 0.9 }} className={itemStyle} onClick={()=>RouterPush(router , `/profile?tab=all`)}>
          <History size={iconSize} color="white" strokeWidth={2.0} />
          <span className={labelStyle}>Bookings</span>
        </motion.button>}

        {/* You */}
       
         {!isLoggedIn ? (
                    !isMobile ? (
                      <Sign_in_hover
                        tag="Log-in"
                        variant="ghost"
                        forLike={{
                          content: (
                            <div className="flex w-full items-center justify-between px-2 py-1 text-sm transition-colors hover:text-orange-500">
                              <div className="flex items-center gap-2">
          <User size={iconSize} color="white" fill="white" />
          <span className={labelStyle}>You</span>
                              </div>
                              <ChevronRight className="h-3 w-3 opacity-50" />
                            </div>
                          ),
                          type: "nextRoute",
                          do: "/profile",
                          id: "/profile",
                        }}
                      />
                    ) : (
                       <motion.button whileTap={{ scale: 0.9 }} className={itemStyle} onClick={()=>RouterPush(router , `/login`)}>
                        <User size={iconSize} color="white" fill="white" />
          <span className={labelStyle}>You</span>
                       </motion.button>
                    )
                  ) : (
                    <motion.button whileTap={{ scale: 0.9 }} className={itemStyle} onClick={()=>RouterPush(router , `/profile`)}>
          <User size={iconSize} color="white" fill="white" />
          <span className={labelStyle}>You</span>
        </motion.button>
                  )}

      </nav>
    </div>
  );
}