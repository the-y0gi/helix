'use client'
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import { ErrorBoundary } from 'react-error-boundary'
import AdventureFramePage from "@/components/frame-pages/AdventuresFramePage";
import type { Categories, CityTrends } from "@/types";
import { PageSkeleton } from "@/components/loader/skeleton";
import { MessageModal } from "@/components/messagemodal";
import { useIsMobile } from "@/hooks/use-mobile";
import AdventureSection from "./_components/activityDummy";
import { OnlyCarousel } from "@/components/carousel/onlyColursel";
import { PopularDestinationCarousel } from "@/components/carousel/tabs-carousel";
import UnderConstruction from "@/components/blankpages/contruction";
import { CommonPagesStyles } from "@/styles/commonpages-styles";
import FilterBox from "@/components/filter-bar/fiter_box";
import { Adventures_Box_FilterBarValues, Search_box_values } from "@/constants/constants";
import { Calendar, MapPin, PersonStanding } from "lucide-react";
import SearchInput from "@/constants/search-box-components/search-input";
import { useAdventureStore } from "@/store/adventure.store";
import HotelCalendern from '@/components/navbar/filter-nav-bar/calander05'
import { ImagesSliderDemo } from "@/components/addimage/middle-ads-image";
export type AdventuresFramePageProps = {
  className?: string;
  type: Categories;
  popularTrends?: CityTrends[];
};
export interface HotelData {
  data: hoteldata[];
}
export type hoteldata = {
  _id: string,
  name: string,
  city: string,
  image: string,
}

const Hotel: React.FC<AdventuresFramePageProps> = ({ className }) => {
  const { city, setCity, setDate, date, guests } = useAdventureStore()
  localStorage.removeItem("nextRoute")
  localStorage.removeItem("like")
  const ismobile = useIsMobile()


  return (
    // <div className="px-2 md:px-0  w-full">
    //   <UnderConstruction cat='Adventures'/>
    // </div>
    <div className={cn(" w-full ", ismobile ? "" : "", className)}>
      <ErrorBoundary fallback={<MessageModal title="Error" description="Something went wrong" />}>
        <Suspense fallback={<PageSkeleton />}>
          <FilterBox city={city} date={date} guests={guests} FilterBoxValues={{

            filterBlocks: [
              {
                label: "Booking Date",
                icon: Calendar,
                element: <HotelCalendern hookname="adventures" />,
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
              },
              {
                title: "Japan",
                description: "Japan",
                link: "/search-box-videos/japan.mp4"
              }]
          }} type="home" link="/adventures" directions={
            <div className="w-full flex gap-2">
              <div className="flex-1">
                <SearchInput Icon={MapPin} placeholder="Search for adventures" label="adventure" value={city} setCity={(e) => { setCity(e); }} />
              </div>

            </div>

          } />

          <div className={cn(CommonPagesStyles, "  gap-4 w-full bg-background py-4 ")}>


            <AdventureSection />
            {(
              <div className="px-2 md:px-0">
                <ImagesSliderDemo images={
                  ['/adventures/ads1.jpg', '/adventures/ads2.jpg', '/adventures/ads3.jpg']
                } title="Discover Asia" subtitle="Book now" description="Book your next adventure now" link="/adventures/find" />
              </div>
            )}
            <AdventureSection />
            <AdventureSection />

            {/* <AdventureFramePage
              // popularTrends={HotelPopularCites}
              type="adventures"




            /> */}
          </div>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default Hotel;
