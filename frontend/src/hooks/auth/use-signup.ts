import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type SignUpProps, SignUpSchema } from "@/schema/auth";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "sonner";
import { useCurrentUser } from "@/services/querys";
import { useRoutingStore } from "@/store/routing.store";
import { useAuthContext } from "@/providers/main-provider/AuthContextProvider";

export const useSignUp = () => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const navigate = useRouter();
  // const {nextRoute , setNextRoute} = useRoutingStore()
  const {nextRoute, setNextRoute} = useAuthContext()
  const { userSignup, verifyOTP } = useAuthStore();

  const methods = useForm<SignUpProps>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });
  const { refetch, isLoading } = useCurrentUser();
  const onHandleSubmit = methods.handleSubmit(async (data) => {
    setLoading(true);
    console.log("this is next route", nextRoute);
    
    try {
      const result = await verifyOTP({ email: data.email, otp: data.otp });
      if (result.success) {
        toast.success(result.message || "Account created successfully!");
        await refetch();
        navigate.push(nextRoute);
        // Redirect or close dialog
      } else {
        toast.error(result.message || "Failed to verify OTP");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  });

  const onGenerateOtp = async (
    email: string,
    password: string,
    onNext: React.Dispatch<React.SetStateAction<number>>,
  ) => {
    setLoading(true);
    try {
      const result = await userSignup({ email, password });
      if (result.success) {
        toast.success(result.message || "OTP sent to your email");
        onNext((prev) => prev + 1);
      } else {
        toast.error(result.message || "Failed to send OTP");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    methods,
    onHandleSubmit,
    onGenerateOtp,
  };
};
