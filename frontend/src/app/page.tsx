'use client'
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton"
import { PageSkeleton } from "@/components/loader/skeleton";
import { useCurrentUser } from "@/services/hotel/querys";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
export default function Home() {
  const router = useRouter()

  const {data} = useCurrentUser();
    useEffect(() => {
      if(data){
        router.replace("/hotels")
      }else if(localStorage.getItem("accessToken") === null){
        router.replace("/hotels")
        toast(
          <div className="flex flex-col gap-2">
              <span>Please login for better experience.</span>
              <Button
                size="sm"
                onClick={() => router.replace("/profile")}
              >
                Login
              </Button>
            </div>
          )
        
        
      }
    }, [data])
   return <PageSkeleton />
  
}

interface HotelCardsLoaderProps {
  cards?: number
}



interface HotelCardsLoaderProps {
  cards?: number;
}

