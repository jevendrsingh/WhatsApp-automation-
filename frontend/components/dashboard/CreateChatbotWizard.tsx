"use client";

import { useState } from "react";
import { apiRequest } from "@/lib/api";

const steps = ["Business Info", "Knowledge Base", "AI Behavior", "Generate"];

export default function CreateChatbotWizard() {
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<{ agentId: string; apiKey: string; embedScript: string } | null>(null);
  const [form, setForm] = useState({
    name: "Support Bot",
    businessName: "",
    industry: "",
    description: "",
    websiteUrl: "",
    knowledgeText: "",
    tone: "friendly",
    language: "English",
    emojiUsage: true,
    messageLength: "medium"
  });

  const token = typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";

  async function createBot() {
    const payload = await apiRequest<{ agentId: string; apiKey: string; embedScript: string }>(
      "/chatbots",
      {
        method: "POST",
        body: JSON.stringify(form)
      },
      token
    );
    setResult(payload);
  }

  return (
    <section className="rounded-xl bg-white p-4 shadow-sm">
      <p className="mb-3 text-sm text-slate-500">Step {step + 1}: {steps[step]}</p>
      {step === 0 && (
        <div className="grid gap-2 md:grid-cols-2">
          {[
            ["businessName", "Business Name"],
            ["industry", "Industry"],
            ["description", "Description"],
            ["websiteUrl", "Website URL"]
          ].map(([key, label]) => (
            <input key={key} placeholder={label} className="rounded border p-2" onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
          ))}
        </div>
      )}
      {step === 1 && (
        <textarea
          className="h-40 w-full rounded border p-2"
          placeholder="Paste FAQs, product info, policies, and documentation..."
          onChange={(e) => setForm({ ...form, knowledgeText: e.target.value })}
        />
      )}
      {step === 2 && (
        <div className="grid gap-2 md:grid-cols-2">
          <select className="rounded border p-2" onChange={(e) => setForm({ ...form, tone: e.target.value })}>
            <option value="friendly">Friendly</option>
            <option value="professional">Professional</option>
          </select>
          <select className="rounded border p-2" onChange={(e) => setForm({ ...form, messageLength: e.target.value })}>
            <option value="short">Short</option>
            <option value="medium">Medium</option>
            <option value="long">Long</option>
          </select>
        </div>
      )}
      {step === 3 && (
        <div className="space-y-2 rounded bg-slate-50 p-3 text-sm">
          <p>Generate your chatbot credentials and install script.</p>
          <button className="rounded bg-blue-600 px-4 py-2 text-white" onClick={createBot}>Generate Chatbot</button>
          {result && (
            <div className="space-y-1">
              <p><strong>Agent ID:</strong> {result.agentId}</p>
              <p><strong>API Key:</strong> {result.apiKey}</p>
              <pre className="overflow-auto rounded bg-slate-900 p-2 text-white">{result.embedScript}</pre>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <button className="rounded border px-4 py-2" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>Back</button>
        <button className="rounded bg-slate-900 px-4 py-2 text-white" disabled={step === steps.length - 1} onClick={() => setStep((s) => s + 1)}>Next</button>
      </div>
    </section>
  );
}
