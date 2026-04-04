
'use client'
import Image from "next/image";
export const SideBarFilter = () => {
  return (

    <div className="flex flex-col gap-2 p-1 md:min-w-[270px] w-full md:max-w-[270px]">
      <div className="relative gap-2 p-1 md:min-w-[270px] w-full md:max-w-[270px] h-40 rounded-md overflow-hidden group">
        {/* The Map Image with Blur */}
        <Image
          src="/map-icons/map.png"
          alt="Hotel Arts Barcelona"
          fill
          className="object-cover blur-[2px] brightness-75 transition-all duration-300 group-hover:blur-sm group-hover:scale-110"
        />

        {/* The Text Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors duration-300">
          <span className="text-white text-sm font-bold uppercase tracking-wider px-4 py-2 border border-white/50 rounded-lg backdrop-blur-md shadow-2xl">
            See Location on Map
          </span>
        </div>
      </div>
      <FilterAccordion />
      <div className="w-full h-[50px]"></div>
    </div>
  );
};
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";


import { items } from "@/constants/filter-constants";



export function FilterAccordion() {
  return (
    <div className="w-full max-w-sm rounded-2xl border bg-zinc-50 dark:bg-zinc-900">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <p className="text-sm font-medium">Filter by</p>
        <Button variant="ghost" size="sm">
          Clear
        </Button>
      </div>

      <Accordion type="multiple">
        {items.map((item) => (
          <AccordionItem value={item.value} key={item.value}>
            <AccordionTrigger className="px-4">{item.trigger}</AccordionTrigger>
            <AccordionContent className="px-4">{item.content}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
