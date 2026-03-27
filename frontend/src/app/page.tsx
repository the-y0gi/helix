'use client'
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton"
import { PageSkeleton } from "@/components/loader/skeleton";
import { useCurrentUser } from "@/services/hotel/querys";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import LogoLoader from "@/components/loader/logoloader";
export default function Home() {
  const router = useRouter()

  const { data } = useCurrentUser();
  useEffect(() => {
    if (data) {
      router.replace("/hotels")
    } else if (localStorage.getItem("accessToken") === null) {
      router.replace("/hotels")


    }
  }, [data])
  return <LogoLoader />

}


