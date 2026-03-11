import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center gap-6 p-6 text-center">
      <h1 className="text-4xl font-bold">WhatsApp AI SaaS Automation</h1>
      <p className="text-lg text-slate-600">
        Multi-tenant platform for AI auto-replies, lead capture, and WhatsApp conversation management.
      </p>
      <div className="flex gap-4">
        <Link href="/register" className="rounded bg-blue-600 px-6 py-3 text-white">
          Register Business
        </Link>
        <Link href="/login" className="rounded border border-slate-400 px-6 py-3">
          Login
        </Link>
      </div>
    </main>
  );
}
