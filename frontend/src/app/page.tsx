'use client'
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    router.push('/hotels')
  }, [])
  return (
    <HotelCardsLoader />
  );
}

interface HotelCardsLoaderProps {
  cards?: number
}

const HotelCardsLoader = ({ cards = 8 }: HotelCardsLoaderProps) => {
  return (
    <div className=" space-y-6">
      <style>{`
        @keyframes shimmer {
          0% { background-position: -800px 0; }
          100% { background-position: 800px 0; }
        }
        .shimmer {
          background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
          background-size: 800px 100%;
          animation: shimmer 1.5s infinite linear;
          border-radius: inherit;
        }
      `}</style>

      <div className="h-36 w-full rounded-md shimmer rounded-2xl" />

      <div className="px-38">
        <div className="h-16 w-100 rounded-md shimmer rounded-2xl" />
      </div>
      <div className="flex gap-4 overflow-hidden flex-wrap px-38">

        {Array(cards)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="w-[250px] rounded-2xl overflow-hidden border border-gray-100 shadow-sm flex-shrink-0"
            >
              <div className="h-[255px] w-full shimmer rounded-2xl" />

              <div className="p-3 space-y-3">
                <div className="h-5 w-[160px] shimmer rounded-md" />
                <div className="h-4 w-[120px] shimmer rounded-md" />
                <div className="h-5 w-[80px] shimmer rounded-md" />
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
