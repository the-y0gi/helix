import type { Pages } from "@/constants/constants";
import { cn } from "@/lib/utils";

const Search_bar_filter = ({
  containerClassName,
  filter_bar,
  mobile,
}: {
  containerClassName?: string;
  filter_bar: Pages;
  mobile?: boolean;
}) => {
  const type = filter_bar.type;
  return (
    <div
      className={cn(
        type === "home"
          ? [
              "w-full",
              "bg-white/95 dark:bg-zinc-900/95",
              "backdrop-blur-sm",
              "md:rounded-full ",
              "shadow-[0_4px_20px_rgba(0,0,0,0.08)]",
              "border border-black/5 dark:border-white/10 md:pr-5",
              mobile ? "mt-4 p-1" : "p-1",
            ]
          : [
              "w-full",
              "bg-white/95 dark:bg-zinc-900/95",
              "backdrop-blur-sm",
              "md:rounded-2xl  ",
              "shadow-[0_4px_20px_rgba(0,0,0,0.08)]",
              "border border-black/10 dark:border-white/20 ",
              mobile ? "mt-4 p-1" : "p-1",
            ],

        containerClassName,
      )}
    >
      {filter_bar.filter_bar}
    </div>
  );
};

export default Search_bar_filter;
