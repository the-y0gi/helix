'use client'

import React, { useEffect, useState } from "react"
import {
  useQueryStates,
  parseAsArrayOf,
  parseAsString,
  parseAsInteger,
} from "nuqs"
import { useGetHotelsByFiltersDemo } from "@/services/hotel/querys"

type PriceTuple = [number, number]

export type HotelFilters = {
  price: PriceTuple//
  Bedrooms:number[]//
  Beds:number[]//
  Bathrooms:number[]//
  typeOfPlace: string[]//
  essentials:string[]
  roomSize:string[]//
  onsite:string[]
  features:string[]
  amenities: string[]
  roomsbeds: string[]
  location: string[]//
  classification: string[]
  score: string[]
  distance:number[]
}

type HotelContextProps = {
  filters: HotelFilters
  setFilters: (
    value: Partial<HotelFilters> | ((prev: HotelFilters) => Partial<HotelFilters>)
  ) => void
}

const DEFAULT_PRICE: PriceTuple = [0, 10]

const HotelContext = React.createContext<HotelContextProps | null>(null)

export const HotelContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [queryFilters, setQueryFilters] = useQueryStates({
    price: parseAsArrayOf(parseAsInteger).withDefault(DEFAULT_PRICE),//
    typeOfPlace: parseAsArrayOf(parseAsString).withDefault([]),//
    Bedrooms:parseAsArrayOf(parseAsInteger).withDefault([]),//
    Beds:parseAsArrayOf(parseAsInteger).withDefault([]),//
    Bathrooms:parseAsArrayOf(parseAsInteger).withDefault([]),//
    roomSize:parseAsArrayOf(parseAsString).withDefault([]),//

    distance:parseAsArrayOf(parseAsInteger).withDefault([ 0]),

    amenities: parseAsArrayOf(parseAsString).withDefault([]),//
    essentials: parseAsArrayOf(parseAsString).withDefault([]),//
    features: parseAsArrayOf(parseAsString).withDefault([]),//
    onsite: parseAsArrayOf(parseAsString).withDefault([]),//
    // amenities: parseAsArrayOf(parseAsString).withDefault([]),


    roomsbeds: parseAsArrayOf(parseAsString).withDefault([]),//
    location: parseAsArrayOf(parseAsString).withDefault([]),//
    classification: parseAsArrayOf(parseAsString).withDefault([]),
    score: parseAsArrayOf(parseAsString).withDefault([]),
  })

  const filters: HotelFilters = {
    ...queryFilters,
    price:
      queryFilters.price.length === 2
        ? [queryFilters.price[0], queryFilters.price[1]]
        : DEFAULT_PRICE,
  }

  const setFilters: HotelContextProps["setFilters"] = (value) => {
    const next =
      typeof value === "function" ? value(filters) : value

    setQueryFilters((prev) => ({
      ...prev,
      ...next,
    }))
  }
  const debouncedFilters = useDebounce(filters, 2000)

const { data, isLoading } = useGetHotelsByFiltersDemo(debouncedFilters)
  // const callQuery = ()=>{
    
  // }

  // useEffect(() => {
  //   callQuery()
    
    
    

  // }, [filters])

  return (
    <HotelContext.Provider value={{ filters, setFilters }}>
      {children}
    </HotelContext.Provider>
  )
}

export const useHotelContext = () => {
  const ctx = React.useContext(HotelContext)
  if (!ctx) {
    throw new Error("useHotelContext must be used inside HotelContextProvider")
  }
  return ctx
}

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