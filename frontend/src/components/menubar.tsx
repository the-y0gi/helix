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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useCurrentUser } from "@/services/hotel/querys";
import { Logout } from "@/app/(personal)/profile/_components/app-sidebar";

export function MenuBar() {
  const { data: user, isLoading } = useCurrentUser();
  const router = useRouter();
  const pathname = usePathname();

  // safer login check
  const isLoggedIn = !!user?.data;

  const handleNavigate = (path: string) => {
    if (pathname === path) return;

    toast.success("Redirecting...");
    router.push(path);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="p-0 rounded-full">
          <div className="w-12 h-12 rounded-full overflow-hidden border border-zinc-400 hover:border-orange-400 transition">
            <img
              src={user?.data?.avatar || "/user.png"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-44 mr-10 border-0 overflow-hidden relative"
        align="start"
      >
        {/* Account Section */}
        <DropdownMenuGroup>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>

          {isLoggedIn && (
            <>
              <DropdownMenuItem onClick={() => handleNavigate("/profile")}>
                Profile
              </DropdownMenuItem>

              <DropdownMenuItem>
                Settings
              </DropdownMenuItem>
            </>
          )}

          <DropdownMenuItem onClick={() => handleNavigate("/")}>
            Home
          </DropdownMenuItem>
        </DropdownMenuGroup>

        {/* Theme Toggle */}
        <DropdownMenuGroup className="px-2 w-full">
          <DropdownMenuItem asChild>
            <AnimatedThemeTogglerDemo />
          </DropdownMenuItem>
        </DropdownMenuGroup>

        {/* Auth Section */}
        {!isLoggedIn && (
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Sign_in_hover tag="Log-in" variant="ghost" />
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Sign_in_hover tag="Sign-up" variant="ghost" />
            </DropdownMenuItem>
          </DropdownMenuGroup>
        )}

        {isLoggedIn && (
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Logout />
            </DropdownMenuItem>
          </DropdownMenuGroup>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}