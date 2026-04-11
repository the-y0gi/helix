"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function UnderConstruction({cat}:{cat:string}) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 20, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 20);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;
      if (distance < 0) {
        clearInterval(timer);
        return;
      }
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center bg-background py-12 mt-10 w-full px-4 overflow-hidden rounded-xl border">
      {/* Subtle Glows using Shadcn Primary color */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary blur-[100px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="z-10 text-center max-w-lg w-full"
      >
        <div className="relative w-32 h-32 mx-auto mb-6">
           <Image
             src="https://illustrations.popsy.co/white/web-design.svg" 
             alt="Under Construction"
             fill
             className="object-contain dark:invert"
             priority
           />
        </div>

        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-2">
         {`${cat} Coming`} <span className="text-primary">Soon</span>
        </h2>
        <p className="text-muted-foreground text-sm mb-8">
          We're polishing the final details.
        </p>

        {/* Compact Timer Grid */}
        <div className="flex justify-center gap-3">
          <CountdownBox value={timeLeft.days} label="Days" />
          <CountdownBox value={timeLeft.hours} label="Hrs" />
          <CountdownBox value={timeLeft.minutes} label="Min" />
          <CountdownBox value={timeLeft.seconds} label="Sec" />
        </div>

        {/* Small Notify Form */}
        {/* <div className="mt-10 flex flex-col sm:flex-row items-center gap-2 max-w-sm mx-auto">
          <input 
            type="email" 
            placeholder="Email address" 
            className="w-full bg-secondary text-secondary-foreground border border-input h-10 px-4 rounded-md text-sm focus:ring-1 focus:ring-primary outline-none transition-all"
          />
          <button className="w-full sm:w-auto bg-primary text-primary-foreground h-10 px-6 rounded-md text-sm font-semibold hover:opacity-90 transition-all active:scale-95">
            Notify
          </button>
        </div> */}
      </motion.div>
    </div>
  );
}

function CountdownBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="bg-card border border-border shadow-sm flex flex-col items-center justify-center rounded-lg w-16 h-16 md:w-20 md:h-20">
      <div className="relative h-8 md:h-10 overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={value}
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -15, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
            className="block text-xl md:text-2xl font-bold text-card-foreground"
          >
            {value.toString().padStart(2, '0')}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="text-[9px] uppercase tracking-widest font-medium text-muted-foreground">
        {label}
      </span>
    </div>
  );
}