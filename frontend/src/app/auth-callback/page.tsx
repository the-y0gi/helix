"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

function AuthCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

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
      const nextRoute = localStorage.getItem("nextRoute");
        if(nextRoute){
          router.push(nextRoute);
        }else{
          router.push("/");
        }
      
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

export default function AuthCallback() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">Loading...</h2>
          </div>
        </div>
      }
    >
      <AuthCallbackHandler />
    </Suspense>
  );
}
