"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  ["Overview", "/dashboard"],
  ["Chatbots", "/dashboard/chatbots"],
  ["Knowledge Base", "/dashboard/knowledge-base"],
  ["Conversations", "/dashboard/conversations"],
  ["Leads", "/dashboard/leads"],
  ["Settings", "/dashboard/settings"],
  ["Admin", "/dashboard/admin"]
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-lg font-semibold">AgentChat AI</p>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            router.push("/login");
          }}
          className="rounded-lg bg-slate-900 px-3 py-2 text-sm text-white"
        >
          Logout
        </button>
      </div>
      <div className="grid gap-2 md:grid-cols-4">
        {links.map(([label, href]) => (
          <Link
            key={href}
            href={href}
            className={`rounded-lg px-3 py-2 text-sm ${pathname === href ? "bg-blue-600 text-white" : "bg-slate-100"}`}
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
