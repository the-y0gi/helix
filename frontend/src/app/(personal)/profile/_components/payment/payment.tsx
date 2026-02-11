import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { AlertOverlay } from "@/components/ui/alert-dialouge";

export default function PaymentPage() {
  return (
      <Card className="rounded-xl shadow-sm bg-background">
        <CardHeader>
          <CardTitle className="text-xl">
            Payment Methods
          </CardTitle>
          <CardDescription>
            Securly add or remove payment methods to make it easier when you book 
          </CardDescription>
        </CardHeader>
        <Separator />

        <CardContent className="space-y-6">
          <SettingRow
            title="Payment Methods"
            description="Add a payment method using a secure payment system. "
          >
           <div>add</div>
          </SettingRow>

          <Separator />

          <SettingRow
            title="Tripto gift credit"
            description="Add a gift credit to your account to make it easier when you book."
          >
            <p>Add a gift card</p>
          </SettingRow>

          <Separator />

          <SettingRow
            title="Personalized recommendations"
            description="We personalize recommendations based on your activity. You can opt out anytime."
          >
            <Switch defaultChecked />
          </SettingRow>

          <Separator />

          
        </CardContent>
      </Card>
  );
}

function SettingRow({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-6">
      <div className="max-w-[70%]">
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      </div>

      <div className="shrink-0">{children}</div>
    </div>
  );
}
const DeleteProfile = () => {
  const handelDeleteProfile = () => {
    console.log("delete profile");
  };
  return (
    <AlertOverlay
      trigger="Delete profile"
      variant="destructive"
      handelSumbit={handelDeleteProfile}
      title="Delete profile"
      description="Are you sure to delete your profile"
      continueTitle="Delete"
      canecelTitle="cancel"
    />
  );
};
