// "use client";

// import { AnimatedThemeTogglerDemo } from "./ui/theme-toggle";
// import { Sign_in_hover } from "./auth/_components/sign-in-hover";
// import { usePathname, useRouter } from "next/navigation";
// import { toast } from "sonner";

// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// import { Logout } from "@/app/(personal)/profile/_components/app-sidebar";
// import { useNextGoingRoute } from "@/hooks/auth/route.hook";
// import { Skeleton } from "./ui/skeleton";
// import { useCurrentUser } from "@/services/hotel/querys";

// export function MenuBar() {
//   const { data: user, isLoading, refetch } = useCurrentUser();
//   const router = useRouter();
//   const pathname = usePathname();
//   const { goWithAuth } = useNextGoingRoute();
//   // safer login check
//   const isLoggedIn = !!user?.data;

//   const handleNavigate = (path: string) => {
//     if (pathname === path) return;
//     goWithAuth(path, isLoggedIn);

//     toast.success("Redirecting...");
//     // router.push(path);
//   };

//   if (isLoading) {
//     return <div><Skeleton className="size-10 shrink-0 rounded-full" /></div>;
//   }

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button variant="ghost" className="p-0 rounded-full">
//           <div className="md:w-12 md:h-12 h-8 w-8 rounded-full overflow-hidden border border-border hover:border-orange-400 transition">
//             <img
//               src={user?.data?.avatar || "/user.png"}
//               alt="Profile"
//               className="w-full h-full object-cover rounded-full"
//             />
//           </div>
//         </Button>
//       </DropdownMenuTrigger>

//       <DropdownMenuContent
//         className="w-44 mr-10 border-0 overflow-hidden relative"
//         align="start"
//       >
//         {/* Account Section */}
//         <DropdownMenuGroup>
//           <DropdownMenuLabel>My Account</DropdownMenuLabel>

//           {!isLoggedIn ? (
//             <Sign_in_hover
//               tag="Log-in"
//               variant="ghost"
//               forLike={{
//                 content: (
//                   <div className="px-2 cursor-pointer">
//                     Profile
//                   </div>
//                 ),
//                 type: "nextRoute",
//                 do: "/profile",
//                 id: "/profile",
//               }}
//             />
//           ) : (
//             <DropdownMenuItem onClick={() => handleNavigate("/profile")}>
//               Profile
//             </DropdownMenuItem>
//           )}
//           {/* <DropdownMenuItem onClick={() => handleNavigate("/profile")}>
//                 Profile
//               </DropdownMenuItem> */}

//           {/* <DropdownMenuItem>
//                 Settings
//               </DropdownMenuItem> */}


//           <DropdownMenuItem onClick={() => handleNavigate("/")}>
//             Home
//           </DropdownMenuItem>
//         </DropdownMenuGroup>

//         {/* Theme Toggle */}
//         <DropdownMenuGroup className="px-2 w-full">
//           <DropdownMenuItem asChild>
//             <AnimatedThemeTogglerDemo />
//           </DropdownMenuItem>
//         </DropdownMenuGroup>

//         {/* Auth Section */}
//         {!isLoggedIn && (
//           <DropdownMenuGroup>
//             <DropdownMenuItem asChild>
//               <Sign_in_hover tag="Log-in" variant="ghost" />
//             </DropdownMenuItem>

//             <DropdownMenuItem asChild>
//               <Sign_in_hover tag="Sign-up" variant="ghost" />
//             </DropdownMenuItem>
//           </DropdownMenuGroup>
//         )}

//         {isLoggedIn && (
//           <DropdownMenuGroup>
//             <DropdownMenuItem asChild>
//               <Logout refetch={refetch} />
//             </DropdownMenuItem>
//           </DropdownMenuGroup>
//         )}
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }
"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import {
  User,
  Home,
  Settings,
  LogOut,
  LogIn,
  UserPlus,
  ChevronRight
} from "lucide-react";

import { AnimatedThemeTogglerDemo } from "./ui/theme-toggle";
import { Sign_in_hover } from "./auth/_components/sign-in-hover";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Logout } from "@/app/(personal)/profile/_components/app-sidebar";
import { useNextGoingRoute } from "@/hooks/auth/route.hook";
import { Skeleton } from "./ui/skeleton";
import { useCurrentUser } from "@/services/hotel/querys";

export function MenuBar() {
  const { data: user, isLoading, refetch } = useCurrentUser();
  const pathname = usePathname();
  const { goWithAuth } = useNextGoingRoute();

  const isLoggedIn = !!user?.data;

  const handleNavigate = (path: string) => {
    if (pathname === path) return;
    goWithAuth(path, isLoggedIn);
    toast.success("Redirecting...");
  };

  if (isLoading) {
    return <Skeleton className="h-10 w-10 shrink-0 rounded-full" />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full border-2 border-transparent hover:border-orange-400 p-0 transition-all duration-300"
        >
          <div className="relative h-full w-full overflow-hidden rounded-full border border-border">
            <Image
              src={user?.data?.avatar || "/user.png"}
              alt="Profile"
              fill
              className="object-cover"
            />
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-56 mt-2 mr-4 p-2 rounded-xl border border-border/50 shadow-xl backdrop-blur-md"
        align="end"
      >
        <DropdownMenuLabel className="px-3 py-2">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-semibold leading-none">
              {isLoggedIn ? user?.data?.name : "Guest User"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {isLoggedIn ? user?.data?.email : "Manage your preferences"}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="my-2" />

        <DropdownMenuGroup>
          {!isLoggedIn ? (
            <Sign_in_hover
              tag="Log-in"
              variant="ghost"
              forLike={{
                content: (
                  <div className="flex w-full items-center justify-between px-2 py-1.5 text-sm transition-colors hover:text-orange-500">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </div>
                    <ChevronRight className="h-3 w-3 opacity-50" />
                  </div>
                ),
                type: "nextRoute",
                do: "/profile",
                id: "/profile",
              }}
            />
          ) : (
            <DropdownMenuItem
              onClick={() => handleNavigate("/profile")}
              className="flex items-center gap-2 px-3 py-2 cursor-pointer focus:bg-orange-50 focus:text-orange-600 dark:focus:bg-orange-950/20"
            >
              <User className="h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem
            onClick={() => handleNavigate("/")}
            className="flex items-center gap-2 px-3 py-2 cursor-pointer"
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-2" />

        {/* Custom Styling for Theme Toggler to match menu items */}
        <div className="px-1 py-1">
          <AnimatedThemeTogglerDemo />
        </div>

        <DropdownMenuSeparator className="my-2" />

        {/* Auth Section */}
        {!isLoggedIn ? (
          <DropdownMenuGroup>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Sign_in_hover
                tag="Log-in"
                variant="ghost"
                className="w-full justify-start gap-2"
              />
            </DropdownMenuItem>

            <DropdownMenuItem asChild className="cursor-pointer text-orange-500 focus:text-orange-600">
              <Sign_in_hover
                tag="Sign-up"
                variant="ghost"
                className="w-full justify-start gap-2"
              />
            </DropdownMenuItem>
          </DropdownMenuGroup>
        ) : (
          <DropdownMenuGroup>
            <DropdownMenuItem
              asChild
              className="flex items-center gap-2 px-3 py-2 text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
            >
              <Logout refetch={refetch} />
            </DropdownMenuItem>
          </DropdownMenuGroup>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}