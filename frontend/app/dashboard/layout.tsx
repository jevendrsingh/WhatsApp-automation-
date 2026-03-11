import Navbar from "@/components/Navbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto min-h-screen max-w-6xl space-y-4 p-4">
      <Navbar />
      {children}
    </main>
  );
}
