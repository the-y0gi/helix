'use client'

import React, { useEffect, useState } from "react"
import {
  useQueryStates,
  parseAsArrayOf,
  parseAsString,
  parseAsInteger,
} from "nuqs"
import { useGetHotelsByFiltersDemo, useHotelSearch } from "@/services/hotel/querys"
import { Hotel } from "@/types"
import { useHotelStore } from "@/store/hotel.store"

type PriceTuple = [number, number]

export type HotelFilters = {
  price: PriceTuple//
  Bedrooms: number[]//
  Beds: number[]//
  Bathrooms: number[]//
  typeOfPlace: string[]//
  essentials: string[]
  roomSize: string[]//
  onsite: string[]
  features: string[]
  amenities: string[]
  roomsbeds: string[]
  location: string[]//
  classification: string[]
  score: string[]
  distance: number[]
}

type HotelContextProps = {
  filters: HotelFilters
  setFilters: (
    value: Partial<HotelFilters> | ((prev: HotelFilters) => Partial<HotelFilters>)
  ) => void
  hotels: Hotel[]
  isLoading: boolean
  total: number
  page: number
  setPage: (page: number) => void
}

const DEFAULT_PRICE: PriceTuple = [0, 10]

const HotelContext = React.createContext<HotelContextProps | null>(null)

export const HotelContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [queryFilters, setQueryFilters] = useQueryStates({
    price: parseAsArrayOf(parseAsInteger).withDefault(DEFAULT_PRICE),
    typeOfPlace: parseAsArrayOf(parseAsString).withDefault([]),
    Bedrooms: parseAsArrayOf(parseAsInteger).withDefault([]),
    Beds: parseAsArrayOf(parseAsInteger).withDefault([]),
    Bathrooms: parseAsArrayOf(parseAsInteger).withDefault([]),
    roomSize: parseAsArrayOf(parseAsString).withDefault([]),
    distance: parseAsArrayOf(parseAsInteger).withDefault([0]),
    amenities: parseAsArrayOf(parseAsString).withDefault([]),
    essentials: parseAsArrayOf(parseAsString).withDefault([]),
    features: parseAsArrayOf(parseAsString).withDefault([]),
    onsite: parseAsArrayOf(parseAsString).withDefault([]),
    roomsbeds: parseAsArrayOf(parseAsString).withDefault([]),
    location: parseAsArrayOf(parseAsString).withDefault([]),
    classification: parseAsArrayOf(parseAsString).withDefault([]),
    score: parseAsArrayOf(parseAsString).withDefault([]),
    page: parseAsInteger.withDefault(1),
  })

  const filters: HotelFilters = {
    ...queryFilters,
    price:
      queryFilters.price.length === 2
        ? [queryFilters.price[0], queryFilters.price[1]]
        : DEFAULT_PRICE,
  }

  const page = queryFilters.page

  const setPage = (newPage: number) => {
    setQueryFilters((prev) => ({ ...prev, page: newPage }))
  }

  const setFilters: HotelContextProps["setFilters"] = (value) => {
    const next =
      typeof value === "function" ? value(filters) : value

    // Reset to page 1 whenever filters change
    setQueryFilters((prev) => ({
      ...prev,
      ...next,
      page: 1,
    }))
  }

  const { guests, city, date } = useHotelStore();
  function formatDate(dateValue: any) {
    if (!dateValue) return undefined;
    const d = typeof dateValue === "string" ? new Date(dateValue) : dateValue;
    if (isNaN(d.getTime())) return undefined;
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
  const combinedFilters = React.useMemo(() => ({
    ...filters,
    city,
    adults: guests.adults,
    children: guests.children,
    date: {
      checkIn: formatDate(date?.from),
      checkOut: formatDate(date?.to)
    }
  }), [filters, guests, city, date]);

  const debouncedFilters = useDebounce(combinedFilters, 1500)
  const debouncedPage = useDebounce(page, 1000)
  // console.log(guests, city, date);

  // const { data: d } = useHotelSearch({
  //   destination: city,
  //   checkIn: date?.from,
  //   checkOut: date?.to,
  //   adults: guests.adults,
  //   children: guests.children
  // })
  // const hotelss: Hotel[] = d?.data ?? []
  const { data, isLoading } = useGetHotelsByFiltersDemo(debouncedFilters as any, debouncedPage)
  // const c = 
  const hotels: Hotel[] = data?.data ?? []
  const total: number = data?.total ?? 0
  // console.log(, hotels);


  return (
    <HotelContext.Provider value={{ filters, setFilters, hotels, isLoading, total, page, setPage }}>
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