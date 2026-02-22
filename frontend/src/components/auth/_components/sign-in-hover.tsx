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
import React from "react";
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
export function Sign_in_hover({
  forLike,
  tag,
  variant,
}: {
  forLike?: {
    content: React.ReactNode;
    id: string;
  }
  tag?: "Log-in" | "Sign-up";
  variant?:
  | "link"
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost";
}) {
  return (
    <AuthContextProvider>
      <Dialog>
        <DialogTrigger asChild>
          {forLike ? (
            forLike.content
          ) : (
            <Button variant={variant} className="w-full flex justify-start">{tag}</Button>
          )}
        </DialogTrigger>
        <DialogContent className="md:w-[425px] p-0 rounded-2xl overflow-hidden pb-4 w-[300px]">
          <VisuallyHidden>
            <DialogTitle className="sr-only">Login</DialogTitle>
          </VisuallyHidden>
          {tag === "Sign-up" ? (
            <SignupForm />
          ) : (
            <SignInForm />
          )}
        </DialogContent>
      </Dialog>
    </AuthContextProvider>
  );
}
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

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { currentStep, setCurrentStep } = useAuthForm();
  const { loading, methods, onHandleSubmit } = useSignUp();
  const [onOTP, setOnOTP] = React.useState<string>("");

  return (
    <Form {...methods}>
      <form onSubmit={onHandleSubmit}>
        <Loader loading={loading}>
          <div className={cn("flex flex-col", className)} {...props}>
            {currentStep === 1 && (
              <div className={cn("flex flex-col   ", className)} {...props}>
                <div className="top-0 flex bg-card flx justify-center items-center w-full py-3">
                  Log in or Sign up
                </div>

                <FieldGroup className="p-5 px-10">
                  <Field>
                    <FormField
                      control={methods.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              id="email"
                              type="email"
                              placeholder="Enter your email"
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
                            <Input
                              id="password"
                              type="password"
                              placeholder="Enter your password"
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
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input
                              id="confirmPassword"
                              type="password"
                              placeholder="confirm Password"
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
                    <ButtonHandler
                      currentStep={currentStep}
                      setCurrentStep={setCurrentStep}
                    />
                  </Field>
                  <FieldSeparator>Or</FieldSeparator>
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
                  </Field>
                </FieldGroup>

                <FieldDescription className="px-6 text-center">
                  By clicking continue, you agree to our{" "}
                  <a href="#">Terms of Service</a> and{" "}
                  <a href="#">Privacy Policy</a>.
                </FieldDescription>
                <div className="flex flex-col items-center gap-2 text-center">
                  {/* <FieldDescription>
          Already have an account? <a href="#">Sign in</a>
        </FieldDescription> */}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <OTPForm methods={methods} onOTP={onOTP} setOnOTP={setOnOTP} />
            )}
          </div>
        </Loader>
      </form>
    </Form>
  );
}

export function SignInForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { loading, methods, onHandleSubmit } = useLogin();

  return (
    <div className={cn("flex flex-col   ", className)} {...props}>
      <div className="top-0 flex bg-card flx justify-center items-center w-full py-3">
        Log in or Sign up
      </div>
      <Form {...methods}>
        <form onSubmit={onHandleSubmit}>
          <FieldGroup className="p-5 px-10">
            <Field>
              <FormField
                control={methods.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
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
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
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
              <Button type="submit">Log in</Button>
            </Field>
            <FieldSeparator>Or</FieldSeparator>
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
            </Field>
          </FieldGroup>
        </form>
      </Form>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
      <div className="flex flex-col items-center gap-2 text-center">
        {/* <FieldDescription>
          Dont't have an account? <a href="#">Sign up</a>
        </FieldDescription> */}
      </div>
    </div>
  );
}
