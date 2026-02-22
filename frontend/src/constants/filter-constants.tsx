import { HotelCheckBoxGroupOfClassification, HotelCheckBoxGroupOfRoomSize, HotelCheckBoxGroupOfScore, HotelCounters, HotelDistanceFromCenter, HotelPileGroup, HotelPileGroupOfAmenities, HotelPileGroupOfEssentials, HotelPileGroupOfFeatures, HotelPileGroupOfLocation, HotelPileGroupOfOnsite, HotelPriceRange } from "@/components/side-bar-filter/hotel/HotelPileGroup";
// export const ROOM_COUNTER_KEYS = ["Bedrooms", "Beds", "Bathrooms"] as const;

// export type CounterKeys = typeof ROOM_COUNTER_KEYS[number];
import {
  Wifi,
  Snowflake,
  Flame,
  WashingMachine,
  Utensils,

  Wind,
  Droplet,
  Briefcase,
  ConciergeBell,
  Luggage,
  Bus,
  Coffee,
  Waves,
  ParkingSquare,
  Dumbbell,
  UtensilsCrossed,
  MapPin,
  Building,
  Sun,
  Bell,
  DoorOpenIcon,
} from "lucide-react";
import { Home, Layers } from "lucide-react";
export const filterOptions = {
  typeOfPlace: [
    { value: "Any type", icon: <Layers size={16} /> },
    { value: "Room", icon: <DoorOpenIcon size={16} /> },
    { value: "Entire home", icon: <Home size={16} /> },
  ],

  amenities: [
    { value: "Wi-Fi", icon: <Wifi size={16} /> },
    { value: "Air conditioning", icon: <Snowflake size={16} /> },
    { value: "BBQ grill", icon: <Flame size={16} /> },
    { value: "Washing machine", icon: <WashingMachine size={16} /> },
    { value: "Kitchen", icon: <Utensils size={16} /> },
  ],

  roomsbeds: ["Bedrooms", "Beds", "Bathrooms"] as const,

  essentials: [
    { value: "Heating", icon: <Wind size={16} /> },
    { value: "Iron", icon: <Wind size={16} /> },
    { value: "Hair dryer", icon: <Droplet size={16} /> },
    { value: "Dedicated workspace", icon: <Briefcase size={16} /> },
  ],

  onsiteServices: [
    { value: "24-hour front desk", icon: <ConciergeBell size={16} /> },
    { value: "Room service", icon: <Bell size={16} /> },
    { value: "Luggage storage", icon: <Luggage size={16} /> },
    { value: "Airport shuttle", icon: <Bus size={16} /> },
  ],

  features: [
    { value: "Breakfast included", icon: <Coffee size={16} /> },
    { value: "Pool", icon: <Waves size={16} /> },
    { value: "Hot tub", icon: <Sun size={16} /> },
    { value: "Free parking", icon: <ParkingSquare size={16} /> },
    { value: "Gym", icon: <Dumbbell size={16} /> },
    { value: "Restaurant", icon: <UtensilsCrossed size={16} /> },
  ],

  location: [
    { value: "Private beach area", icon: <Waves size={16} /> },
    { value: "Waterfront", icon: <MapPin size={16} /> },
    { value: "Balcony", icon: <Building size={16} /> },
  ],
  guest_score:[
            {
              value: 5,
              label: "5.0+ Excellent",
            },
            {
              value: 4,
              label: "4.0+ Very Good",
            },
            {
              value: 3,
              label: "3.0+ Good",
            },
            {
              value: 2,
              label: "2.0+ Fair",
            },
            {
              value: 1,
              label: "1.0+ Poor",
            },
          ],
  classification:[
            {
              value: 5,
              label: "5.0+ Excellent",
            },
            {
              value: 4,
              label: "4.0+ Very Good",
            },
            {
              value: 3,
              label: "3.0+ Good",
            },
            {
              value: 2,
              label: "2.0+ Fair",
            },
            {
              value: 1,
              label: "1.0+ Poor",
            },
          ],
  roomsize:[
    { value: 200, label: "small (<=25 msq" },
    { value: 500, label: "medium (25-50 msq)" },
    { value: 1000, label: "large (50-100 msq)" },
    
  ]
};

type bedstype = "Bedrooms"|"Beds"|"Bathrooms"
export const items = [
  {
    value: "type",
    trigger: "Type of place",
    content: <HotelPileGroup values={filterOptions.typeOfPlace} />,
  },
  {
      value: "Price",
      trigger: "Price range",
      content:<HotelPriceRange/> ,
    },
  {
      value: "roomsbeds",
      trigger: "Rooms and beds",
      content: (
        <HotelCounters 
        values={filterOptions.roomsbeds  } />
        
      ),
    },
    {
      value: "Room size",
      trigger: "Rooms Size",
      content: (
        <HotelCheckBoxGroupOfRoomSize stars={false} values={filterOptions.roomsize}/>
      ),
    },
    {
      value: "distance_center",
      trigger: "Distance from center",
      content:<HotelDistanceFromCenter/> ,
    },
    {
      value: "score",
      trigger: "Guest Review Score",
      content: (
        <HotelCheckBoxGroupOfScore stars={false} values={filterOptions.guest_score} />
      ),
    },
    {
      value: "clasification",
      trigger: "Property Clasification",
      content: (
        <HotelCheckBoxGroupOfClassification stars={true} values={filterOptions.classification} />
      ),
    },
  {
    value: "amenities",
    trigger: "Amenities",
    content: <HotelPileGroupOfAmenities values={filterOptions.amenities} />,
  },
  {
    value: "essentials",
    trigger: "Essentials",
    content: <HotelPileGroupOfEssentials values={filterOptions.essentials} />,
  },
  {
    value: "onsite",
    trigger: "On-site Services",
    content: <HotelPileGroupOfOnsite values={filterOptions.onsiteServices} />,
  },
  {
    value: "features",
    trigger: "Features",
    content: <HotelPileGroupOfFeatures values={filterOptions.features} />,
  },
  {
    value: "location",
    trigger: "Location",
    content: <HotelPileGroupOfLocation values={filterOptions.location} />,
  },
];