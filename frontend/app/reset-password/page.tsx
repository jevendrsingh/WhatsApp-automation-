"use client";
import { FormEvent, useState } from "react";
import { apiRequest } from "@/lib/api";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    const data = await apiRequest<{ message: string }>("/auth/reset-password", { method: "POST", body: JSON.stringify({ email }) });
    setMessage(data.message);
  }

  return <form onSubmit={submit} className="mx-auto mt-20 max-w-md space-y-3 rounded-xl bg-white p-6 shadow"><h1 className="text-2xl font-bold">Reset password</h1><input className="w-full rounded border p-2" placeholder="Email" onChange={(e)=>setEmail(e.target.value)} /><button className="w-full rounded bg-blue-600 p-2 text-white">Send reset link</button><p>{message}</p></form>;
}
