"use client"
import React, { useEffect } from "react";
import {
  QueryClient,
  QueryClientProvider as QueryClientProviderLib,
} from "@tanstack/react-query";
import { ThemeProvider } from "./theme-provider";
import MobileValueProvider from "@/context/mobile-value";
import { NuqsAdapter } from "nuqs/adapters/react";
import { Payment, useHotelStore } from "@/store/hotel.store";
const MainProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();
  // // const theme = localStorage.getItem("theme")
  // const { setPayments } = useHotelStore();
  // useEffect(()=>{
  //   setPayments(null as unknown as Payment);
  // },[])

  return (
    
    <NuqsAdapter>
      <QueryClientProviderLib client={queryClient}>
        <ThemeProvider defaultTheme={ "dark"} storageKey="vite-ui-theme">
          <MobileValueProvider>
            {children}
          </MobileValueProvider>
        </ThemeProvider>
      </QueryClientProviderLib>
    </NuqsAdapter>
  );
};

export default MainProvider;
