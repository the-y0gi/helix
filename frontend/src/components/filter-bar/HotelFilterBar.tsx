import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Props = {
  children: React.ReactNode;
  content?: React.ReactNode;
  tagline?: string;
  type?: "filter" | "home";
};

// components/filter-bar/HotelFilterBar.tsx

const HotelFilterBar = ({ children, content, tagline }: Props) => {
  return (
    <Dialog>
      {/* 1. Added asChild so the Trigger doesn't act like a button */}
      <DialogTrigger asChild> 
          {children}
      </DialogTrigger>
      <DialogContent className="md:min-w-[825px] flex flex-col min-h-[400px] gap-2">
        <DialogHeader>
           <DialogTitle>{tagline || "Location"}</DialogTitle>
        </DialogHeader>
        {/* 2. Wrap content in a div that grows to fill the dialog */}
        <div className="flex-1 w-full relative min-h-[400px]">
          
           {content || <div className="text-center">No content available</div>}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HotelFilterBar;
