'use client'
import { TabsNav } from "../ui/tabs-nav-aty";
import { FilterOfPages, pages } from "@/constants/pages";
import { NavMenuBar } from "../menubar";
import { MobileNav } from "./mobile-nav/sheet-nav";
import { Footer } from "../footer/FFooter";
import { FindTabsNav } from "./filter-nav-bar/find-filter-bars";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
const pagesNames = pages.map((page) => page.link.split("/")[1]);
const NavWrapper = ({children}:{children:React.ReactNode}) => {
  const location = usePathname();

const segments = location.split("/").filter(Boolean);

const shouldShowNavbar =! (((segments.length === 1 ) && pagesNames.includes(segments[0])) || segments.length === 0);
 
  return (
    <div className="min-h-screen flex flex-col">
      <div className={cn("fixed top-0 left-0 z-50 w-full bg-card   flex flex-col justify-center", shouldShowNavbar?"h-30":"h-40")}>
        <div className="flex items-center justify-between py-3 px-9">
          <MobileNav direction="left"  tabsChildren={shouldShowNavbar?<FindTabsNav mobile={false} tabs={FilterOfPages} />:<TabsNav mobile={false} tabs={pages} />}/>

          <div>logo</div>

          <div className="hidden md:flex flex-col items-center gap-[5px] h-full justify-evenly">
              {shouldShowNavbar?<FindTabsNav mobile={false} tabs={FilterOfPages} />:<TabsNav mobile={false} tabs={pages} />}
            
          </div>

          <div className="flex gap-10 px-1">
            <Suspense>
                            <NavMenuBar />
                          </Suspense>
          </div>
        </div>
      </div>

      <main className={cn("flex-1",shouldShowNavbar?"pt-34":"pt-44")}>
        {children}
      </main>
      <div className="w-full border-1 mt-10"/>

      <Footer />
    </div>
  );
};

export default NavWrapper;
