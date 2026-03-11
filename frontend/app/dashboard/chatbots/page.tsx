import CreateChatbotWizard from "@/components/dashboard/CreateChatbotWizard";

export default function ChatbotsPage() {
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold">Chatbot Creation Wizard</h1>
      <CreateChatbotWizard />
    </div>
  );
}
