export default function SettingsPage() {
  return (
    <section className="rounded-xl bg-white p-4">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-700">
        <li>Business information</li>
        <li>AI behavior defaults</li>
        <li>Integrations and API keys</li>
      </ul>
    </section>
  );
}
