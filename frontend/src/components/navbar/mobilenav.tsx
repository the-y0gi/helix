"use client";

import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Home, Search, Percent, History, User } from "lucide-react";
import { RouterPush } from "../RouterPush";
import { useCurrentUser } from "@/services/hotel/querys";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useQueryState } from "nuqs";
export function MobileNavWrapper({ isMobile, content }: { isMobile: boolean, content: React.ReactNode }) {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const pathname = usePathname();
  useEffect(() => {

    if (pathname.split('/')[1] === 'book') {
      setHidden(true);
    } else {
      setHidden(false);
    }
  }, [pathname])

  // useMotionValueEvent(scrollY, "change", (latest) => {
  //   const previous = scrollY.getPrevious() ?? 0;

  //   if (latest > previous && latest > 50) {
  //     setHidden(true);
  //   }
  //   else {
  //     setHidden((pathname.split('/')[1] === 'book'));
  //   }
  // });

  if (!isMobile) return null;

  return (
    <motion.nav
      variants={{
        visible: { y: 0 },
        hidden: { y: "100%" }
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className={cn("fixed bottom-0 left-0 right-0 z-[100] bg-background border-t border-zinc-200 dark:border-zinc-800 px-2 pb-safe shadow-[0_-4px_12px_rgba(0,0,0,0.05)]"
      )}
    >
      {content}

    </motion.nav>
  );
}




export const PersistentHeader = ({ children }: { children: React.ReactNode }) => {
  const { scrollY } = useScroll();
  const [isPastTop, setIsPastTop] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {

    if (latest > 80) {
      setIsPastTop(true);
    } else {
      setIsPastTop(false);
    }
  });

  return (
    <motion.nav
      initial={{ y: "-100%", opacity: 0 }}
      variants={{
        visible: {
          y: 0,
          opacity: 1
        },
        hidden: {
          y: "-100%",
          opacity: 0
        },
      }}
      // It stays "visible" as long as we are not at the top
      animate={isPastTop ? "visible" : "hidden"}
      transition={{
        duration: 0.4,
        ease: [0.23, 1, 0.32, 1] // Custom quintic ease for a smooth "glide"
      }}
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] rounded-b-md",
        "bg-white/95 dark:bg-zinc-950/95 backdrop-blur-sm",
        "border-b border-zinc-200 dark:border-zinc-800",
        "shadow-md px-6 py-3 "
      )}
    >
      {children}
    </motion.nav>
  );
};


export function BottomNav() {
  const { data: user } = useCurrentUser();
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useIsMobile();
  const isLoggedIn = !!user?.data;
  const [light, setLight] = useState(false);
  const iconSize = 22;
  const isActive = (path: string) => pathname === path;
  const [tab, setTab] = useQueryState("tab", {
    defaultValue: "/",
    shallow: true,
  });


  return (
    <nav className="flex items-center justify-around w-full max-w-lg mx-auto h-14 px-4">
      {/* 1. Home Button */}
      <IndividualNavButton
        active={isActive("/")}
        label="Home"
        icon={Home}
        onClick={() => RouterPush(router, "/")}
        size={iconSize}
        fill
      />

      {/* 2. Search Button */}
      <IndividualNavButton
        active={isActive("/hotels/find")}
        label="Search"
        icon={Search}
        onClick={() => RouterPush(router, "/hotels/find")}
        size={iconSize}
      />

      {/* 3. Offers Button */}
      <IndividualNavButton
        active={isActive("/offers")}
        label="Offers"
        icon={Percent}
        onClick={() => RouterPush(router, "/offers")}
        size={iconSize}
      />

      {/* 4. Bookings Button (Conditional) */}
      {isLoggedIn && (
        <IndividualNavButton
          // Use the 'tab' value directly for the active state
          active={pathname.includes("/profile") && (tab === "all" || tab === "active" || tab === "cancelled" || tab === "completed")}
          label="Bookings"
          icon={History}
          onClick={() => {
            // This updates the URL and the 'tab' state simultaneously
            setTab("all");
            RouterPush(router, "/profile?tab=all");
          }}
          size={iconSize}
        />
      )}

      {/* 5. Profile/You Button */}
      <div className="flex-1 flex justify-center">
        {!isLoggedIn ? (
          !isMobile ? (
            <div className="flex flex-col items-center text-muted-foreground opacity-50">
              <User size={iconSize} />
              <span className="text-[10px] font-medium mt-1">You</span>
            </div>
          ) : (
            <IndividualNavButton
              active={isActive("/login")}
              onClick={() => RouterPush(router, "/login")}
              icon={User}
              label="You"
              size={iconSize}
            />
          )
        ) : (
          <IndividualNavButton
            active={isActive("/profile") && (tab !== "all" && tab !== "active" && tab !== "cancelled" && tab !== "completed")}
            onClick={() => RouterPush(router, "/profile")}
            icon={User}
            label="You"
            size={iconSize}
            fill
          />
        )}
      </div>
    </nav>
  );
}

// Fixed Individual Button Component
function IndividualNavButton({ active, onClick, icon: Icon, label, size, fill }: any) {
  return (
    <button
      onClick={onClick}
      className="relative flex flex-col items-center justify-center flex-1 h-full pt-1"
    >
      <motion.div
        whileTap={{ scale: 0.85 }}
        className={cn(
          "flex flex-col items-center gap-1 transition-colors duration-200",
          active ? "text-primary" : "text-muted-foreground"
        )}
      >
        <Icon
          size={size}
          strokeWidth={active ? 2.5 : 2}
          fill={active && fill ? "currentColor" : "none"}
        />
        <span className="text-[10px] font-medium leading-none">{label}</span>
      </motion.div>

      {/* FIXED: Active Indicator - Positioned at the very top of the nav height */}
      {/* <AnimatePresence>
        {active && (
          <motion.div
            layoutId="bottom-nav-indicator"
            className="absolute top-0 h-[3px] w-10 rounded-b-full bg-primary shadow-[0_1px_5px_rgba(var(--primary),0.4)]"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            exit={{ opacity: 0, scaleX: 0 }}
            transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
          />
        )}
      </AnimatePresence> */}
    </button>
  );
}