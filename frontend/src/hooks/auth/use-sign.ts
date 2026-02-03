import React from "react";
import { useForm } from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod"
import { LoginScshema, type LoginFormProps } from "@/schema/auth";
import { useRouter } from "next/navigation";
export const useLogin=()=>{
      const [loading, setLoading] = React.useState<boolean>(false);
      const navigate = useRouter();
      const methods = useForm<LoginFormProps>({
        resolver: zodResolver(LoginScshema),
        defaultValues: {
          email: "",
          password: "",
        },
        mode: "onChange",
      });
      const onHandleSubmit = methods.handleSubmit(async (data) => {
        setLoading(true)
        try {
          console.log(data);
        } catch (error) {}finally{
          setLoading(false);
        }
      });
    
      return {
        loading,
        methods,
        onHandleSubmit
      }
}