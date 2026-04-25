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
      {/* max-w-none, h-[100dvh], rounded-none, border-none overrides the default dialog box styling */}
      <DialogContent className="w-screen max-w-none h-[100dvh] flex flex-col p-0 m-0 z-[1000] border-none sm:rounded-none overflow-hidden" >
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
