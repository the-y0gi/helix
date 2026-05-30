'use client'

import { ErrorBoundary } from "react-error-boundary";
import { MessageModal } from "@/components/messagemodal";
import { Suspense, useState } from "react";
import FilterBox from "@/components/filter-bar/fiter_box";
import { PageSkeleton } from "@/components/loader/skeleton";
import { Bikes_Box_FilterBarValues, Search_box_values } from "@/constants/constants";
import { cn } from "@/lib/utils";
import { CommonPagesStyles } from "@/styles/commonpages-styles";
import { HotelPopularCites } from "../buses/page";
import MainFramePage from "@/components/frame-pages/BikesFramePage";
import SearchInput from "@/constants/search-box-components/search-input";
import { Calendar, MapPin, PersonStanding } from "lucide-react";
import { useBikesStore } from "@/store/bikes.store";
import HotelCalendern from '@/components/navbar/filter-nav-bar/calander05'
const page = () => {
  const { city, setCity, setDate, date, guests } = useBikesStore()
  // const [filterQuery, setFilterQuery] = useState(city)

  localStorage.removeItem("nextRoute")
  localStorage.removeItem("like")
  return (
    // <div className="px-2 md:px-0 w-full">
    //   <UnderConstruction cat='Bikes' />
    // </div>



    <div className={cn(" w-full")}>
      <ErrorBoundary fallback={<MessageModal title="Error" description="Something went wrong" />}>
        <Suspense fallback={<PageSkeleton />}>

          <FilterBox city={city} date={date} guests={guests} FilterBoxValues={{


            filterBlocks: [

              {
                label: "Booking Date",
                icon: Calendar,
                element: <HotelCalendern hookname="bikes" />,
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
                title: "Japan",
                description: "Japan",
                link: "/search-box-videos/japan.mp4"
              }]
          }} type="home" link="/bikes" directions={
            <div className="w-full flex gap-2">
              <div className="flex-1">
                <SearchInput Icon={MapPin} placeholder="Pickup Location" label="bike" value={city} setCity={(e) => { setCity(e); }} />
              </div>

            </div>

          } />

          <div className={cn(CommonPagesStyles, " md:flex-col  flex gap-4 w-full bg-background py-4 ")}>

            <MainFramePage
              type="bikes"
            // popularTrends={HotelPopularCites}
            />
          </div>
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}

export default page