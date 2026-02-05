'use client'
import { FieldGroup, FieldSet, FieldSeparator, Field, FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { DatePickerSimple } from "./date-picker";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function UserProfileFields() {
  return (
    <div className="w-full ">
      <form>
        <FieldGroup>
          <FieldSet>
            <FieldGroup className="flex flex-grid">
              <div className="md:flex justify-between items-center gap-5">
                <Field>
                  <FieldLabel htmlFor="checkout-7j9-card-name-43j">
                    First name
                  </FieldLabel>
                  <Input
                    placeholder="ram"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="checkout-7j9-card-name-43j">
                    Last name
                  </FieldLabel>
                  <Input
                    placeholder="Prashad"
                    required
                  />
                </Field>
              </div>
              <div className="md:flex justify-between items-center gap-5">
                <Field>
                  <FieldLabel htmlFor="checkout-7j9-card-name-43j">
                    Email Address
                  </FieldLabel>
                  <Input
                    placeholder="ramPrshad@gmail.com"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                  <Input
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
                  <Select>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Choose gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  </Field>
                   {/* <DatePickerSimple/> */}
                <Field>
                  <FieldLabel>Country</FieldLabel>
                  <Select>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="au">Australia</SelectItem>
                      <SelectItem value="de">Germany</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              <div className="md:flex justify-between items-center gap-5">
                <Field>
                  <FieldLabel>Address</FieldLabel>
                <Input placeholder="Enter your address" />
                </Field>
                <Field>
                  <FieldLabel>zip code</FieldLabel>
                <Input placeholder="Enter your zip code" />
                </Field>
              </div>
            </FieldGroup>
          </FieldSet>
          <FieldSeparator />

          <Field orientation="horizontal" className="md:flex justify-end">
            <Button variant="outline" type="button">
              Discard
            </Button>
            <Button type="submit" variant={"secondary"}>
              save changes
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
export const UserProfileUpdateForm = ({ className }: { className?: string }) => {
  return (
    <div className={cn(" w-full", className)}>
      <UserProfileFields />
    </div>
  );
};
export const PersonProfilePersonalData = ({ className }: { className?: string }) => {
    return <PersonalData className="w-full"
    avatat={<ProfileAvatar className="rounded-xl shadow-sm " />}
    form={<UserProfileUpdateForm className="rounded-xl shadow-sm p-3 " />}/>
}
const PersonalData = ({
  avatat,
  form,
  className:cc
}: {
    className?: string
  avatat: React.ReactNode;
  form: React.ReactNode;
}) => {
  return (
    <div className={cn("flex flex-col gap-4", cc)}>
      {avatat}
      {form}
    </div>
  );
};
import Image from "next/image";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ProfileAvatar = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex items-center gap-3 px-2 py-3 w-full", className)}>
      <Image
        src="/girl.png"
        alt="user"
        width={100}
        height={100}
        className="rounded-full object-cover"
      />
      <div>
        <p className="text-xl font-medium">ramkumar</p>
        <p className="text-lg text-muted-foreground">Customer Operations</p>
      </div>
    </div>
  );
};