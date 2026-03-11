import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white">
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h1 className="max-w-2xl text-5xl font-bold">Turn Your Website Into an AI Customer Support Agent</h1>
        <p className="mt-4 max-w-2xl text-slate-300">AgentChat AI helps businesses train a Gemini-powered chatbot, deploy in minutes, and convert customer conversations into leads.</p>
        <div className="mt-8 flex gap-3">
          <Link href="/signup" className="rounded-lg bg-blue-500 px-5 py-3">Start free trial</Link>
          <Link href="/login" className="rounded-lg border border-slate-500 px-5 py-3">Login</Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-6 pb-12 md:grid-cols-4">
        {["24/7 AI support", "Instant responses", "Lead generation", "Easy installation"].map((feature) => (
          <div key={feature} className="rounded-xl bg-slate-800 p-4">{feature}</div>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="text-2xl font-semibold">How it works</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-slate-200">
          <li>Train AI with FAQs and business content.</li>
          <li>Add one widget script to your website.</li>
          <li>AI answers queries and captures qualified leads.</li>
        </ol>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="text-2xl font-semibold">Pricing</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {[
            ["Starter", "$19/month"],
            ["Pro", "$49/month"],
            ["Business", "Custom pricing"]
          ].map(([plan, price]) => (
            <div key={plan} className="rounded-xl bg-slate-800 p-5">
              <p className="text-lg font-semibold">{plan}</p>
              <p className="mt-2 text-slate-300">{price}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
