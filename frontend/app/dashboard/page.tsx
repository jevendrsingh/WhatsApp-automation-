"use client";

import { FormEvent, useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import Navbar from "@/components/Navbar";

type Business = {
  name: string;
  email: string;
  whatsapp_phone_id?: string;
  business_description?: string;
  faq_knowledge_base?: string;
  response_tone?: string;
};

export default function DashboardPage() {
  const [token, setToken] = useState("");
  const [business, setBusiness] = useState<Business | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  const [whatsappPhoneId, setWhatsappPhoneId] = useState("");
  const [whatsappToken, setWhatsappToken] = useState("");
  const [description, setDescription] = useState("");
  const [faq, setFaq] = useState("");
  const [tone, setTone] = useState("professional");

  useEffect(() => {
    const stored = localStorage.getItem("token") || "";
    setToken(stored);
  }, []);

  useEffect(() => {
    if (!token) return;
    loadData(token);
  }, [token]);

  async function loadData(authToken: string) {
    const [me, msg, lead] = await Promise.all([
      apiRequest("/business/me", "GET", authToken),
      apiRequest("/messages", "GET", authToken),
      apiRequest("/leads", "GET", authToken),
    ]);
    setBusiness(me);
    setMessages(msg);
    setLeads(lead);
    setWhatsappPhoneId(me.whatsapp_phone_id || "");
    setDescription(me.business_description || "");
    setFaq(me.faq_knowledge_base || "");
    setTone(me.response_tone || "professional");
  }

  async function sendManualChat(event: FormEvent) {
    event.preventDefault();
    await apiRequest("/chat", "POST", token, { message, customer_phone: "dashboard-user" });
    setMessage("");
    await loadData(token);
  }

  async function saveWhatsAppConfig(event: FormEvent) {
    event.preventDefault();
    await apiRequest("/business/whatsapp-config", "PUT", token, { whatsapp_phone_id: whatsappPhoneId, whatsapp_token: whatsappToken });
    await loadData(token);
  }

  async function saveAiSettings(event: FormEvent) {
    event.preventDefault();
    await apiRequest("/business/ai-settings", "PUT", token, { business_description: description, faq_knowledge_base: faq, response_tone: tone });
    await loadData(token);
  }

  return (
    <main className="mx-auto max-w-6xl p-6">
      <Navbar />
      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-xl bg-white p-4 shadow">
          <h2 className="mb-3 text-lg font-semibold">Business</h2>
          <p>{business?.name}</p>
          <p className="text-sm text-slate-600">{business?.email}</p>
        </section>

        <section className="rounded-xl bg-white p-4 shadow">
          <h2 className="mb-3 text-lg font-semibold">WhatsApp Integration</h2>
          <form className="space-y-2" onSubmit={saveWhatsAppConfig}>
            <input className="w-full rounded border p-2" placeholder="Phone Number ID" value={whatsappPhoneId} onChange={(e) => setWhatsappPhoneId(e.target.value)} />
            <input className="w-full rounded border p-2" placeholder="Access Token" value={whatsappToken} onChange={(e) => setWhatsappToken(e.target.value)} />
            <button className="rounded bg-blue-600 px-4 py-2 text-white">Save Config</button>
          </form>
        </section>

        <section className="rounded-xl bg-white p-4 shadow">
          <h2 className="mb-3 text-lg font-semibold">AI Settings</h2>
          <form className="space-y-2" onSubmit={saveAiSettings}>
            <textarea className="w-full rounded border p-2" placeholder="Business description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <textarea className="w-full rounded border p-2" placeholder="FAQ Knowledge Base" value={faq} onChange={(e) => setFaq(e.target.value)} />
            <select className="w-full rounded border p-2" value={tone} onChange={(e) => setTone(e.target.value)}>
              <option value="professional">Professional</option>
              <option value="friendly">Friendly</option>
              <option value="formal">Formal</option>
            </select>
            <button className="rounded bg-blue-600 px-4 py-2 text-white">Save AI Settings</button>
          </form>
        </section>

        <section className="rounded-xl bg-white p-4 shadow">
          <h2 className="mb-3 text-lg font-semibold">Manual AI Chat Test</h2>
          <form className="space-y-2" onSubmit={sendManualChat}>
            <textarea className="w-full rounded border p-2" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Ask the AI..." />
            <button className="rounded bg-emerald-600 px-4 py-2 text-white">Send</button>
          </form>
        </section>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <section className="rounded-xl bg-white p-4 shadow">
          <h2 className="mb-3 text-lg font-semibold">Message Inbox</h2>
          <div className="space-y-2 text-sm">
            {messages.map((item) => (
              <div key={item.id} className="rounded border p-2">
                <p><b>From:</b> {item.customer_phone}</p>
                <p><b>Msg:</b> {item.message_text}</p>
                <p><b>AI:</b> {item.ai_reply}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl bg-white p-4 shadow">
          <h2 className="mb-3 text-lg font-semibold">Leads Dashboard</h2>
          <div className="space-y-2 text-sm">
            {leads.map((lead) => (
              <div key={lead.id} className="rounded border p-2">
                <p><b>Phone:</b> {lead.customer_phone}</p>
                <p><b>Status:</b> {lead.status}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
