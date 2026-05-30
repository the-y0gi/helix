'use client'
import UnderConstruction from '@/components/blankpages/contruction'
import FilterBox from '@/components/filter-bar/fiter_box'
import MainFramePage from '@/components/frame-pages/ToursFramePage'
import { PageSkeleton } from '@/components/loader/skeleton'
import { MessageModal } from '@/components/messagemodal'
import { Search_box_values, Tours_Box_FilterBarValues } from '@/constants/constants'
import { cn } from '@/lib/utils'
import { CommonPagesStyles } from '@/styles/commonpages-styles'
import React, { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { HotelPopularCites } from '../buses/page'
import SearchInput from '@/constants/search-box-components/search-input'
import { Calendar, MapPin, PersonStanding } from 'lucide-react'
import { useToursStore } from '@/store/tours.store'
import HotelCalendern from '@/components/navbar/filter-nav-bar/calander05'

const page = () => {
  const { city, setCity, date, setDate, guests } = useToursStore()

  return (
    // <div className="px-2 md:px-0  w-full">

    //   <UnderConstruction cat='Tours' />
    // </div>
    <div className={cn(" w-full")}>
      <ErrorBoundary fallback={<MessageModal title="Error" description="Something went wrong" />}>
        <Suspense fallback={<PageSkeleton />}>

          <FilterBox city={city} date={date} guests={guests} FilterBoxValues={{

            filterBlocks: [

              {
                label: "Booking Date",
                icon: Calendar,
                element: <HotelCalendern hookname='tours' />,
                text: "Add dates",
              },


            ],
            videos: [
              {
                title: "Happy",
                description: "Happy",
                link: "/search-box-videos/happy.mp4"
              },
              {
                title: "Road",
                description: "Road",
                link: "/search-box-videos/road.mp4"
              },
              {
                title: "Hot Air",
                description: "Hot Air",
                link: "/search-box-videos/hot-air.mp4"
              }
            ]
          }} type="home" link="/tours" directions={
            <div className="w-full flex gap-2">
              <div className="flex-1">
                <SearchInput Icon={MapPin} placeholder="Search for tours" label="tour" value={city} setCity={(e) => { setCity(e) }} />
              </div>

            </div>
          } />

          <div className={cn(CommonPagesStyles, " md:flex-col  flex gap-4 w-full bg-background py-4 ")}>

            <MainFramePage
              type="tours"
              popularTrends={HotelPopularCites}
            />
          </div>
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}

export default page

