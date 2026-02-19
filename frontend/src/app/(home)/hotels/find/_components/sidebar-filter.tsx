
'use client'

export const SideBarFilter = () => {
  return (
    <div className="flex flex-col gap-2 p-1 md:min-w-[270px] max-w-[270px]">
      <div className="w-full border border-gray-500/20 rounded-2xl flex justify-center items-center h-40">
        map image
      </div>
      <FilterAccordion />
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
