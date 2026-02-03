
import React from "react"
import { cn } from "@/lib/utils"
import { Button } from "../ui/button"
import { useQueryState, parseAsArrayOf, parseAsString } from "nuqs"

export type PillOption = {
  value: string
  icon?: React.ReactNode
}

type PillGroupProps = {
  options: PillOption[]
  queryKey?: string
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
  value = [],
  onChange,
}: PillGroupProps) {
  const [queryValues, setQueryValues] = useQueryState(
    queryKey ?? "__noop__",
    parseAsArrayOf(parseAsString).withDefault([])
  )

  const [selectedValues, setSelectedValues] = React.useState<string[]>(
    value.length ? value : queryValues
  )

  React.useEffect(() => {
    const next = value.length ? value : queryValues

    setSelectedValues((prev) =>
      arraysEqual(prev, next) ? prev : next
    )
  }, [])

  const toggle = (val: string) => {
  setSelectedValues((prev) => {
    const next = prev.includes(val)
      ? prev.filter((v) => v !== val)
      : [...prev, val]

    onChange?.(next)
    if (queryKey) {
      setQueryValues(next)
    }

    return next
  })
}


  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = selectedValues.includes(opt.value)

        return (
          <Button
            key={opt.value}
            variant={active ? "default" : "outline"}
            onClick={() => toggle(opt.value)}
            className={cn(
              "flex items-center gap-2 rounded-full px-3 py-1 text-sm transition",
              active
                ? "bg-primary text-primary-foreground"
                : "bg-background"
            )}
          >
            {opt.icon && <span>{opt.icon}</span>}
            <span>{opt.value}</span>
          </Button>
        )
      })}
    </div>
  )
}
