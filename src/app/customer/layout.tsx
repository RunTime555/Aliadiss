import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { CustomerSidebar } from "./sidebar";

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session || session.role !== "CUSTOMER") {
    redirect("/auth/login");
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F4F4F5" }}>
      <CustomerSidebar user={{ name: session.name, email: session.email }} />
      <main
        style={{
          flex: 1,
          padding: "32px 36px",
          overflowY: "auto",
          maxHeight: "100vh",
        }}
      >
        {children}
      </main>
    </div>
  );
}
