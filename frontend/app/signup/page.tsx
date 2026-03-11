"use client";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { apiRequest } from "@/lib/api";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const data = await apiRequest<{ token: string }>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(form)
    });
    localStorage.setItem("token", data.token);
    router.push("/dashboard");
  }

  return <form onSubmit={handleSubmit} className="mx-auto mt-20 max-w-md space-y-3 rounded-xl bg-white p-6 shadow"><h1 className="text-2xl font-bold">Create account</h1><input className="w-full rounded border p-2" placeholder="Full name" onChange={(e)=>setForm({...form,fullName:e.target.value})} /><input className="w-full rounded border p-2" placeholder="Email" onChange={(e)=>setForm({...form,email:e.target.value})} /><input type="password" className="w-full rounded border p-2" placeholder="Password" onChange={(e)=>setForm({...form,password:e.target.value})} /><button className="w-full rounded bg-blue-600 p-2 text-white">Sign up</button></form>;
}
