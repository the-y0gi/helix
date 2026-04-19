import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";


import { Hotel } from "@/types";

export function Decription({ hotel }: { hotel: Hotel }) {
  return (
    <Accordion
      type="single"
      collapsible
      defaultValue="shipping"
      className="w-full dark:border-zinc-800"
    >
      <AccordionItem value="shipping" className="border-b-0 gap-2">
        <AccordionTrigger className="hover:no-underline py-4">
          <div className="flex flex-col gap-1 text-left">
            
            <h3 className="text-[18px] font-bold text-smooth font-sans dark:text-zinc-500 text-zinc-700 tracking-tight leading-tight">
              {hotel.name}
            </h3>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          {/* Description: Clean, readable size with relaxed line height */}
          <p className="text-[14px] leading-relaxed text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap">
            {hotel.description}
          </p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
