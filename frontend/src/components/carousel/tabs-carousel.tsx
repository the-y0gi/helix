"use client"

import React, { useLayoutEffect, useRef, useState } from "react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"
import { OnlyCarousel } from "./onlyColursel"

type TabItem = {
  name: string
}

type Props = {
  name?: string
  tagline: string
  tabs?: TabItem[]
  type: "cabs" | "adventures" | "tours" | "bikes" | "hotels"
}

export function PopularDestinationCarousel({
  tagline,
  tabs,
  type,
}: Props) {
  const [active, setActive] = useState(tabs?.[0]?.name ?? "")
  const [activeIndex, setActiveIndex] = useState(0)

  const containerRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [pill, setPill] = useState({ left: 0, width: 0 })

  useLayoutEffect(() => {
    const el = tabRefs.current[activeIndex]
    const parent = containerRef.current
    if (!el || !parent) return

    const elRect = el.getBoundingClientRect()
    const parentRect = parent.getBoundingClientRect()

    setPill({
      left: elRect.left - parentRect.left,
      width: elRect.width,
    })
  }, [activeIndex])

  if (!tabs) {
    return (
      <div className="w-full">
        <h2 className="mb-4 text-lg font-semibold">{tagline}</h2>
        <OnlyCarousel type={type} />
      </div>
    )
  }

  return (
    <div className="w-full">
      <h2 className="mb-6 text-lg font-semibold">Trending {active}</h2>

      {/* MASKING WRAPPER (key fix) */}
      <div className="relative w-full overflow-hidden">
        <div
          ref={containerRef}
          className={cn(
            "relative flex items-center gap-2",
            "overflow-x-auto no-scrollbar",
            "rounded-full px-1 py-1",
            "bg-white dark:bg-zinc-900",
            "border border-black/5 dark:border-white/10",
            "w-max max-w-full" // ⬅ important
          )}
        >
          {/* Animated pill */}
          <motion.div
            transition={{ type: "spring", bounce: 0.1, duration: 0.6 }}
            className="absolute top-1 bottom-1 rounded-full md:bg-pink-100 md:dark:bg-zinc-800"
            style={{
              left: pill.left,
              width: pill.width,
            }}
          />

          {tabs.map((tab, i) => (
            <button
              key={tab.name}
              ref={(el) => {tabRefs.current[i] = el}}
              onClick={() => {
                setActive(tab.name)
                setActiveIndex(i)
              }}
              className={cn(
                "relative z-10 px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap",
                active === tab.name
                  ? "text-black dark:text-white"
                  : "text-muted-foreground"
              )}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="mt-4 min-h-[260px]">
        <OnlyCarousel key={active} type={type} />
      </div>
    </div>
  )
}
