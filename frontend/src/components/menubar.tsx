"use client";

import { AnimatedThemeTogglerDemo } from "./ui/theme-toggle";
import { Sign_in_hover } from "./auth/_components/sign-in-hover";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";

export function MenuBar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.paddingRight = "";
    }
  }, [open]);
  const navigate = useRouter();
  const pathname = usePathname();
  const handelnavigate = (path: string) => {
    if (pathname === path) {
      return;
    }
    toast.success("Redirecting...");
    navigate.push(path);
  };
  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
      <DropdownMenuTrigger asChild>
    <Button variant="ghost" className="p-0 rounded-full">
      <div className="w-12 h-12 rounded-full overflow-hidden border border-zinc-400 hover:border-orange-400 transition">
        <img src="/girl.png" alt="Profile" className="w-full h-full object-cover" />
      </div>
    </Button>
  </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40 mr-10  border-0" align="start">
        <DropdownMenuGroup>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => handelnavigate("/profile")}>
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handelnavigate("/")}>
            Home
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <AnimatedThemeTogglerDemo />
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Email</DropdownMenuItem>
                <DropdownMenuSeparator />
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Sign_in_hover tag="Log-in" variant="ghost" />
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Sign_in_hover tag="Sign-up" variant="ghost" />
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Log out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
