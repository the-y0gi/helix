import {
  Card,
  CardContent,
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

export default function SettingsPage() {
  return (
      <Card className="rounded-xl shadow-sm bg-background">
        <CardHeader>
          <CardTitle className="text-xl">
            Customization preferences
          </CardTitle>
          
        </CardHeader>
        <Separator />

        <CardContent className="space-y-6">
          <SettingRow
            title="Currency"
            description="Select your desired currency for transactions and price display, simplifying international use."
          >
            <Select defaultValue="usd">
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="usd">U.S. Dollar</SelectItem>
                <SelectItem value="eur">Euro</SelectItem>
                <SelectItem value="inr">Indian Rupee</SelectItem>
              </SelectContent>
            </Select>
          </SettingRow>

          <Separator />

          <SettingRow
            title="Language"
            description="Choose your preferred language for app display, enhancing your user experience."
          >
            <Select defaultValue="en">
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English (US)</SelectItem>
                <SelectItem value="hi">Hindi</SelectItem>
                <SelectItem value="fr">French</SelectItem>
              </SelectContent>
            </Select>
          </SettingRow>

          <Separator />

          <SettingRow
            title="Personalized recommendations"
            description="We personalize recommendations based on your activity. You can opt out anytime."
          >
            <Switch defaultChecked />
          </SettingRow>

          <Separator />

          <div className="pt-4">
            <h3 className="text-lg font-semibold mb-1">Security</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Manage your account security settings.
            </p>

            <SettingRow
              title="Password"
              description="Easily update your password in settings to maintain account security and ensure privacy."
            >
              <Button variant="outline">Set password</Button>
            </SettingRow>

            <Separator className="my-6" />

            <SettingRow
              title="Remove account"
              description="Delete your account through settings for complete removal of your data from the system."
            >
              <DeleteProfile/>
            </SettingRow>
          </div>
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
