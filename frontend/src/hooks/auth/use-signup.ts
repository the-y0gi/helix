import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type SignUpProps, SignUpSchema } from "@/schema/auth";
import { useRouter } from "next/navigation";
export const useSignUp = () => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const navigate = useRouter();
  const methods = useForm<SignUpProps>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });
  const onHandleSubmit = methods.handleSubmit(async (data) => {
    setLoading(true);
    try {
      console.log(data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  });
  const onGenerateOtp = (
    email: string,
    password: string,
    onNext: React.Dispatch<React.SetStateAction<number>>,
  ) => {
    setLoading(true)
    try {
      console.log(email , password);
      
      onNext((prev) => prev + 1);
    } catch (error) {
      
    }finally{
      setLoading(false)
    }
  };

  return {
    loading,
    methods,
    onHandleSubmit,
    onGenerateOtp,
  };
};
