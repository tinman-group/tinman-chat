import { redirect } from "next/navigation";
import { auth } from "../../(auth)/auth";
import { Main } from "@/components/main-container";

export default async function SettingsPage() {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/guest");
  }

  return (
    <>
      <Main.Header>
        <h1 className="font-semibold">Settings</h1>
      </Main.Header>
      <Main.Body className="p-4">
        <div className="max-w-2xl">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-medium mb-4">General Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Account</h3>
                    <p className="text-sm text-muted-foreground">
                      Manage your account information
                    </p>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {session.user?.email}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Theme</h3>
                    <p className="text-sm text-muted-foreground">
                      Choose your preferred theme
                    </p>
                  </div>
                  <span className="text-sm text-muted-foreground">System</span>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Language</h3>
                    <p className="text-sm text-muted-foreground">
                      Select your language preference
                    </p>
                  </div>
                  <span className="text-sm text-muted-foreground">English</span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium mb-4">AI Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Default Model</h3>
                    <p className="text-sm text-muted-foreground">
                      Choose your default AI model
                    </p>
                  </div>
                  <span className="text-sm text-muted-foreground">Grok-2</span>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Response Length</h3>
                    <p className="text-sm text-muted-foreground">
                      Preferred response length
                    </p>
                  </div>
                  <span className="text-sm text-muted-foreground">Medium</span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium mb-4">Privacy & Data</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Data Retention</h3>
                    <p className="text-sm text-muted-foreground">
                      How long to keep your chat history
                    </p>
                  </div>
                  <span className="text-sm text-muted-foreground">30 days</span>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Analytics</h3>
                    <p className="text-sm text-muted-foreground">
                      Help improve our service with usage data
                    </p>
                  </div>
                  <span className="text-sm text-muted-foreground">Enabled</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Main.Body>
    </>
  );
}