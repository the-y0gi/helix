'use client'
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    router.push('/hotels')
  }, [])
  return (
    <p>loading wait...</p>
  );
}

interface HotelCardsLoaderProps {
  cards?: number
}

import { Skeleton } from "@/components/ui/skeleton"

interface HotelCardsLoaderProps {
  cards?: number;
}

