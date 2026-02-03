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

const HotelFilterBar = ({ children, content, tagline,type }: Props) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className={`cursor-pointer hover:bg-muted/50 transition-colors  ${type==="home"?"rounded-full":"rounded-2xl"}` }>
          {children}
        </div>
      </DialogTrigger>
      <DialogContent className="md:max-w-[825px] justify-center overflow-visible min-h-[400px]">
        <DialogHeader>
          <DialogTitle className="w-full flex justify-center text-3xl">
            {tagline || "Filter Options"}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-6">
          {content || <div className="text-center text-muted-foreground">No content available</div>}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HotelFilterBar;
