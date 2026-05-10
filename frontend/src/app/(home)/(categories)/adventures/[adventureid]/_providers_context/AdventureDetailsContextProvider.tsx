import React, { useEffect, useState } from "react";


type Props = {
  adventureId: string;
  children: React.ReactNode;
};
export interface AdventureResponse {
  success: boolean;
  data: AdventureData;
}

export interface AdventureData {
  adventure: Adventure;
  services: AdventureService[];
}

export interface Adventure {
  _id: string;
  name: string;
  category: "bungee" | "rafting" | "zipline" | string;
  city: string;
  description: string;
  rating: number;
  reviews: number;
  images: string[];
}

export interface AdventureService {
  _id: string;
  title: string;
  type: "fixed" | "variable" | string;
  basePrice: number;
  discountPrice: number;
  features: string[];
  itinerary: any[]; // Specified as empty array in JSON, can be detailed if structure is known
  taxPercentage: number;
  totalTax: number;
  totalPriceWithTax: number;
}
const AdventureDetailsContext = React.createContext<{

} | null>(null);

const AdventureDetailsContextProvider = ({ adventureId, children }: Props) => {

  const contextValue = React.useMemo(
    () => ({

    }),
    [
    ]
  );

  return (
    <AdventureDetailsContext.Provider value={contextValue}>
      {children}
    </AdventureDetailsContext.Provider>
  );
};

export default AdventureDetailsContextProvider;

export const useAdventureDetailsContext = () => {
  const context = React.useContext(AdventureDetailsContext);
  if (!context) {
    throw new Error(
      "useAdventureDetailsContext must be used within AdventureDetailsContextProvider"
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