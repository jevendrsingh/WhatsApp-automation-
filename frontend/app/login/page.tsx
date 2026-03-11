"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { apiRequest } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      const data = await apiRequest<{ token: string }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });
      localStorage.setItem("token", data.token);
      router.push("/dashboard");
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return <form onSubmit={handleSubmit} className="mx-auto mt-20 max-w-md space-y-3 rounded-xl bg-white p-6 shadow"><h1 className="text-2xl font-bold">Log in</h1><input className="w-full rounded border p-2" placeholder="Email" onChange={(e)=>setEmail(e.target.value)} /><input type="password" className="w-full rounded border p-2" placeholder="Password" onChange={(e)=>setPassword(e.target.value)} /><button className="w-full rounded bg-blue-600 p-2 text-white">Login</button><p className="text-sm text-red-600">{error}</p></form>;
}
