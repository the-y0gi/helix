import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

type LocationItem = {
  id: number;
  title: string;
  subtitle?: string;
};

interface Propsc {
  items: LocationItem[];
  onSelect?: (item: LocationItem) => void;
}

export function LocationSuggestionDropdown({
  items,
  onSelect,
}: Propsc) {
  return (
    <div className="w-full rounded-2xl bg-background border border-border shadow-sm p-2">
      <div className="flex flex-col gap-1">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect?.(item)}
            className={cn(
              "flex w-full items-center gap-4 rounded-xl p-3 text-left transition-colors",
              "hover:bg-accent hover:text-accent-foreground"
            )}
          >
            {/* Icon Container */}
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted">
              <MapPin className="text-muted-foreground" size={20} />
            </div>

            {/* Text */}
            <div className="flex flex-col">
              <p className="font-medium text-foreground">
                {item.title}
              </p>
              {item.subtitle && (
                <p className="text-sm text-muted-foreground">
                  {item.subtitle}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}