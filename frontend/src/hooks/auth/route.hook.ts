"use client";

import { useRouter } from "next/navigation";

export const useNextGoingRoute = () => {
  const router = useRouter();

  const goWithAuth = (nextRoute: string, isAuthenticated: boolean) => {
    if (!isAuthenticated) {
      localStorage.setItem("nextRoute", nextRoute);

      router.push("/login");
      return;
    }

    router.push(nextRoute);
  };

  return { goWithAuth };
};