import { Checkbox } from "@/components/ui/checkbox"
import {
  IconStar,
  IconStarFilled,
} from "@tabler/icons-react"
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs"

export default function CheckboxGroup({
  options,
  stars,
  queryKey,
}: {
  options: {
    value: number
    label: string
  }[]
  queryKey: string
  stars?: boolean
}) {
  const [queryValues, setQueryValues] = useQueryState(
    queryKey,
    parseAsArrayOf(parseAsString).withDefault([])
  )

  const toggle = (value: number) => {
    const stringValue = String(value)

    const next = queryValues.includes(stringValue)
      ? queryValues.filter((v) => v !== stringValue)
      : [...queryValues, stringValue]

    setQueryValues(next)
  }

  return (
    <div className="space-y-2">
      {options.map((opt, i) => {
        const stringValue = String(opt.value)
        const checked = queryValues.includes(stringValue)

        return (
          <label
            key={i}
            className="flex items-center gap-2 text-sm cursor-pointer"
          >
            <Checkbox
              checked={checked}
              onCheckedChange={() => toggle(opt.value)}
            />

            {stars && (
              <div className="flex gap-0.5">
                {[...Array(opt.value)].map((_, i) => (
                  <IconStarFilled
                    key={`filled-${i}`}
                    className="size-3 text-yellow-500"
                  />
                ))}
                {[...Array(5 - opt.value)].map((_, i) => (
                  <IconStar
                    key={`empty-${i}`}
                    className="size-3 text-muted-foreground"
                  />
                ))}
              </div>
            )}

            <span>{opt.label}</span>
          </label>
        )
      })}
    </div>
  )
}
