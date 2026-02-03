'use client'
import { usePathname } from 'next/navigation';
import React, { Suspense } from 'react'
import { Footer } from '../footer/FFooter';
import { cn } from '@/lib/utils';
import { NavMenuBar } from '../menubar';

type Props = {}

const PersonalNavWroper = ({children}:{children:React.ReactNode}) => {
  
  
   
    return (
      <div className="min-h-screen flex flex-col">
        <div className={cn("fixed top-0 left-0 z-50 w-full bg-card   flex flex-col justify-center")}>
          <div className="flex items-center justify-between py-3 px-9">
  
            <div>logo</div>
  
            <div className="hidden md:flex flex-col items-center gap-[5px] h-full justify-evenly">
                {/* {shouldShowNavbar?<FindTabsNav mobile={false} tabs={FilterOfPages} />:<TabsNav mobile={false} tabs={pages} />} */}
              
            </div>
  
            <div className="flex gap-10 px-1">
              <Suspense>
                <NavMenuBar />
              </Suspense>
            </div>
          </div>
        </div>
  
        <main className={cn("flex-1")}>
          {children}
        </main>
        <div className="w-full border-1 mt-10"/>
  
        <Footer />
      </div>
    );
}

export default PersonalNavWroper