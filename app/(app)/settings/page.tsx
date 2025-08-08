import { Main } from "@/components/main-container";
import { redirect } from "next/navigation";
import { auth } from "../../(auth)/auth";

export default async function SettingsPage() {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/guest");
  }

  return (
    <>
      <Main.Header></Main.Header>
      <Main.Body className="p-4">
        <div className="max-w-2xl">
          <div className="space-y-6">
            <div>
              <h2 className="mb-4 text-lg font-medium">General Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <h3 className="font-medium">Account</h3>
                    <p className="text-muted-foreground text-sm">
                      Manage your account information
                    </p>
                  </div>
                  <span className="text-muted-foreground text-sm">
                    {session.user?.email}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <h3 className="font-medium">Theme</h3>
                    <p className="text-muted-foreground text-sm">
                      Choose your preferred theme
                    </p>
                  </div>
                  <span className="text-muted-foreground text-sm">System</span>
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <h3 className="font-medium">Language</h3>
                    <p className="text-muted-foreground text-sm">
                      Select your language preference
                    </p>
                  </div>
                  <span className="text-muted-foreground text-sm">English</span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="mb-4 text-lg font-medium">AI Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <h3 className="font-medium">Default Model</h3>
                    <p className="text-muted-foreground text-sm">
                      Choose your default AI model
                    </p>
                  </div>
                  <span className="text-muted-foreground text-sm">Grok-2</span>
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <h3 className="font-medium">Response Length</h3>
                    <p className="text-muted-foreground text-sm">
                      Preferred response length
                    </p>
                  </div>
                  <span className="text-muted-foreground text-sm">Medium</span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="mb-4 text-lg font-medium">Privacy & Data</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <h3 className="font-medium">Data Retention</h3>
                    <p className="text-muted-foreground text-sm">
                      How long to keep your chat history
                    </p>
                  </div>
                  <span className="text-muted-foreground text-sm">30 days</span>
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <h3 className="font-medium">Analytics</h3>
                    <p className="text-muted-foreground text-sm">
                      Help improve our service with usage data
                    </p>
                  </div>
                  <span className="text-muted-foreground text-sm">Enabled</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Main.Body>
    </>
  );
}
