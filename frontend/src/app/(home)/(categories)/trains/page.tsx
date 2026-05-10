

import { cn } from '@/lib/utils'
import React, { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import MainFramePage from '../../../../components/frame-pages/HotelFramePage'
import type { CityTrends } from '@/types'
import { MessageModal } from '@/components/messagemodal'
import { PageSkeleton } from '@/components/loader/skeleton'
import UnderConstruction from '@/components/blankpages/contruction'



export const HotelPopularCites: CityTrends[] = [
  {
    name: "cabs",
    tagline: "Premium cabs services",
    tabs: [
      { name: "Primium" },
      { name: "Luxury" },
      { name: "Economy" },
      { name: "Prime Luxury" },
      {
        name: "Elite"
      }
    ]

  },
  {
    name: "Bangalore",
    tagline: "Available feets near you",
    tabs: [
      { name: "Ecnomy" },
      { name: "Mini" },
      { name: "Sedan" },
      { name: "Prime" },
      {
        name: "Ececutive"
      }
    ]
  },
  {
    name: "south goa",
    tagline: "Available feets near you"
  },
  {
    name: "Bangalore",
    tagline: "Available feets near you"
  },
  {
    name: "south goa",
    tagline: "Available feets near you"
  },
  {
    name: "Bangalore",
    tagline: "Available feets near you"
  },
]
const Cabs = ({ className }: { className?: string }) => {
  return (
    <div className="px-2 md:px-0 w-full">

      <UnderConstruction cat='Trains' />
    </div>
    // <div className={cn(" w-full")}>
    //       <ErrorBoundary fallback={<MessageModal title="Error" description="Something went wrong" />}>
    //         <Suspense fallback={<PageSkeleton />}>

    //           <FilterBox FilterBoxValues={Search_box_values[7]} type="home" link="/bikes" />

    //           <div className={cn(CommonPagesStyles, " md:flex-col  flex gap-4 w-full bg-background py-4 ")}>

    //             <MainFramePage
    //               type="bikes"
    //               popularTrends={HotelPopularCites}
    //             />
    //           </div>
    //         </Suspense>
    //       </ErrorBoundary>
    //     </div>
  )
}

export default Cabs
