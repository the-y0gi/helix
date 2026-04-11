// "use client";

// import React, { useEffect } from "react";
// import {
//   Icon,
//   IconChartBar,
//   IconDashboard,
//   IconFolder,
//   IconHeadphones,
//   IconListDetails,
//   IconSettings,
//   IconUsers,
// } from "@tabler/icons-react";
// import { useQueryState } from "nuqs";
// import { Tabs, TabsTrigger } from "@/components/ui/tabscn";
// import TripsAccordion from "@/app/(personal)/profile/_components/trips_acordion";
// import { cn } from "@/lib/utils";
// import { useParams, usePathname } from "next/navigation";

// type NavLink = {
//   name: string;
//   value: string;
//   icon?: Icon;
//   content: React.ReactNode;
//   tabs?: {
//     name: string;
//     value: string;
//   }[];
// };

// interface SidebarContextValue {
//   user: {
//     name: string;
//     email: string;
//     avatar: string;
//   };
//   navMain: NavLink[];
// }

// export const bookings = [
//   { name: "All", value: "all" },
//   { name: "Active", value: "active" },
//   { name: "Completed", value: "completed" },
//   { name: "Cancelled", value: "cancelled" },
// ];

// let sidebarData: SidebarContextValue = {
//   user: {
//     name: "user",
//     email: "user@gmail.com",
//     avatar: "/icons/user.png",
//   },
//   navMain: [
//     {
//       name: "Personal Data",
//       value: "personal_data",
//       icon: IconDashboard,
//       content: <p>Personal Data</p>,
//     },
//     {
//       name: "Payment Account",
//       value: "payment",
//       icon: IconListDetails,
//       content: <p>Payment Account</p>,
//     },
//     {
//       name: "Bookings",
//       value: "bookings",
//       icon: IconChartBar,
//       tabs: bookings,
//       content: (
//         <TripsAccordion
//           content={bookings.map((item) => {
//             return (
//               <TabsTrigger
//                 key={item.value}
//                 className="
//   bg-background
//   h-full w-full justify-start rounded-none
//   border-0 border-l-2
//   border-zinc-300 dark:border-zinc-700
//   text-muted-foreground

//   data-[state=active]:border-blue-600
//   data-[state=active]:text-blue-600
//   dark:data-[state=active]:border-blue-600
//   data-[state=active]:bg-transparent
//   data-[state=active]:shadow-none
// "
//                 value={item.value}
//               >
//                 <p className="text-sm">{item.name}</p>
//               </TabsTrigger>
//             );
//           })}
//         />
//       ),
//     },
//     {
//       name: "Wish Lists",
//       value: "wishlist",
//       icon: IconFolder,
//       content: <p>Wish Lists</p>,
//     },
//     {
//       name: "Support",
//       value: "support",
//       icon: IconHeadphones,
//       content: <p>Support</p>,
//     },
//     {
//       name: "My Reviews",
//       value: "reviews",
//       icon: IconUsers,
//       content: <p>My Reviews</p>,
//     },
//     {
//       name: "Settings",
//       value: "settings",
//       icon: IconSettings,
//       content: <p>Settings</p>,
//     },
//   ],
// };

// const SidebarContext = React.createContext<SidebarContextValue | undefined>(
//   undefined,
// );

// export const ProfileSidebarProvider = ({
//   className,
//   children,
// }: {
//   children: React.ReactNode;
//   className?: string;
// }) => {
//   const params= useParams();
//   const pathname = usePathname();
  

//   const [tab, setTab] = useQueryState("tab", {
//     defaultValue: sidebarData.navMain[0].value,
//     shallow: true,
//   });
//   useEffect(()=>{
//     setTab(pathname.split("/").pop() || "trips");
    
//   }, [pathname])
//   return (
//     <div className={className}>
//       <SidebarContext.Provider value={sidebarData}>
//         <Tabs
//           value={tab}
//           onValueChange={(tab) => setTab(tab)}
//           className={cn("flex w-full  flex-row items-start justify-between gap-4 ", className)}
//           orientation="vertical"
//         >
//           {children}
//         </Tabs>
//       </SidebarContext.Provider>
//     </div>
//   );
// };

