import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { cn } from "@/lib/utils";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldSeparator,
} from "@/components/ui/field";
import {
  IconBrandAppleFilled,
  IconBrandFacebookFilled,
  IconBrandGoogleFilled,
} from "@tabler/icons-react";
import React, { useState } from "react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { useLogin } from "@/hooks/auth/use-sign";
import { useSignUp } from "@/hooks/auth/use-signup";
import AuthContextProvider, {
  useAuthForm,
} from "@/context/auth/auth-form-provider";
import ButtonHandler from "./buttonhandler";
import { OTPForm } from "./otp-form";
import { Loader } from "@/components/loader";
import { useCurrentUser } from "@/services/hotel/querys";
import LOGO from "@/components/navbar/logo";
import { useResetPassword } from "@/hooks/auth/forgotPassword";
import ResetPasswordContextProvider, { useResetPasswordForm } from "@/context/auth/resetpasswordsteps";
import { ForgotPasswordOTPForm } from "./ForgotPassword";
import { Eye, EyeOff } from "lucide-react";
import ForgetPasswordHandeler from "./forgetpasswordhandelser";
const ConnectWithMedia = [
  {
    title: "Facebook",
    icon: <IconBrandFacebookFilled />,
    url: "/auth/facebook",
  },
  {
    title: "Google",
    icon: <IconBrandGoogleFilled />,
    url: "/auth/google",
  },
  {
    title: "Apple",
    icon: <IconBrandAppleFilled />,
    url: "/auth/apple",
  },
];
export function Sign_in_hover({
  forLike,
  tag: tg,
  variant,
  className
}: {
  forLike?: {
    content: React.ReactNode;
    id?: string;
    type: string;
    do: string;
  }
  className?: string;
  tag: "Log-in" | "Sign-up" | "ResetPassword";
  variant?:
  | "link"
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost";
}) {
  // console.log("trigger menu");
  const [tag, setTag] = React.useState<"Log-in" | "Sign-up" | "ResetPassword">(tg);
  const { type: t, do: d } = forLike || {};


  return (
    <Dialog onOpenChange={(value) => {
      localStorage.setItem(t || "nextRoute", d || "/profile")
      if (t === "nextRoute") {

        localStorage.removeItem("like");
      } else {
        localStorage.removeItem("nextRoute");
      }


      if (!value) {
        localStorage.removeItem(forLike?.type || "nextRoute"); // triggers when dialog closes
      }
    }}>
      <DialogTrigger asChild >
        {forLike ? (
          forLike.content
        ) : (
          <Button variant={variant} className={cn("w-full flex justify-start", className)}>{tg} or Sign-up</Button>
        )}
      </DialogTrigger>
      <DialogContent className="md:w-[500px]  p-0 rounded-2xl overflow-hidden pb-4 w-[340px] z-65">
        <VisuallyHidden>
          <DialogTitle className="sr-only">Login</DialogTitle>
        </VisuallyHidden>

        {tag === "Sign-up" ? (
          <AuthContextProvider>

            <SignupForm setTag={setTag} />
          </AuthContextProvider>
        ) : tag === "ResetPassword" ? (
          <ResetPasswordContextProvider>
            <ResetPassword setTag={setTag} />
          </ResetPasswordContextProvider>
        ) : (
          <SignInForm setTag={setTag} />
        )}
      </DialogContent>
    </Dialog>
  );
}


