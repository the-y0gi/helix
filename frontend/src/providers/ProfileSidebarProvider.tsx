"use client"

import React from "react"
import {
    Icon,
  IconChartBar,
  IconDashboard,
  IconFolder,
  IconHeadphones,
  IconListDetails,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"
import { useQueryState } from "nuqs"
import { Tabs, TabsTrigger } from "@/components/ui/tabscn"
import TripsAccordion from "@/app/(personal)/profile/_components/trips_acordion"



type NavLink = {
  name: string
  value: string
  icon?: Icon
  content: React.ReactNode
  tabs?: {
    name: string
    value: string
  }[]
}

interface SidebarContextValue {
  user: {
    name: string
    email: string
    avatar: string
  }
  navMain: NavLink[]
}

export const trips=[
  
      {name:"All" , value:"all",},
      {name:"Active" , value:"active",},
      {name:"Completed" , value:"completed",},
      {name:"Cancelled" , value:"cancelled",},
    ]

const sidebarData: SidebarContextValue = {
  user: {
    name: "ramkumar",
    email: "ramkumar@gmail.com",
    avatar: "/girl.png",
  },
  navMain: [
    { name: "Personal Data", value: "personal_data", icon: IconDashboard ,
      content:<p>Personal Data</p>
    },
    { name: "Payment Account", value: "payment", icon: IconListDetails, content:<p>Payment Account</p> },
    { name: "Trips", value: "trips", icon: IconChartBar, 
      tabs:trips  ,
    content:<TripsAccordion content={
      trips.map((item)=>{
      return (
        <TabsTrigger key={item.value} className='bg-background data-[state=active]:border-primary dark:data-[state=active]:border-primary h-full w-full justify-start rounded-none border-0 border-l-2 border-transparent data-[state=active]:shadow-none'  value={item.value}>
            <p className="text-sm">{item.name}</p>
          </TabsTrigger>
      )
    })
    } />},
    { name: "Wish Lists", value: "wishlist", icon: IconFolder ,content:<p>Wish Lists</p> },
    { name: "Support", value: "support", icon: IconHeadphones ,content:<p>Support</p> },
    { name: "My Reviews", value: "reviews", icon: IconUsers ,content:<p>My Reviews</p> },
    { name: "Settings", value: "settings", icon: IconSettings ,content:<p>Settings</p> },
  ],
}



const SidebarContext = React.createContext<SidebarContextValue | undefined>(
  undefined
)



export const ProfileSidebarProvider = ({className,
  children,
}: {
  children: React.ReactNode,className?:string
}) => {
  const [tab, setTab] = useQueryState("tab", {
    defaultValue: sidebarData.navMain[0].value ,
    shallow: true,
  });
  return (
   <div className={className}>
     <SidebarContext.Provider value={sidebarData}>
       <Tabs
       value={tab}
        onValueChange={(tab) => setTab(tab)}
        className="flex w-full  flex-row items-start justify-between gap-4"
        defaultValue={"personal_data"}
        orientation="vertical"
        >

      {children}
        </Tabs>
    </SidebarContext.Provider>
   </div>
  )
}



export const useProfileSidebar = () => {
  const context = React.useContext(SidebarContext)

  if (!context) {
    throw new Error(
      "useProfileSidebar must be used within ProfileSidebarProvider"
    )
  }

  return context
}
