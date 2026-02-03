
import SelectContentScroable from "@/components/filter-bar/selectContent";
import { Calendar05, HotelCalender } from "@/components/navbar/filter-nav-bar/calander05";
import { useHotelStore } from "@/store/hotel.store";
import type { LucideIcon } from "lucide-react";
import { StaticImageData } from "next/image";
export type type=|"home"|"filter"|"profile"|"settings"|"payments"

export interface Pages {
  type:type
  link: string;
  icon: LucideIcon;
  title: string;
  filter_bar?: React.ReactNode;
}

export type SelectItemOption = {
  value: string;
  label: string;
};

export type SelectGroupOption = {
  label: string;
  items: SelectItemOption[];
};

export const timeZoneOptions: SelectGroupOption[] = [
  {
    label: "North America",
    items: [
      { value: "est", label: "Eastern Standard Time" },
      { value: "cst", label: "Central Standard Time" },
      { value: "mst", label: "Mountain Standard Time" },
      { value: "pst", label: "Pacific Standard Time" },
      { value: "akst", label: "Alaska Standard Time" },
      { value: "hst", label: "Hawaii Standard Time" },
    ],
  },
  {
    label: "Europe & Africa",
    items: [
      { value: "gmt", label: "Greenwich Mean Time" },
      { value: "cet", label: "Central European Time" },
      { value: "eet", label: "Eastern European Time" },
      { value: "west", label: "Western European Summer Time" },
      { value: "cat", label: "Central Africa Time" },
      { value: "eat", label: "East Africa Time" },
    ],
  },
  {
    label: "Asia",
    items: [
      { value: "msk", label: "Moscow Time" },
      { value: "ist", label: "India Standard Time" },
      { value: "cst_china", label: "China Standard Time" },
      { value: "jst", label: "Japan Standard Time" },
      { value: "kst", label: "Korea Standard Time" },
      {
        value: "ist_indonesia",
        label: "Indonesia Central Standard Time",
      },
    ],
  },
  {
    label: "Australia & Pacific",
    items: [
      { value: "awst", label: "Australian Western Standard Time" },
      { value: "acst", label: "Australian Central Standard Time" },
      { value: "aest", label: "Australian Eastern Standard Time" },
      { value: "nzst", label: "New Zealand Standard Time" },
      { value: "fjt", label: "Fiji Time" },
    ],
  },
  {
    label: "South America",
    items: [
      { value: "art", label: "Argentina Time" },
      { value: "bot", label: "Bolivia Time" },
      { value: "brt", label: "Brasilia Time" },
      { value: "clt", label: "Chile Standard Time" },
    ],
  },
];

export type FilterBarValues = {
  value: string;
  description: string;
  element?: React.ReactNode;
  tagline?: string;
};
export const HotelFilterBarValues: FilterBarValues[] = [
  {
    value: "Where",
    description: "Search Destination",
    element: <SelectContentScroable />,
    tagline: "Where do you want to go?",
    
  },
  {
    value: "When",
    description: "Add dates",
    element: <HotelCalender />,
    tagline: "Choose your REST plans",
    
  },
  {
    value: "Who",
    description: "Add Guests",
    element: <SelectContentScroable />,
    tagline: "Who is coming?",
    
  },
];
export const CabsFilterBarValues: FilterBarValues[] = [
  {
    value: "Pickup Location",
    description: "Enter Pickup point",
    element: <SelectContentScroable />,
    tagline: "Where do you want to go?",
    
  },
  {
    value: "Drop Location",
    description: "Enter Destination",
    element: <HotelCalender />,
    tagline: "Choose your REST plans",
   
  },
  {
    value: "When",
    description: "Add Date and Time",
    element: <HotelCalender />,
    tagline: "Who is coming?",
    
  },
  {
    value: "Who",
    description: "Add Passengers",
    element: <SelectContentScroable />,
    tagline: "Who is coming?",
   
  },
];
export const destinations: { title: string; location: string; image: string }[] = [
  {
    title: "Louvre Museum",
    location: "Paris, France",
    image:
      "/img1.png",
  },
  {
    title: "Golden Hands Bridge",
    location: "Da Nang, Vietnam",
    image:
      "/img2.png",
  },
  {
    title: "Elizabeth Tower",
    location: "London, England",
    image:
     "/img3.jpg",
  },
  {
    title: "Louvre Museum",
    location: "Paris, France",
    image:
      "/img4.png",
  },
  {
    title: "Golden Hands Bridge",
    location: "Da Nang, Vietnam",
    image:
      "/img1.png",
  },
  {
    title: "Elizabeth Tower",
    location: "London, England",
    image:
      "/img2.png",
  },
];
export const cars = [
  {
    title: "Tesla Model S",
    location: "California, USA",
    image:
      "https://images.pexels.com/photos/799443/pexels-photo-799443.jpeg",
  },
  {
    title: "Lamborghini Aventador",
    location: "Sant'Agata Bolognese, Italy",
    image:
      "https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg",
  },
  {
    title: "BMW M4",
    location: "Munich, Germany",
    image:
      "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg",
  },
  {
    title: "Tesla Model SS",
    location: "California, USA",
    image:
      "https://images.pexels.com/photos/1149831/pexels-photo-1149831.jpeg",
  },
  {
    title: "Lamborghini AventadorS",
    location: "Sant'Agata Bolognese, Italy",
    image:
      "https://images.pexels.com/photos/244206/pexels-photo-244206.jpeg",
  },
  {
    title: "BMW M4S",
    location: "Munich, Germany",
    image:
      "https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg",
  },
];