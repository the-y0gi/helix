import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SideBarFilter } from "./sidebar-filter";
import { DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { HotelContextProvider } from "@/context/hotel/HotelContextProvider";
export function SheetNavigation({ content, setOpen }: { content: React.ReactNode; setOpen: (value: boolean) => void }) {
  return (
    <Sheet onOpenChange={setOpen}>
      <SheetTrigger asChild>{content}</SheetTrigger>
      <SheetContent className="overflow-y-scroll">
        <VisuallyHidden>
          <DialogTitle>Menu</DialogTitle>
          <DialogDescription>
            This dialog contains navigation options.
          </DialogDescription>
        </VisuallyHidden>
        <HotelContextProvider>
          <SideBarFilter />
        </HotelContextProvider>

        
      </SheetContent>
    </Sheet>
  );
}