// export const useProfileSidebar = () => {
//   const context = React.useContext(SidebarContext);

//   if (!context) {
//     throw new Error(
//       "useProfileSidebar must be used within ProfileSidebarProvider",
//     );
//   }

//   return context;
// };
"use client";

import React, { useEffect } from "react";
import {
  IconChartBar,
  IconDashboard,
  IconFolder,
  IconHeadphones,
  IconListDetails,
  IconSettings,
  IconUsers,
  TablerIcon, // Import the correct type
} from "@tabler/icons-react";
import { useQueryState } from "nuqs";
import { Tabs, TabsTrigger } from "@/components/ui/tabscn";
import TripsAccordion from "@/app/(personal)/profile/_components/trips_acordion";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

// --- Types ---

type NavLink = {
  name: string;
  value: string;
  icon?: TablerIcon; // Use TablerIcon type
  content: React.ReactNode;
  tabs?: {
    name: string;
    value: string;
  }[];
};

interface SidebarContextValue {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  navMain: NavLink[];
}

// --- Data ---

export const bookings = [
  { name: "All", value: "all" },
  { name: "Active", value: "active" },
  { name: "Completed", value: "completed" },
  { name: "Cancelled", value: "cancelled" },
];

const sidebarData: SidebarContextValue = {
  user: {
    name: "user",
    email: "user@gmail.com",
    avatar: "/icons/user.png",
  },
  navMain: [
    {
      name: "Personal Data",
      value: "personal_data",
      icon: IconDashboard,
      content: <p>Personal Data</p>,
    },
    {
      name: "Payment Account",
      value: "payment",
      icon: IconListDetails,
      content: <p>Payment Account</p>,
    },
    {
      name: "Bookings",
      value: "bookings",
      icon: IconChartBar,
      tabs: bookings,
      content: (
        <TripsAccordion
          content={bookings.map((item) => (
            <TabsTrigger
              key={item.value}
              value={item.value}
              className="bg-background h-full w-full justify-start rounded-none border-0 border-l-2 border-zinc-300 dark:border-zinc-700 text-muted-foreground data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <p className="text-sm">{item.name}</p>
            </TabsTrigger>
          ))}
        />
      ),
    },
    {
      name: "Wish Lists",
      value: "wishlist",
      icon: IconFolder,
      content: <p>Wish Lists</p>,
    },
    {
      name: "Support",
      value: "support",
      icon: IconHeadphones,
      content: <p>Support</p>,
    },
    {
      name: "My Reviews",
      value: "reviews",
      icon: IconUsers,
      content: <p>My Reviews</p>,
    },
    {
      name: "Settings",
      value: "settings",
      icon: IconSettings,
      content: <p>Settings</p>,
    },
  ],
};

// --- Context & Provider ---

const SidebarContext = React.createContext<SidebarContextValue | undefined>(undefined);

export const ProfileSidebarProvider = ({
  className,
  children,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const pathname = usePathname();

  const [tab, setTab] = useQueryState("tab", {
    defaultValue: sidebarData.navMain[0].value,
    shallow: true,
  });

  // Sync tab state with URL path if necessary
  // useEffect(() => {
  //   const lastPathSegment = pathname.split("/").pop();
  //   if (lastPathSegment && lastPathSegment !== tab) {
  //     // Logic check: only set if it matches one of your navMain values
  //     const isValidTab = sidebarData.navMain.some(n => n.value === lastPathSegment);
  //     if (isValidTab) {
  //       setTab(lastPathSegment);
  //     }
  //   }
  // }, [pathname, tab, setTab]);

  return (
    <SidebarContext.Provider value={sidebarData}>
      <div className={cn("w-full", className)}>
        <Tabs
          value={tab ?? sidebarData.navMain[0].value}
          onValueChange={(val) => setTab(val)}
          className="flex w-full flex-row items-start justify-between gap-4"
          orientation="vertical"
        >
          {children}
        </Tabs>
      </div>
    </SidebarContext.Provider>
  );
};

export const useProfileSidebar = () => {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useProfileSidebar must be used within ProfileSidebarProvider");
  }
  return context;
};