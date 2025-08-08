import { Main } from "@/components/main-container";
import { redirect } from "next/navigation";
import { auth } from "../../(auth)/auth";

export default async function TablesPage() {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/guest");
  }

  return (
    <>
      <Main.Header>BREADCRUMB</Main.Header>
      <Main.Body>
        <div className="max-w-6xl p-6">
          <h2 className="mb-4 text-lg font-medium">Table Management</h2>
          <p>Your table management interface will be here...</p>
        </div>
      </Main.Body>
    </>
  );
}
