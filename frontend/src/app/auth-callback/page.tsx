"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "sonner";
import { useRoutingStore } from "@/store/routing.store";
import { useAuthContext } from "@/providers/main-provider/AuthContextProvider";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // console.log("this is next route",nextRoute);
  
  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");
  const nextRoute = localStorage.getItem("nextRoute"); 

    if (error) {
      toast.error("Authentication failed. Please try again.");
      router.push("/");
      return;
    }

    if (token) {
      localStorage.setItem("accessToken", token);

      // You can optionally fetch user data here using the token
      toast.success("Successfully logged in!");
      router.push(nextRoute || "/");
    } else {
      toast.error("No authentication token received");
      router.push("/");
    }
  }, [searchParams, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Authenticating...</h2>
        <p className="text-muted-foreground">
          Please wait while we log you in.
        </p>
      </div>
    </div>
  );
}
