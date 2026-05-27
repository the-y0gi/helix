"use client"
import { cn } from '@/lib/utils'
import React, { Suspense, useEffect, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import MainFramePage from '../../../../components/frame-pages/CabsFramePage'
import type { CityTrends } from '@/types'
import { MessageModal } from '@/components/messagemodal'
import { PageSkeleton } from '@/components/loader/skeleton'
import { useGetAllCabsQuery } from '@/services/cabs/cabs.queries'
import { CommonPagesStyles } from '@/styles/commonpages-styles'
import FilterBox from '@/components/filter-bar/fiter_box'
import { Cabs_Box_FilterBarValues, Search_box_values } from '@/constants/constants'
import SearchInput from '@/constants/search-box-components/search-input'
import { PersonStanding, MapPin, User, Calendar } from 'lucide-react'
import { useCabsStore } from '@/store/cabs.store'

import HotelCalendern from '@/components/navbar/filter-nav-bar/calander05'
import GuestSelector from '@/components/filter-bar/newui-selectedCounter'

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
  const { PickupCity, DropoffCity, setPickupCity, setDropoffCity, setDate, date, guests } = useCabsStore()
  const [filterQuery, setFilterQuery] = useState({
    PickupCity,
    DropoffCity,
  })

  const { data, isLoading, error } = useGetAllCabsQuery();
  // const { data: fr } = usegetCabServiceDetails('69e4e360922084a00f4d4a53');
  // const { data: d } = usegetCabCompanyDetails('69e4e255922084a00f4d4a4d');
  return (
    // <div className="px-2 md:px-0 w-full">

    //   <UnderConstruction cat='Cabs' />
    // </div>
    <div className={cn(" w-full", className)}>
      <ErrorBoundary fallback={<MessageModal title="Error" description="Something went wrong" />}>
        <Suspense fallback={<PageSkeleton />}>

          <FilterBox city={PickupCity} date={date} guests={guests} FilterBoxValues={{

            filterBlocks: [

              {
                label: "Booking Date",
                icon: Calendar,
                element: <HotelCalendern hookname='cabs' />,
                text: "Add dates",
              },
              {
                label: "Who",
                icon: User,
                element: <GuestSelector />,
                text: "Add Guests",
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
                title: "Japan",
                description: "Japan",
                link: "/search-box-videos/japan.mp4"
              }
            ]
          }} type="home" link="/cabs" directions={
            <div className="w-full flex gap-2">
              <div className="flex-1">
                <SearchInput Icon={MapPin} placeholder="Pickup Location" label="cab" value={PickupCity} setCity={(e) => { setPickupCity(e); setFilterQuery((prev) => ({ ...prev, PickupCity: e })); }} />
              </div>
              <div className="flex-1">
                <SearchInput Icon={MapPin} placeholder="Drop Location" label="cab" value={DropoffCity} setCity={(e) => { setDropoffCity(e); setFilterQuery((prev) => ({ ...prev, DropoffCity: e })); }} />
              </div>

            </div>

          } />

          <div className={cn(CommonPagesStyles, " md:flex-col  flex gap-4 w-full bg-background py-4 ")}>

            <MainFramePage
              type="cabs"
            // popularTrends={HotelPopularCites}
            />
          </div>
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}

export default Cabs