export function SignupForm({ setTag, className }: {
  setTag: React.Dispatch<React.SetStateAction<"Log-in" | "Sign-up" | "ResetPassword">>
  className?: string
}) {
  const { currentStep, setCurrentStep } = useAuthForm();
  const { loading, methods, onHandleSubmit } = useSignUp();
  const [onOTP, setOnOTP] = React.useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  return (
    <Form {...methods}>
      <form onSubmit={onHandleSubmit}>
        <Loader loading={loading}>
          <div className={cn("flex flex-col w-full", className)} >
            {currentStep === 1 && (
              <div className={cn("flex flex-col   ", className)} >
                <div className="flex flex-col items-center gap-2 text-center mt-5">
                  <a
                    href="#"
                    className="flex flex-col items-center gap-2 font-medium"
                  >
                    <div className="flex  items-center justify-center rounded-md">
                      <LOGO />
                    </div>
                    <span className="sr-only">Hilexa </span>
                  </a>
                  <h1 className="text-xl font-bold">Welcome to Hilexa</h1>
                  {/* <p>
                    Don&apos;t have an account? <a href="/signup">Sign up</a>
                  </p> */}
                </div>

                <FieldGroup className="p-5 px-10">
                  <Field>
                    <FormField
                      control={methods.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input
                              className="rounded-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              id="phone"
                              type="number"
                              placeholder="Enter your phone"
                              disabled={loading}

                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </Field>
                  <Field>
                    <FormField
                      control={methods.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                className="rounded-full pr-12" // pr-12 gives space so text doesn't go under the icon
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                disabled={loading}
                                {...field}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                              >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </Field>

                  <Field>
                    <FormField
                      control={methods.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                className="rounded-full pr-12"
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm Password"
                                disabled={loading}
                                {...field}
                              />
                              <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                              >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </Field>
                  <Field>
                    <ButtonHandler
                      currentStep={currentStep}
                      setCurrentStep={setCurrentStep}
                    />
                  </Field>
                  {/* <FieldSeparator>Or</FieldSeparator>
                  <Field className="grid gap-2 sm:grid-cols-1 md:px-10">
                    {ConnectWithMedia.map((item, i) => (
                      <Button
                        variant="outline"
                        type="button"
                        key={i}
                        onClick={() => {
                          window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/v1${item.url}`;
                        }}
                      >
                        {item.icon}
                        Continue with {item.title}
                      </Button>
                    ))}
                  </Field> */}
                </FieldGroup>
                {/* <div className="flex flex-col items-center gap-2 text-center  md:hidden">
                  <FieldDescription>
                    Already have an account? <a href="/login" className="text-primary font-bold cursor-pointer">Sign in</a>
                  </FieldDescription>
                </div> */}
                <div className="flex flex-col items-center gap-2 text-center   font-bold text-primary">
                  <FieldDescription>
                    Already have an account? <span onClick={() => setTag("Log-in")} className="text-primary font-bold cursor-pointer">Sign in</span>
                  </FieldDescription>
                </div>
                <br />
                <div className="flex flex-col items-center gap-2 text-center  font-bold text-primary">

                  <FieldDescription>
                    Forget Password? <span onClick={() => setTag("ResetPassword")} className="text-primary font-bold cursor-pointer">Reset Password</span>
                  </FieldDescription>
                </div>

                <FieldDescription className="px-6 text-center">
                  By clicking continue, you agree to our{" "}
                  <a href="#">Terms of Service</a> and{" "}
                  <a href="#">Privacy Policy</a>.
                </FieldDescription>

              </div>
            )}

            {currentStep === 2 && (
              <div className="w-full flex justify-center">
                <OTPForm className="bg-transparent border-none " methods={methods} onOTP={onOTP} setOnOTP={setOnOTP} />
              </div>
            )}

          </div>
        </Loader>
      </form>
    </Form>
  );
}

export function SignInForm({ setTag, className }: {
  setTag: React.Dispatch<React.SetStateAction<"Log-in" | "Sign-up" | "ResetPassword">>
  className?: string
}) {
  const [showPassword, setShowPassword] = useState(false);
  const { refetch } = useCurrentUser();
  const { loading, methods, onHandleSubmit } = useLogin({ refetch });


  return (
    <div className={cn("flex flex-col   ", className)} >
      <div className="flex flex-col items-center gap-2 text-center mt-5">
        <a
          href="#"
          className="flex flex-col items-center gap-2 font-medium"
        >
          <div className="flex  items-center justify-center rounded-md">
            <LOGO />
          </div>
          <span className="sr-only">Hilexa </span>
        </a>
        <h1 className="text-xl font-bold">Welcome to Hilexa </h1>
        {/* <p>
          Don&apos;t have an account? <a href="/signup">Sign up</a>
        </p> */}
      </div>
      <Form {...methods}>
        <form onSubmit={onHandleSubmit}>
          <FieldGroup className="p-5 px-10">
            <Field>
              <FormField
                control={methods.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input
                        id="phone"
                        type="number"
                        placeholder="Enter your phone"
                        disabled={loading}
                        className="rounded-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Field>
            <Field>
              <FormField
                control={methods.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          id="password"
                          // Toggle type between "password" and "text"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          disabled={loading}
                          className="rounded-full pr-12" // Add padding on the right for the icon
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={loading}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none disabled:opacity-50"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Field>
            <Field>
              <Button type="submit" className={cn("rounded-full ", loading && "cursor-not-allowed")} disabled={loading} >{loading ? "Logging in..." : "Log in"}</Button>
            </Field>

          </FieldGroup>
        </form>
      </Form>
      {/* <div className="flex flex-col items-center gap-2 text-center  md:hidden font-bold text-primary">
        <FieldDescription>
          Dont't have an account? <a href="/signup" className="text-primary font-bold cursor-pointer">Sign up</a>
        </FieldDescription>
      </div> */}
      <div className="flex flex-col items-center gap-2 text-center   font-bold text-primary">
        <FieldDescription>
          Don&apos;t have an account? <span onClick={() => setTag("Sign-up")} className="text-primary font-bold cursor-pointer">Sign up</span>
        </FieldDescription>
      </div>
      <br />
      <div className="flex flex-col items-center gap-2 text-center  font-bold text-primary">

        <FieldDescription>
          Forget Password? <span onClick={() => setTag("ResetPassword")} className="text-primary font-bold cursor-pointer">Reset Password</span>
        </FieldDescription>
      </div>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>

    </div>
  );
}
export function ResetPassword({ setTag, className }: {
  setTag: React.Dispatch<React.SetStateAction<"Log-in" | "Sign-up" | "ResetPassword">>
  className?: string
}) {
  const { currentStep, setCurrentStep } = useResetPasswordForm();
  const { loading, methods, onHandleSubmit } = useResetPassword();
  const [onOTP, setOnOTP] = React.useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  return (
    <Form {...methods}>
      <form onSubmit={onHandleSubmit}>
        <Loader loading={loading}>
          <div className={cn("flex flex-col", className)} >
            {currentStep === 1 && (
              <div className={cn("flex flex-col   ", className)} >
                <div className="flex flex-col items-center gap-2 text-center mt-5">
                  <a
                    href="#"
                    className="flex flex-col items-center gap-2 font-medium"
                  >
                    <div className="flex  items-center justify-center rounded-md">
                      <LOGO />
                    </div>
                    <span className="sr-only">Hilexa </span>
                  </a>
                  <h1 className="text-xl font-bold">Welcome to Hilexa</h1>
                  {/* <p>
                    Don&apos;t have an account? <a href="/signup">Sign up</a>
                  </p> */}
                </div>

                <FieldGroup className="p-5 px-10">
                  <Field>
                    <FormField
                      control={methods.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input
                              className="rounded-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              id="phone"
                              type="number"
                              placeholder="Enter your phone"
                              disabled={loading}
                              {...field}


                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </Field>

                  <Field>
                    <ForgetPasswordHandeler
                      currentStep={currentStep}
                      setCurrentStep={setCurrentStep}
                    />
                  </Field>
                  {/* <FieldSeparator>Or</FieldSeparator>
                  <Field className="grid gap-2 sm:grid-cols-1 md:px-10">
                    {ConnectWithMedia.map((item, i) => (
                      <Button
                        variant="outline"
                        type="button"
                        key={i}
                        onClick={() => {
                          window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/v1${item.url}`;
                        }}
                      >
                        {item.icon}
                        Continue with {item.title}
                      </Button>
                    ))}
                  </Field> */}
                </FieldGroup>
                {/* <div className="flex flex-col items-center gap-2 text-center  md:hidden">
                  <FieldDescription>
                    Already have an account? <a href="/login" className="text-primary font-bold cursor-pointer">Back to Login</a>
                  </FieldDescription>
                </div> */}
                <div className="flex flex-col items-center gap-2 text-center   font-bold text-primary">
                  <FieldDescription>
                    Already have an account? <span onClick={() => setTag("Log-in")} className="text-primary font-bold cursor-pointer">Back to Login</span>
                  </FieldDescription>
                </div>
                <br />

                <FieldDescription className="px-6 text-center">
                  By clicking continue, you agree to our{" "}
                  <a href="#">Terms of Service</a> and{" "}
                  <a href="#">Privacy Policy</a>.
                </FieldDescription>

              </div>
            )}

            {currentStep === 2 && (
              <div className="w-full flex justify-center">
              <ForgotPasswordOTPForm className="bg-transparent w-full" methods={methods} onOTP={onOTP} setOnOTP={setOnOTP} />
              </div>
              
            )}
            {
              currentStep == 3 && (
                <div className="flex flex-col gap-3 justify-center m-10">
                  <Field>
                    <FormField
                      control={methods.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                className="rounded-full pr-12" // pr-12 gives space so text doesn't go under the icon
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                disabled={loading}
                                {...field}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                              >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </Field>

                  <Field>
                    <FormField
                      control={methods.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                className="rounded-full pr-12"
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm Password"
                                disabled={loading}
                                {...field}
                              />
                              <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                              >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </Field>

                  <Field>
                    <ForgetPasswordHandeler
                      currentStep={currentStep}
                      setCurrentStep={setCurrentStep}
                    />
                  </Field>
                </div>

              )
            }
          </div>
        </Loader>
      </form>
    </Form>
  );
}