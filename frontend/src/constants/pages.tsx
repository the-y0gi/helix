
import { IconHome } from "@tabler/icons-react";

// import { Calendar05, PagesFilterBarButtons, SelectScrollable } from "@/pages/hotels/_components/filterbar/filter-bars";
import {
  AdventuresFilterBarValues,
  BikesFilterBarValues,
  CabsFilterBarValues,
  HotelFilterBarValues,
  ToursFilterBarValues,
  // Search_box_values,
  type Pages,
} from "./constants";
import { PagesFilterBarButtons } from "@/components/filter-bar/filterBar";
import FilterBox from "@/components/filter-bar/fiter_box";
// import {
//   Calendar05,
//   PagesFilterBarButtons,
//   SelectScrollable,
// } from "../pages/hotels/_components/filterbar/filter-bars";
// export type FilterOfPagesProps = {
//   type:type
//   link: string;
//   element?: React.ReactNode;
//   title?: string;
//    icon: LucideIcon;
//     filter_bar?: React.ReactNode;
// };
export const FilterOfPages: Pages[] = [
  {
    type: "filter",
    link: "/hotels/find",
    title: "Filter Hotels",
    icon: IconHome,
    filter_bar: (
      <PagesFilterBarButtons PagesFilterBarValues={HotelFilterBarValues} type="home" />
    ),

  },
  {
    type: "filter",
    link: "/bikes/find",
    title: "Filter Bikes",
    icon: IconHome,
    filter_bar: (
      <PagesFilterBarButtons PagesFilterBarValues={BikesFilterBarValues} type="home" />
    ),

  },
  {
    type: "filter",
    link: "/cabs/find",
    title: "Filter Cabs",
    icon: IconHome,
    filter_bar: (
      <PagesFilterBarButtons PagesFilterBarValues={CabsFilterBarValues} type="home" />
    ),

  },
  {
    type: "filter",
    link: "/tours/find",
    title: "Filter Tours",
    icon: IconHome,
    filter_bar: (
      <PagesFilterBarButtons PagesFilterBarValues={ToursFilterBarValues} type="home" />
    ),

  },
  {
    type: "filter",
    link: "/adventures/find",
    title: "Filter Adventures",
    icon: IconHome,
    filter_bar: (
      <PagesFilterBarButtons PagesFilterBarValues={AdventuresFilterBarValues} type="home" />
    ),

  },

];
export const pages: Pages[] = [

  {
    type: "home",
    link: "/hotels",
    icon: IconHome,
    iconUrl: "/nav-icons/hotel-logo.png",
    title: "Hotels",
    filter_bar: (
      <PagesFilterBarButtons PagesFilterBarValues={HotelFilterBarValues} link="/hotels/find" type="home" />
    ),

  },
  {
    type: "home",
    link: "/cabs",
    icon: IconHome,
    iconUrl: "/nav-icons/cabs-logo.png",
    title: "Cabs",
    filter_bar: (
      <PagesFilterBarButtons PagesFilterBarValues={CabsFilterBarValues} link="/cabs/find" type="home" />
    ),

  },

  {
    link: "/bikes",
    icon: IconHome,
    iconUrl: "/nav-icons/bikes-logo.png",
    title: "Bikes",
    filter_bar: (
      <PagesFilterBarButtons PagesFilterBarValues={CabsFilterBarValues} link="/bikes/find" type="home" />
    ),
    type: "home",

  },

  {
    type: "home",
    link: "/tours",
    icon: IconHome,
    iconUrl: "/nav-icons/tours-logo.png",
    title: "Tours",
    filter_bar: (
      <PagesFilterBarButtons PagesFilterBarValues={CabsFilterBarValues} link="/tours/find" type="home" />
    ),

  },
  {
    type: "home",
    link: "/adventures",
    icon: IconHome,
    iconUrl: "/nav-icons/adventures-logo.png",
    title: "Adventures",
    filter_bar: (
      <PagesFilterBarButtons PagesFilterBarValues={CabsFilterBarValues} link="/adventures/find" type="home" />
    ),

  },
  {
    type: "home",
    link: "/flights",
    icon: IconHome,
    iconUrl: "/nav-icons/flight-logo.png",
    title: "Flights",
    filter_bar: (
      <PagesFilterBarButtons PagesFilterBarValues={CabsFilterBarValues} link="/flights/find" type="home" />
    ),

  },
  {
    type: "home",
    link: "/buses",
    icon: IconHome,
    iconUrl: "/nav-icons/bus-logo.png",
    title: "Buses",
    filter_bar: (
      <PagesFilterBarButtons PagesFilterBarValues={CabsFilterBarValues} link="/buses/find" type="home" />
    ),

  },
  {
    type: "home",
    link: "/trains",
    icon: IconHome,
    iconUrl: "/nav-icons/train-logo.png",
    title: "Trains",
    filter_bar: (
      <PagesFilterBarButtons PagesFilterBarValues={CabsFilterBarValues} link="/trains/find" type="home" />
    ),

  },
];
