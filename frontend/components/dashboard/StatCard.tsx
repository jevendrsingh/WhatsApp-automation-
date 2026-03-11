export default function StatCard({ title, value }: { title: string; value: number | string }) {
  return (
    <article className="rounded-xl border bg-white p-4">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </article>
  );
}
