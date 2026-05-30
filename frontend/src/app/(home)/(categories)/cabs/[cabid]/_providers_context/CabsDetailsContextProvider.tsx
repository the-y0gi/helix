import React, { useEffect, useState } from "react";


type Props = {
  bikeId: string;
  children: React.ReactNode;
};
export interface CabRentalResponse {
  success: boolean;
  data: CabData;
}

export interface CabData {
  company: Company;
  services: CabService[];
}

export interface Company {
  companyId: string;
  name: string;
  description: string;
  city: string;
  state: string;
  rating: number;
  reviews: number;
  images: string[];
  features: string[];
  isFavorite: boolean;
}

export interface CabService {
  serviceId: string;
  title: string;
  carName: string;
  cabType: "sedan" | "suv" | "luxury" | string;
  capacity: number;
  route: Route;
  distance: string;
  duration: string;
  price: number;
  totalPriceWithTax: number;
  taxPercentage: number;
  thumbnail: string;
  features: string[];
}

export interface Route {
  pickup: string;
  drop: string;
}
const CabsContext = React.createContext<{

} | null>(null);

const CabsDetailsContextProvider = ({ bikeId, children }: Props) => {

  const contextValue = React.useMemo(
    () => ({

    }),
    [
    ]
  );

  return (
    <CabsContext.Provider value={contextValue}>
      {children}
    </CabsContext.Provider>
  );
};

export default CabsDetailsContextProvider;

export const useCabsDetailsContext = () => {
  const context = React.useContext(CabsContext);
  if (!context) {
    throw new Error(
      "useCabsDetailsContext must be used within HotelContextProvider"
    );
  }
  return context;
};
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)

    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}