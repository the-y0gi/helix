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
import { useCurrentUser } from "@/services/querys";
import { currentUser } from "@/services/user.service";
import { cn } from "@/lib/utils";
import { useLogout } from "@/services/dailyfunctions";
import { Logout } from "@/app/(personal)/profile/_components/app-sidebar";

export function MenuBar() {
  const [open, setOpen] = useState(false);
  const { data: user, isLoading: loading, refetch } = useCurrentUser();

  // console.log(user);

  const navigate = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (open) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.paddingRight = "";
    }
  }, [open]);

  const handelnavigate = (path: string) => {
    if (pathname === path) return;

    toast.success("Redirecting...");
    navigate.push(path);
  };

  // ✅ Conditional rendering AFTER all hooks
  if (loading) {
    return <div>Loading...</div>;
  }
  const handelSignin = () => {
    localStorage.setItem("nextRoute", '/');
    return (
      <Sign_in_hover tag="Log-in" variant="ghost" />
    )
  };
  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="p-0 rounded-full">
          <div className="w-12 h-12 rounded-full overflow-hidden border border-zinc-400 hover:border-orange-400 transition">
            <img src={user?.data?.avatar || "/user.png"} alt="Profile" className="w-full h-full object-cover" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40 mr-10  border-0" align="start">
        <DropdownMenuGroup>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => handelnavigate("/profile")} className={cn(localStorage.getItem("accessToken") ? "" : "hidden")}>
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handelnavigate("/")}>
            Home
          </DropdownMenuItem>
          <DropdownMenuItem className={cn(localStorage.getItem("accessToken") ? "" : "hidden")}>
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuGroup className="px-2 w-full">
          <DropdownMenuItem asChild >
            <AnimatedThemeTogglerDemo />
          </DropdownMenuItem>


        </DropdownMenuGroup>
        <DropdownMenuGroup className={cn(localStorage.getItem("accessToken") ? "hidden" : "")}>
          <DropdownMenuItem asChild >
            {handelSignin()}
            
          </DropdownMenuItem>
          <DropdownMenuItem asChild >
            <Sign_in_hover tag="Sign-up" variant="ghost" />
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuGroup className={cn(localStorage.getItem("accessToken") ? "" : "hidden")}>
          <DropdownMenuItem asChild>
            <Logout />
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
