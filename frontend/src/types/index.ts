export interface Tabs {
  name: string;
  title?: string;
  value?: string;
  content?: string | React.ReactNode | any;
}
export interface HotelImage {
  url: string;
  public_id: string;
}

export interface Hotel {
  _id: string;
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
}

export interface CityTrends {
  name: string;
  tagline: string;

  tabs?: Tabs[];
}
