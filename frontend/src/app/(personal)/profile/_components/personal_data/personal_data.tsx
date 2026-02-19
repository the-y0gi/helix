import {
  FieldGroup,
  FieldSet,
  FieldSeparator,
  Field,
  FieldLabel,
} from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth.store";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserUpdateSchema, type UserUpdateProps } from "@/schema/user";
import { toast } from "sonner";
import React, { useEffect } from "react";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CpontrySelector from "./country";
import { useCurrentUser } from "@/services/querys";
import { currentUser } from "@/services/user.service";

export function UserProfileFields({ currUser, refetch }: { currUser: any; refetch: () => void }) {
  const { updateUser } = useAuthStore();
  // console.log(currUser);

  const [loading, setLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<UserUpdateProps>({
    resolver: zodResolver(UserUpdateSchema),
    defaultValues: {
      firstName: currUser?.data?.firstName || "",
      lastName: currUser?.data?.lastName || "",
      phoneNumber: currUser?.data?.phoneNumber || "",
      gender: (currUser?.data?.gender as "male" | "female" | "other") || "other",
      country: currUser?.data?.country || "India",
      address: currUser?.data?.address || "",
      zipcCode: (currUser as any)?.zipcCode || "",
    },
  });

  useEffect(() => {
    if (currUser) {
      reset({
        firstName: currUser?.data?.firstName || "",
        lastName: currUser?.data?.lastName || "",
        phoneNumber: currUser?.data?.phoneNumber || "",
        gender: (currUser?.data?.gender as "male" | "female" | "other") || "other",
        country: currUser?.data?.country || "India",
        address: currUser?.data?.address || "",
        zipcCode: (currUser as any)?.data?.zipcCode || "",
      });
    }
  }, [currUser, reset]);

  const onHandleSubmit = handleSubmit(async (data) => {
    setLoading(true);
    try {
      console.log(data);

      const result = await updateUser(data);
      if (result.success) {
        toast.success(result.message);
        refetch();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  });

  return (
    <div className="w-full ">
      <form onSubmit={onHandleSubmit}>
        <FieldGroup>
          <FieldSet>
            <FieldGroup className="flex flex-grid">
              <div className="md:flex justify-between items-center gap-5">
                <Field>
                  <FieldLabel>First name</FieldLabel>
                  <Input
                    {...register("firstName")}
                    placeholder="Enter first name"
                  />
                  {errors.firstName && (
                    <span className="text-destructive text-xs">
                      {errors.firstName.message}
                    </span>
                  )}
                </Field>
                <Field>
                  <FieldLabel>Last name</FieldLabel>
                  <Input
                    {...register("lastName")}
                    placeholder="Enter last name"
                  />
                  {errors.lastName && (
                    <span className="text-destructive text-xs">
                      {errors.lastName.message}
                    </span>
                  )}
                </Field>
              </div>
              <div className="md:flex justify-between items-center gap-5">
                <Field>
                  <FieldLabel>Email Address</FieldLabel>
                  <Input
                    value={currUser?.data?.email || ""}
                    disabled
                    className="bg-muted cursor-not-allowed"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                  <Input
                    {...register("phoneNumber")}
                    className="bg-background"
                    id="phone"
                    placeholder="+1 (555) 000-0000"
                    type="tel"
                  />
                </Field>
              </div>
              <div className="md:flex justify-between items-center gap-5">
                <Field>
                  <FieldLabel>Gender</FieldLabel>
                  <Controller
                    control={control}
                    name="gender"
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Choose gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </Field>
                <Field>
                  <FieldLabel>Country</FieldLabel>
                  <Controller
                    control={control}
                    name="country"
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Select Country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="India">India</SelectItem>
                          <SelectItem value="United States">
                            United States
                          </SelectItem>
                          <SelectItem value="Canada">Canada</SelectItem>
                          <SelectItem value="United Kingdom">
                            United Kingdom
                          </SelectItem>
                          <SelectItem value="Germany">Germany</SelectItem>
                          <SelectItem value="France">France</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </Field>
              </div>
              <div className="md:flex justify-between items-center gap-5">
                <Field>
                  <FieldLabel>Address</FieldLabel>
                  <Input
                    {...register("address")}
                    placeholder="Enter your address"
                  />
                </Field>
                <Field>
                  <FieldLabel>zip code</FieldLabel>
                  <Input
                    {...register("zipcCode")}
                    placeholder="Enter your zip code"
                  />
                </Field>
              </div>
            </FieldGroup>
          </FieldSet>
          <FieldSeparator />

          <Field orientation="horizontal" className="md:flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => reset()}>
              Discard
            </Button>
            <Button type="submit" variant={"secondary"} disabled={loading}>
              {loading ? "Saving..." : "Save changes"}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}

export const UserProfileUpdateForm = ({
  className,
  currUser,
  refetch,
}: {
  className?: string;
  currUser: any;
  refetch: () => void;
}) => {
  return (
    <div className={cn(" w-full", className)}>
      <UserProfileFields currUser={currUser} refetch={refetch} />
    </div>
  );
};

export const PersonProfilePersonalData = ({
  className,
}: {
  className?: string;
}) => {
  const { data: currUser, isLoading, isError, refetch } = useCurrentUser();


  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Not authenticated</div>;
  }

  return (
    <PersonalData
      className="w-full "
      avatat={
        <ProfileAvatar className="rounded-xl shadow-sm border border-border" currUser={currUser} refetch={refetch} />
      }
      form={
        <UserProfileUpdateForm className="rounded-xl shadow-sm p-3  border border-border " currUser={currUser} refetch={refetch} />
      }
    />
  );
};

const PersonalData = ({
  avatat,
  form,
  className: cc,
}: {
  className?: string;
  avatat: React.ReactNode;
  form: React.ReactNode;
}) => {
  return (
    <div className={cn("flex flex-col gap-4 w-full", cc)}>
      {avatat}
      {form}
    </div>
  );
};

const ProfileAvatar = ({ className, currUser, refetch }: { className?: string; currUser: any; refetch: () => void }) => {
  const { uploadFile, updateUser } = useAuthStore();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = React.useState(false);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await uploadFile(file);
      if (result.success && result.url) {
        const updateResult = await updateUser({ avatar: result.url });
        if (updateResult.success) {
          toast.success("Profile image updated");
          refetch();
        } else {
          toast.error(updateResult.message);
        }
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };
  console.log(currUser);

  return (
    <div className={cn("flex items-center gap-3 px-2 py-3 w-full ", className)}>
      <div className="relative group cursor-pointer" onClick={handleImageClick}>
        <Image
          src={currUser?.data?.avatar || "/user.png"}
          alt="user"
          width={100}
          height={100}
          className={cn(
            "rounded-full object-cover w-[100px] h-[100px] transition-opacity",
            uploading ? "opacity-50" : "group-hover:opacity-75",
          )}
        />
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
        {!uploading && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="bg-black/50 text-white text-xs px-2 py-1 rounded">
              Update
            </span>
          </div>
        )}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
      <div>
        <p className="text-xl font-medium">
          {currUser
            ? `${currUser.data.firstName || ""} ${currUser.data.lastName || ""}`.trim() ||
            currUser.data.email
            : "Guest User"}
        </p>
        <p className="text-lg text-muted-foreground">
          {currUser?.data?.role || "User"}
        </p>
      </div>
    </div>
  );
};
