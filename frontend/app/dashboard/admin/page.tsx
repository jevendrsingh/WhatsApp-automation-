export default function AdminPage() {
  return (
    <section className="grid gap-3 md:grid-cols-3">
      {[
        ["Total users", "--"],
        ["Active chatbots", "--"],
        ["AI usage", "--"],
        ["API requests", "--"],
        ["Subscription plans", "Starter / Pro / Business"]
      ].map(([label, value]) => (
        <div key={label} className="rounded-xl bg-white p-4">
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-2 text-xl font-semibold">{value}</p>
        </div>
      ))}
    </section>
  );
}
