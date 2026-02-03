"use client"
import {
  Menubar,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { AnimatedThemeTogglerDemo } from "./ui/theme-toggle"
import { IconMenu3 } from "@tabler/icons-react"
import { Sign_in_hover } from "./auth/_components/sign-in-hover"
import { usePathname, useRouter } from "next/navigation"
import { toast } from "sonner"

export function NavMenuBar() {
  const navigate = useRouter();
  const pathname = usePathname();
  const handelnavigate = (path:string)=>{
    if(pathname === path){
      return
    }
    toast.success("Redirecting...")
    navigate.push(path)
  }
  return (
    <Menubar >
      <MenubarMenu>
        <MenubarTrigger>
            <IconMenu3/>
        </MenubarTrigger>
        <MenubarContent>
          <MenubarGroup>
            <MenubarItem className="flex items-center px-5" onClick={()=>handelnavigate("/")}>home</MenubarItem>
            <MenubarItem className="flex items-center px-5" onClick={()=>handelnavigate("/profile")}>profile</MenubarItem>
          </MenubarGroup>
          <MenubarSeparator />
          
          <MenubarGroup className="flex items-center px-5">
            {/* <MenubarItem ><ThemeToggle /></MenubarItem> */}
             <AnimatedThemeTogglerDemo/>
          </MenubarGroup>
          <MenubarSeparator />

          <MenubarGroup>
            <MenubarItem className="flex items-center px-5" asChild><Sign_in_hover tag="Log-in" variant="ghost"/></MenubarItem>
            <MenubarItem className="flex items-center px-5" asChild><Sign_in_hover tag="Sign-up" variant="ghost"/></MenubarItem>
            <MenubarItem className="flex items-center px-5" asChild><h1 className="font-bold ">
                Log out</h1></MenubarItem>
          </MenubarGroup>
        </MenubarContent>
      </MenubarMenu>
      
      
      
    </Menubar>
  )
}
