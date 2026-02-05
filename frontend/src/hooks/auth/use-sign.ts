import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginScshema, type LoginFormProps } from "@/schema/auth";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "sonner";

export const useLogin = () => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const navigate = useRouter();
  const { userLogin } = useAuthStore();

  const methods = useForm<LoginFormProps>({
    resolver: zodResolver(LoginScshema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const onHandleSubmit = methods.handleSubmit(async (data) => {
    setLoading(true);
    try {
      const result = await userLogin(data);
      if (result.success) {
        toast.success(result.message || "Login successful!");
        // Redirect or close dialog
        navigate.push("/");
      } else {
        toast.error(result.message || "Login failed");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  });

  return {
    loading,
    methods,
    onHandleSubmit,
  };
};
