import React from 'react'
import { Button } from '../ui/button'
import { Suspense } from 'react'
import dynamic from 'next/dynamic';
import { usePathname, useRouter } from 'next/navigation';
import { BookHeart } from 'lucide-react';
import { TypewriterEffect } from '../ui/typewriter-effect';
import { FlipWords } from '../ui/flip-words';
import { RouterPush } from '../RouterPush';
import { useQueryState } from 'nuqs';
const MenuBar = dynamic(
  () => import("../menubar").then((mod) => ({ default: mod.MenuBar })),
  {
    ssr: false,
  },
);
const AppPrefrence = dynamic(
  () => import("../menubar").then((mod) => ({ default: mod.AppPrefrence })),
  {
    ssr: false,
  },
);


const TopRight = ({isMobile}:{isMobile:boolean}) => {
  const pathname= usePathname()
  const showfav = pathname.endsWith('profile')
  const words = ["WishList", "saved", "plans"];
  const router = useRouter()
  const [tab, setTab] = useQueryState("tab", {
    defaultValue: "/",
    shallow: true,
  });
   
    
 
  return (
     <div className="flex gap-1 md:gap-1.5 px-2 px-1 h-full items-center self-center">
           {!showfav? <Button asChild variant={"secondary"} className="w-15 sm:w-17 md:w-19 lg:w-23 xl:w-25 text-xs py-0 px-2 ">
              <a href="https://hilexa-vendor.vercel.app/login" target="_blank" rel="noopener noreferrer" className="cursor-pointer font-bold">Get Listed</a>
            </Button>:(
              <Button onClick={()=>{
                setTab('wishlist')
                
              }}  variant={"secondary"} className="w-24 px-0 sm:px-2  text-xs py-0 flex gap-2">
                <BookHeart className='text-primary' />
                 <FlipWords words={words} className='text-xs' /> <br />
              </Button>
            )}
            {!isMobile&&<Suspense>
              <MenuBar  />
            </Suspense>}
            <Suspense>
              <AppPrefrence />
            </Suspense>
          </div>
  )
}

export default TopRight




