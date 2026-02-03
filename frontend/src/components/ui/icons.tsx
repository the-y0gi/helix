import {
  Wifi,
  Utensils,
  Wind,
  Ban,
  Waves
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

export const amenityIconMap: Record<string, LucideIcon> = {
  breakfast: Utensils,
  wifi: Wifi,
  ac: Wind,
  no_smoking: Ban,
  sea_view: Waves,
};
