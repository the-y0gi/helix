'use client'
import React from "react"
import { useQueryState, parseAsArrayOf, parseAsInteger } from "nuqs"

type HotelContextProps = {
  priceRange: [number, number]
  setPriceRange: (
    value: [number, number] | ((prev: [number, number]) => [number, number])
  ) => void
}

const HotelContext = React.createContext<HotelContextProps | null>(null)

const HotelContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [priceRange, setPriceRange] = useQueryState(
    "price",
    parseAsArrayOf(parseAsInteger).withDefault([0, 10])
  )

  const handleSetPriceRange: HotelContextProps["setPriceRange"] = (value) => {
    const newValue = typeof value === "function" ? value(priceRange as [number, number]) : value
    setPriceRange(newValue)
  }

  const value: HotelContextProps = {
    priceRange: priceRange as [number, number],
    setPriceRange: handleSetPriceRange,
  }

  return (
    <HotelContext.Provider value={value}>
      {children}
    </HotelContext.Provider>
  )
}

export default HotelContextProvider

export const useHotelContext = () => {
  const ctx = React.useContext(HotelContext)
  if (!ctx) {
    throw new Error("useHotelContext must be used inside HotelContextProvider")
  }
  return ctx
}
