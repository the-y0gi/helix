import React, { useEffect } from 'react'
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
           {!showfav? 
           <Button asChild variant={"ghost"} className="w-17 sm:w-17 md:w-19 lg:w-23 xl:w-25 text-xs py-0  bg-background/10 shadow-sm ">
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
              {/* <MenuBar  /> */}
              <ProfilePic/>
            </Suspense>}
            <Suspense>
              <AppPrefrence />
            </Suspense>
          </div>
  )
}

export default TopRight





import Image from "next/image";
import { useCurrentUser } from '@/services/hotel/querys';
import { useNextGoingRoute } from '@/hooks/auth/route.hook';
import { useIsMobile } from '@/hooks/use-mobile';
import { Skeleton } from '../ui/skeleton';
import { toast } from 'sonner';

const ProfilePic = () => {
  const { data: user, isLoading, refetch } = useCurrentUser();
  const pathname = usePathname();
  const { goWithAuth } = useNextGoingRoute();
  const isMobile = useIsMobile()
  const isLoggedIn = !!user?.data;
  const router = useRouter()
  const handleNavigate = (path: string) => {
    if (pathname === path) return;
    goWithAuth(path, isLoggedIn);
    toast.success("Redirecting...");
  };

  if (isLoading) {
    return <Skeleton className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 rounded-full" />;
  }
  if(!user)return null
  return (
     <Button
     onClick={()=>RouterPush(router , '/profile')}
              variant="ghost"
              // Reduced size on mobile (h-9), standard on desktop (sm:h-10)
              className="relative h-8 w-8 sm:h-8 sm:w-8 md:h-10 md:w-10   rounded-full border-2 border-transparent hover:border-orange-400 p-0 transition-all duration-300"
            >
              <div className="relative h-full w-full overflow-hidden rounded-full border border-border">
                <Image
                  src={user?.data?.avatar || "/icons/user.png"}
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              </div>
            </Button>
  )
}





