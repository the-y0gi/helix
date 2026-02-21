export interface Tabs {
  name: string;
  title?: string;
  value?: string;
  content?: string | React.ReactNode | any;
}
export interface HotelImage {
  url: string;
  public_id: string;
  resource_type?: string;
  _id?: string;
}

export interface RoomType {
  _id: string;
  hotelId: string;
  name: string;
  description: string;
  basePrice: number;
  discountPrice: number;
  capacity: {
    adults: number;
    children: number;
  };
  beds: {
    quantity: number;
    type: string;
    _id: string;
  }[];
  bedType: string;
  roomSizeSqm: number;
  viewType: string;
  amenities: string[];
  images: string[];
  totalRooms: number;
  isActive: boolean;
  availableRooms: number;
  finalPrice: number;
}

export interface Hotel {
  _id: string;
  vendorId?: string;
  name: string;
  description: string;
  address: string;
  city: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
  images: HotelImage[];
  amenities: string[];
  rating: number;
  numReviews: number;
  isFeatured: boolean;
  isActive?: boolean;
  distanceFromCenter?: string;
  roomTypes: RoomType[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CityTrends {
  name: string;
  tagline: string;

  tabs?: Tabs[];
}
