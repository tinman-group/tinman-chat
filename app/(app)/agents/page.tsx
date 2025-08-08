import { Main } from "@/components/main-container";
import { Activity, Bot, Clock } from "lucide-react";
import { redirect } from "next/navigation";
import { auth } from "../../(auth)/auth";

export default async function AgentsPage() {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/guest");
  }

  return (
    <Main.Content>
      <Main.Header>
        <h1>Agents</h1>
      </Main.Header>
      <Main.Body>
        <div className="max-w-6xl p-6">
          {/* Overview Cards */}
          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-lg border p-4">
              <div className="mb-2 flex items-center gap-2">
                <Bot className="h-5 w-5 text-blue-500" />
                <h3 className="font-medium">Active Agents</h3>
              </div>
              <p className="text-2xl font-bold">3</p>
              <p className="text-muted-foreground text-sm">Currently running</p>
            </div>

            <div className="rounded-lg border p-4">
              <div className="mb-2 flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-500" />
                <h3 className="font-medium">Tasks Completed</h3>
              </div>
              <p className="text-2xl font-bold">127</p>
              <p className="text-muted-foreground text-sm">This month</p>
            </div>

            <div className="rounded-lg border p-4">
              <div className="mb-2 flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-500" />
                <h3 className="font-medium">Avg Response Time</h3>
              </div>
              <p className="text-2xl font-bold">2.3s</p>
              <p className="text-muted-foreground text-sm">Last 24 hours</p>
            </div>
          </div>

          {/* Agents List */}
          <div className="space-y-6">
            <div>
              <h2 className="mb-4 text-lg font-medium">Your Agents</h2>
              <div className="space-y-3">
                {/* Example Agent Cards */}
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                      <Bot className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Customer Support Agent</h3>
                      <p className="text-muted-foreground text-sm">
                        Handles customer inquiries and support tickets
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                      Active
                    </span>
                    <button className="text-muted-foreground hover:text-foreground text-sm">
                      Configure
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                      <Bot className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Sales Assistant</h3>
                      <p className="text-muted-foreground text-sm">
                        Qualifies leads and schedules sales calls
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                      Active
                    </span>
                    <button className="text-muted-foreground hover:text-foreground text-sm">
                      Configure
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
                      <Bot className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Content Writer</h3>
                      <p className="text-muted-foreground text-sm">
                        Creates blog posts and marketing content
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                      Paused
                    </span>
                    <button className="text-muted-foreground hover:text-foreground text-sm">
                      Configure
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="mb-4 text-lg font-medium">Agent Templates</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="hover:bg-accent/50 cursor-pointer rounded-lg border p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Bot className="h-5 w-5" />
                    <h3 className="font-medium">Email Assistant</h3>
                  </div>
                  <p className="text-muted-foreground mb-3 text-sm">
                    Manages email responses and scheduling
                  </p>
                  <button className="text-primary text-sm hover:underline">
                    Create Agent
                  </button>
                </div>

                <div className="hover:bg-accent/50 cursor-pointer rounded-lg border p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Bot className="h-5 w-5" />
                    <h3 className="font-medium">Data Analyst</h3>
                  </div>
                  <p className="text-muted-foreground mb-3 text-sm">
                    Analyzes business data and generates reports
                  </p>
                  <button className="text-primary text-sm hover:underline">
                    Create Agent
                  </button>
                </div>

                <div className="hover:bg-accent/50 cursor-pointer rounded-lg border p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Bot className="h-5 w-5" />
                    <h3 className="font-medium">Social Media Manager</h3>
                  </div>
                  <p className="text-muted-foreground mb-3 text-sm">
                    Creates and schedules social media posts
                  </p>
                  <button className="text-primary text-sm hover:underline">
                    Create Agent
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Main.Body>
    </Main.Content>
  );
}
