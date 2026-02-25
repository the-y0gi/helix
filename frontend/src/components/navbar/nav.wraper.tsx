"use client";
import { TabsNav } from "../ui/tabs-nav-aty";
import { FilterOfPages, pages } from "@/constants/pages";
import { MobileNav } from "./mobile-nav/sheet-nav";
import { Footer } from "../footer/FFooter";
import { FindTabsNav } from "./filter-nav-bar/find-filter-bars";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import LOGO from "./logo";
import { useIsMobile } from "@/hooks/use-mobile";
const MenuBar = dynamic(
  () => import("../menubar").then((mod) => ({ default: mod.MenuBar })),
  {
    ssr: false,
  },
);
const pagesNames = pages.map((page) => page.link.split("/")[1]);
const NavWrapper = ({ children }: { children: React.ReactNode }) => {
  const location = usePathname();
  const isMobile = useIsMobile();
  const segments = location.split("/").filter(Boolean);

  const shouldShowNavbar = !(
    (segments.length === 1 && pagesNames.includes(segments[0])) ||
    segments.length === 0
  );
  const mobileHeight = isMobile ? "h-20" : "h-40";
  // const navigate = useRouter();

  return (
    <div className=" flex flex-col   ">
      <div
        className={cn(
          "fixed top-0 left-0 z-50 w-full bg-card    flex flex-col justify-center bg-gradient-to-br from-zinc-100 to-transparent dark:bg-gradient-to-br dark:from-zinc-700 dark:to-transparent backdrop-blur-lg border-b border-gray-300 dark:border-gray-700 ",
          "",
          shouldShowNavbar ? "h-30" : "h-40",
          mobileHeight,
        )}
      >
        <div className="flex items-center justify-between py-3 md:px-9 px-2 ">
          {/* <MobileNav
            direction="left"
            tabsChildren={
              shouldShowNavbar ? (
                <FindTabsNav mobile={false} tabs={FilterOfPages} />
              ) : (
                <TabsNav mobile={false} tabs={pages} />
              )
            }
          /> */}

          <LOGO />

          {!isMobile && (
            <div className="hidden md:flex flex-col items-center gap-[5px] h-full justify-evenly">
              {shouldShowNavbar ? (
                <FindTabsNav mobile={false} tabs={FilterOfPages} />
              ) : (
                <TabsNav mobile={false} tabs={pages} />
              )}
            </div>
          )}

          <div className="flex gap-10 px-1">
            <Suspense>
              <MenuBar />
            </Suspense>
          </div>
        </div>
      </div>

      <main
        className={cn(
          "flex-1",
          shouldShowNavbar ? "pt-34" : "pt-44",
          isMobile ? "pt-24" : "",
        )}
      >
        {children}
      </main>
      <div className="w-full border-1 mt-10" />

      <Footer />
       {/* CUSTOM MOBILE BOTTOM BAR (Instagram/YouTube Style) */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 z-[100] h-[122px] bg-transparent  dark:border-zinc-800 px-2 pb-safe shadow-[0_-1px_10px_rgba(0,0,0,0.05)]">
          <div className="flex h-full items-center justify-around">
            {shouldShowNavbar ? (
                <FindTabsNav mobile={false} tabs={FilterOfPages} />
              ) : (
                <TabsNav mobile={false} tabs={pages} />
              )}
          </div>
        </nav>
      )}
    </div>
  );
};

export default NavWrapper;
