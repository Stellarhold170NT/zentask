import Link from "next/link";
import { LogoutButton } from "@/components/auth/logout-button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/organizations" className="font-bold text-lg">
            ZenTask
          </Link>
          <LogoutButton />
        </div>
      </header>
      <main className="container mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
