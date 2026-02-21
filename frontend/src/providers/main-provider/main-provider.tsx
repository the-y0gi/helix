"use client"
import React from "react";
import {
  QueryClient,
  QueryClientProvider as QueryClientProviderLib,
} from "@tanstack/react-query";
import { ThemeProvider } from "./theme-provider";
import MobileValueProvider from "@/context/mobile-value";
import { NuqsAdapter } from "nuqs/adapters/react";
import AuthContextProviderOfLogin from "./AuthContextProvider";
// import AuthContextProvider from "./AuthContextProvider";
const MainProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();

  return (
    
    <NuqsAdapter>
      <QueryClientProviderLib client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <MobileValueProvider>
            <AuthContextProviderOfLogin>
            {children}
            </AuthContextProviderOfLogin>
          </MobileValueProvider>
        </ThemeProvider>
      </QueryClientProviderLib>
    </NuqsAdapter>
  );
};

export default MainProvider;
