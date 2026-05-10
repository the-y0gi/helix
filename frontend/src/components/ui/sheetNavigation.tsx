
import {
  Sheet,

  SheetContent,

  SheetTrigger,
} from "@/components/ui/sheet";

import { DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { HotelContextProvider } from "@/context/hotel/HotelContextProvider";
import { items } from "@/constants/filter-constants";
import { SideBarFilter } from "@/components/filter-bar/sidebar-filter";
export const SheetNavigation = ({ trigger, content, setOpen }: { trigger: React.ReactNode; content: React.ReactNode; setOpen: (value: boolean) => void }) => {
  return (
    <Sheet onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent className="overflow-y-scroll">
        <VisuallyHidden>
          <DialogTitle>Menu</DialogTitle>
          <DialogDescription>
            This dialog contains navigation options.
          </DialogDescription>
        </VisuallyHidden>
        <HotelContextProvider>
          {content}
        </HotelContextProvider>


      </SheetContent>
    </Sheet>
  );
}
