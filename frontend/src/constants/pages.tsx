
import { IconHome } from "@tabler/icons-react";

// import { Calendar05, PagesFilterBarButtons, SelectScrollable } from "@/pages/hotels/_components/filterbar/filter-bars";
import {
  CabsFilterBarValues,
  HotelFilterBarValues,
  type Pages,
} from "./constants";
import { PagesFilterBarButtons } from "@/components/filter-bar/filterBar";
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
    type:"filter",
    link: "/hotels/find",
    title: "Filter Hotels",
    icon:IconHome,
    filter_bar:(
      <PagesFilterBarButtons PagesFilterBarValues={HotelFilterBarValues}  type="home" />
    )
  },
];
export const pages: Pages[] = [
  
  {
    type: "home",
    link: "/hotels",
    icon: IconHome,
    title: "Hotels",
    filter_bar: (
      <PagesFilterBarButtons PagesFilterBarValues={HotelFilterBarValues} link="/hotels/find" type="home"/>
    ),
  },
  {
    type: "home",
    link: "/cabs",
    icon: IconHome,
    title: "Cabs",
    filter_bar: (
      <PagesFilterBarButtons PagesFilterBarValues={CabsFilterBarValues} link="/cabs/find" type="home"/>
    ),
  },

  {
    link: "/bikes",
    icon: IconHome,
    title: "Bikes",
    filter_bar: (
      <PagesFilterBarButtons PagesFilterBarValues={CabsFilterBarValues} link="/bikes/find" type="home"/>
    ),
    type: "home",
  },
  {
    type: "home",
    link: "/adventures",
    icon: IconHome,
    title: "Adventures",
    filter_bar: (
      <PagesFilterBarButtons PagesFilterBarValues={CabsFilterBarValues} link="/adventures/find" type="home"/>
    ),
  },
  {
    type: "home",
    link: "/tours",
    icon: IconHome,
    title: "Tours",
    filter_bar: (
      <PagesFilterBarButtons PagesFilterBarValues={CabsFilterBarValues} link="/tours/find" type="home"/>
    ),
  },
];
