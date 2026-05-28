import React, { useEffect, useState } from "react";


type Props = {
  bikeId: string;
  children: React.ReactNode;
};
export interface ApiResponse {
  success: boolean;
  data: RentalData;
}

export interface RentalData {
  company: Company;
  services: Service[];
}

interface Company {
  companyId: string;
  name: string;
  description: string;
  city: string;
  state: string;
  rating: number;
  reviews: number;
  images: string[];
  features: string[];
  rentalPolicies: RentalPolicies;
  isFavorite: boolean;
}

interface RentalPolicies {
  helmetIncluded: boolean;
  securityDeposit: number;
  licenseRequired: boolean;
}

export interface Service {
  serviceId: string;
  bikeName: string;
  bikeType: 'scooter' | 'cruiser' | 'sports';
  mileage: string;
  gearType: 'Automatic' | 'Manual';
  pricePerDay: number;
  totalPriceWithTax: number;
  taxPercentage: number;
  thumbnail: string;
  features: string[];
}
const HotelContext = React.createContext<{

} | null>(null);

const BikeDetailsContextProvider = ({ bikeId, children }: Props) => {

  const contextValue = React.useMemo(
    () => ({

    }),
    [
    ]
  );

  return (
    <HotelContext.Provider value={contextValue}>
      {children}
    </HotelContext.Provider>
  );
};

export default BikeDetailsContextProvider;

export const useBikeDetailsContext = () => {
  const context = React.useContext(HotelContext);
  if (!context) {
    throw new Error(
      "useBikeDetailsContext must be used within HotelContextProvider"
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