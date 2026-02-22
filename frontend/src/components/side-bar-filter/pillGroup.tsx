
import React from "react"
import { Button } from "../ui/button"
import { HotelFilters, useHotelContext } from "@/context/hotel/HotelContextProvider"

export type PillOption = {
  value: string
  icon?: React.ReactNode
}

type StringArrayFilterKeys = {
  [K in keyof HotelFilters]: HotelFilters[K] extends string[] ? K : never
}[keyof HotelFilters]

type PillGroupProps = {
  // label:"amenities" |""
  options: PillOption[]
  queryKey?: StringArrayFilterKeys    
  value?: string[]
  onChange?: (value: string[]) => void
}

function arraysEqual(a: string[], b: string[]) {
  if (a.length !== b.length) return false
  return a.every((v, i) => v === b[i])
}

export default function PillGroup({
  options,
  queryKey,
}: PillGroupProps) {
  const { filters, setFilters } = useHotelContext()

  const selectedValues = queryKey ? filters[queryKey] : []

  const toggle = (val: string) => {
    if (!queryKey) return

    const next = selectedValues.includes(val)
      ? selectedValues.filter((v) => v !== val)
      : [...selectedValues, val]

    setFilters({
      [queryKey]: next,
    })
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = selectedValues.includes(opt.value)

        return (
          <Button
            key={opt.value}
            type="button"
            variant={active ? "default" : "outline"}
            onClick={() => toggle(opt.value)}
            className="rounded-full"
          >
            {opt.value}
          </Button>
        )
      })}
    </div>
  )
}