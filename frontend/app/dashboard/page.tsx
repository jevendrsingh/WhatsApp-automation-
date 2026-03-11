"use client";

import { useEffect, useState } from "react";
import StatCard from "@/components/dashboard/StatCard";
import { apiRequest } from "@/lib/api";

export default function DashboardOverview() {
  const [stats, setStats] = useState({ conversationsToday: 0, totalMessages: 0, leadsCaptured: 0 });

  useEffect(() => {
    const token = localStorage.getItem("token") || "";
    apiRequest<typeof stats>("/dashboard/overview", {}, token).then(setStats).catch(() => null);
  }, []);

  return (
    <section className="grid gap-4 md:grid-cols-3">
      <StatCard title="Conversations Today" value={stats.conversationsToday} />
      <StatCard title="Total Messages" value={stats.totalMessages} />
      <StatCard title="Leads Captured" value={stats.leadsCaptured} />
    </section>
  );
}
