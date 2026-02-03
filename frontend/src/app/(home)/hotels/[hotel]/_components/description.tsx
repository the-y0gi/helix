import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function Decription() {
  return (
    <Accordion
      type="single"
      collapsible
      defaultValue="shipping"
      className="max-w-lg"
    >
      <AccordionItem value="shipping">
        <AccordionTrigger>
          <Card className="md:w-1/2 flx flex-col gap-10 bg-transparent border-none shadow-none">
            <CardTitle>Decription</CardTitle>
            <CardDescription>hotels height</CardDescription>
            <CardContent>
              <div className="overflow-hidden rounded-2xl">
                hotel description
              </div>
            </CardContent>
          </Card>
        </AccordionTrigger>
        <AccordionContent>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis neque
            delectus libero facere illo quasi soluta similique ipsa! Numquam
            voluptatum inventore ex, unde ipsum enim hic natus consequuntur
            autem aliquam. Eaque libero praesentium modi illum vero dolorum
            quaerat iure porro accusamus nulla fugiat adipisci nemo eius
            consequuntur, aliquid sunt veniam! Ex exercitationem consequatur
            debitis voluptate sapiente. Temporibus, hic! Reiciendis, recusandae?
            Alias laboriosam molestiae consequuntur magnam odio fuga? Facilis
            sint placeat in ex! Quaerat quis, eum sit consectetur sint numquam
            officia a laboriosam similique debitis quidem obcaecati nam illo
            pariatur inventore.
          </p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
