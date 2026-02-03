import React, { useEffect } from "react";
import { Slider } from "../ui/slider";
import { parseAsArrayOf, parseAsInteger, useQueryState } from "nuqs";

export default function Ranges(
  {queryKey}:{queryKey:string}
) {
  const [distance, setDistance] = useQueryState(
    queryKey,
    parseAsArrayOf(parseAsInteger).withDefault([ 0])
  )
  useEffect(() => {
    if (distance[0]===0) {
      setDistance(null);
    }
  }, [distance, setDistance]);

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Nightly prices including fees and taxes
      </p>
      <div className="flex px-1 justify-between">
        
        <span>
            {distance[0]} Km

        </span>
        <span>
            100 Km
        </span>
      </div>

      <Slider
        value={distance}
        onValueChange={(distance)=> {
          setDistance(distance);
        }}
        max={100}
        step={1}
        className="w-full"
      />

      
    </div>
  );
}