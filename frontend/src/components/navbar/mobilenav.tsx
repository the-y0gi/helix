'use client'

export function MobileNavWrapper({ isMobile }: { isMobile: boolean }) {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    
    if (latest > previous && latest > 50) {
      setHidden(true);
    } 
    else {
      setHidden(false);
    }
  });

  if (!isMobile) return null;

  return (
    <motion.nav
      variants={{
        visible: { y: 0 },
        hidden: { y: "100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed bottom-0 left-0 right-0 z-[100] bg-background rounded-tl-3xl rounded-tr-3xl border-t border-zinc-200 dark:border-zinc-800 px-2 pb-safe shadow-[0_-4px_12px_rgba(0,0,0,0.05)]"
    >
      <div className="flex h-16 items-center justify-around">
        <BottomNav />
      </div>
    </motion.nav>
  );
}


import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Home, Search, Percent, History, User } from "lucide-react";
import { RouterPush } from "../RouterPush";
import { useCurrentUser } from "@/services/hotel/querys";
import TopRight from "./topRight";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const { data: user } = useCurrentUser();
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useIsMobile();
  const isLoggedIn = !!user?.data;

  const iconSize = 22; 

  const isActive = (path: string) => pathname === path;

  const navItems = [
    { label: "Home", icon: Home, path: "/hotels", fill: true },
    { label: "Search", icon: Search, path: "/hotels/find" },
    { label: "Offers", icon: Percent, path: "/" },
    { label: "Bookings", icon: History, path: "/profile?tab=all", auth: true },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/80 backdrop-blur-lg pb-safe">
      <nav className="flex items-center justify-around max-w-lg mx-auto h-16 px-4">
        {navItems.map((item) => {
          if (item.auth && !isLoggedIn) return null;
          
          const active = isActive(item.path);

          return (
            <button
              key={item.path}
              onClick={() => RouterPush(router, item.path)}
              className="relative flex flex-col items-center justify-center flex-1 h-full transition-colors"
            >
              <motion.div
                whileTap={{ scale: 0.85 }}
                className={cn(
                  "flex flex-col items-center gap-1",
                  active ? "text-primary" : "text-muted-foreground"
                )}
              >
                <item.icon 
                  size={iconSize} 
                  strokeWidth={active ? 2.5 : 2}
                  fill={active && item.fill ? "currentColor" : "none"}
                />
                <span className="text-[10px] font-medium leading-none">
                  {item.label}
                </span>
              </motion.div>

              {active && (
                <motion.div
                  layoutId="bottom-nav-indicator"
                  className="absolute -top-[1px] h-1 w-8 rounded-full bg-primary"
                  transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                />
              )}
            </button>
          );
        })}

        <div className="flex-1 flex justify-center">
          {!isLoggedIn ? (
            !isMobile ? (
              <div className="flex flex-col items-center text-muted-foreground">
                 <User size={iconSize} />
                 <span className="text-[10px] font-medium mt-1">You</span>
              </div>
            ) : (
              <NavButton 
                active={isActive("/login")} 
                onClick={() => RouterPush(router, "/login")}
                icon={User} 
                label="You" 
                size={iconSize} 
              />
            )
          ) : (
            <NavButton 
              active={isActive("/profile")} 
              onClick={() => RouterPush(router, "/profile")}
              icon={User} 
              label="You" 
              size={iconSize} 
              fill
            />
          )}
        </div>
      </nav>
    </div>
  );
}

function NavButton({ active, onClick, icon: Icon, label, size, fill }: any) {
  return (
    <button onClick={onClick} className="relative flex flex-col items-center justify-center h-full">
      <motion.div
        whileTap={{ scale: 0.85 }}
        className={cn(
          "flex flex-col items-center gap-1",
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
      {active && (
        <motion.div
          layoutId="bottom-nav-indicator"
          className="absolute -top-[1px] h-1 w-8 rounded-full bg-primary"
          transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
        />
      )}
    </button>
  );
}