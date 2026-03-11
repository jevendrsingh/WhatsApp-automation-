export type User = {
  id: string;
  email: string;
  password_hash: string;
  full_name: string;
};

export type Chatbot = {
  id: string;
  user_id: string;
  agent_id: string;
  name: string;
  business_name: string;
  industry: string;
  description: string;
  website_url: string;
  tone: "friendly" | "professional";
  language: string;
  emoji_usage: boolean;
  message_length: "short" | "medium" | "long";
  api_key: string;
};
