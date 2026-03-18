"use client";

import { useSearchCity } from "@/hooks/useSearch";
import { Input } from "@base-ui/react";
import { MapPin, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion"; // Changed to framer-motion for compatibility
import React, { useRef, useState } from "react";

const AddressSearch = () => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { results, loading } = useSearchCity(query);
  const searchRef = useRef<HTMLDivElement>(null);

  return (
    <div className="w-full max-w-full relative" ref={searchRef}>
      {/* Backdrop to close list and prevent accidental clicks below */}
      <AnimatePresence>
        {isOpen && (
          <div
            className="fixed inset-0 z-40 bg-transparent"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
          />
        )}
      </AnimatePresence>

      <div className="relative z-50">
        <Input
          placeholder="Search places (e.g. 'Goa')"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="md:h-12 h-10 w-full rounded-xl border-none px-4 outline-none bg-transparent text-sm md:text-base"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>

      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="mt-2 space-y-1 bg-background p-2 rounded-2xl absolute z-[60] w-full shadow-2xl border border-border"
          >
            {results.map((place: any, i: number) => (
              <div
                key={ i}
                className="p-3 hover:bg-secondary rounded-lg cursor-pointer transition-colors border-b border-border/10 last:border-none"
                onClick={() => {
                  setQuery(place.properties.name);
                  setIsOpen(false);
                }}
              >
                <p className="font-bold text-sm text-foreground">
                  {place.properties.name}
                </p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  {[
                    place.properties.city,
                    place.properties.state,
                    place.properties.country,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Main Export
const SearchInput = () => {
  return (
    <div className="flex items-center gap-4 bg-primary/5 border border-primary/10 rounded-[10px] md:px-5 px-3 py-1 md:py-2">
      <MapPin className="w-5 h-5 text-primary shrink-0" />
      <AddressSearch />
    </div>
  );
};

export default SearchInput;