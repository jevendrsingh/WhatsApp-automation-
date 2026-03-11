"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    try {
      const data = await apiRequest("/auth/login", "POST", undefined, { email, password });
      localStorage.setItem("token", data.access_token);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  }

  return (
    <main className="mx-auto mt-16 max-w-md rounded-xl bg-white p-6 shadow">
      <h1 className="mb-4 text-2xl font-bold">Login</h1>
      <form className="space-y-3" onSubmit={submit}>
        <input className="w-full rounded border p-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full rounded border p-2" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button className="w-full rounded bg-blue-600 p-2 text-white">Login</button>
      </form>
    </main>
  );
}
