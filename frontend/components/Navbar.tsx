"use client";

import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  function logout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  return (
    <div className="mb-6 flex items-center justify-between rounded-xl bg-white p-4 shadow">
      <h1 className="text-xl font-semibold">WhatsApp AI SaaS Dashboard</h1>
      <button className="rounded bg-red-500 px-4 py-2 text-white" onClick={logout}>
        Logout
      </button>
    </div>
  );
}
