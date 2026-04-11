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
      <DialogContent className="w-screen flex flex-col h-screen p-0 m-0 " >
        <DialogHeader className="hidden">
          <DialogTitle>


          </DialogTitle>
        </DialogHeader>
       

          {content || <div className="text-center">No content available</div>}
      </DialogContent>
    </Dialog>
  );
};

export default HotelFilterBar;
