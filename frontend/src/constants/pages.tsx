
import { IconHome } from "@tabler/icons-react";

// import { Calendar05, PagesFilterBarButtons, SelectScrollable } from "@/pages/hotels/_components/filterbar/filter-bars";
import {
  CabsFilterBarValues,
  HotelFilterBarValues,
  Search_box_values,
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
    home_filter_box: (
      <FilterBox FilterBoxValues={Search_box_values[0]} type="home" link="/hotels" />
    )
  },
];
export const pages: Pages[] = [

  {
    type: "home",
    link: "/hotels",
    icon: IconHome,
    iconUrl: "/hotel-logo.png",
    title: "Hotels",
    filter_bar: (
      <PagesFilterBarButtons PagesFilterBarValues={HotelFilterBarValues} link="/hotels/find" type="home" />
    ),
    home_filter_box: (
      <FilterBox FilterBoxValues={Search_box_values[0]} type="home" link="/hotels" />
    )
  },
  {
    type: "home",
    link: "/cabs",
    icon: IconHome,
    iconUrl: "/cabs-logo.png",
    title: "Cabs",
    filter_bar: (
      <PagesFilterBarButtons PagesFilterBarValues={CabsFilterBarValues} link="/cabs/find" type="home" />
    ),
    home_filter_box: (
      <FilterBox FilterBoxValues={Search_box_values[1]} type="home" link="/cabs" />
    )
  },

  {
    link: "/bikes",
    icon: IconHome,
    iconUrl: "/bikes-logo.png",
    title: "Bikes",
    filter_bar: (
      <PagesFilterBarButtons PagesFilterBarValues={CabsFilterBarValues} link="/bikes/find" type="home" />
    ),
    type: "home",
    home_filter_box: (
      <FilterBox FilterBoxValues={Search_box_values[2]} type="home" link="/bikes" />
    )
  },

  {
    type: "home",
    link: "/tours",
    icon: IconHome,
    iconUrl: "/tours-logo.png",
    title: "Tours",
    filter_bar: (
      <PagesFilterBarButtons PagesFilterBarValues={CabsFilterBarValues} link="/tours/find" type="home" />
    ),
    home_filter_box: (
      <FilterBox FilterBoxValues={Search_box_values[3]} type="home" link="/tours" />
    )
  },
  {
    type: "home",
    link: "/adventures",
    icon: IconHome,
    iconUrl: "/adventures-logo.png",
    title: "Adventures",
    filter_bar: (
      <PagesFilterBarButtons PagesFilterBarValues={CabsFilterBarValues} link="/adventures/find" type="home" />
    ),
    home_filter_box: (
      <FilterBox FilterBoxValues={Search_box_values[4]} type="home" link="/adventures" />
    )
  },
];
