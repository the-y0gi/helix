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
      className="w-full"
    >
      <AccordionItem value="shipping">
        <AccordionTrigger>
          <div className="flex flex-col gap-2 text-left">
            {/* <h3 className="text-lg font-semibold">Description</h3> */}
            <p className="text-sm text-muted-foreground">{hotel.name}</p>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <p className="whitespace-pre-wrap">{hotel.description}</p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
