(function () {
  const script = document.currentScript;
  const agentId = script?.getAttribute("data-agent-id");
  const apiBase = script?.getAttribute("data-api") || "http://localhost:8080/api/chat";
  if (!agentId) return;

  const bubble = document.createElement("button");
  bubble.innerText = "💬";
  Object.assign(bubble.style, {
    position: "fixed",
    right: "16px",
    bottom: "16px",
    width: "56px",
    height: "56px",
    borderRadius: "9999px",
    border: "none",
    background: "#2563eb",
    color: "white",
    fontSize: "22px",
    zIndex: 99999,
    cursor: "pointer"
  });

  const panel = document.createElement("div");
  panel.innerHTML = `
    <div style="display:flex;flex-direction:column;height:100%">
      <div style="padding:12px;background:#0f172a;color:#fff">AgentChat AI</div>
      <div id="agentchat-messages" style="flex:1;overflow:auto;padding:12px;background:#f8fafc"></div>
      <div style="display:flex;gap:8px;padding:8px;border-top:1px solid #e2e8f0">
        <input id="agentchat-input" placeholder="Ask a question..." style="flex:1;padding:8px;border:1px solid #cbd5e1;border-radius:8px" />
        <button id="agentchat-send" style="padding:8px 12px;background:#2563eb;color:#fff;border:none;border-radius:8px">Send</button>
      </div>
    </div>`;
  Object.assign(panel.style, {
    position: "fixed",
    right: "16px",
    bottom: "84px",
    width: "320px",
    maxWidth: "calc(100vw - 32px)",
    height: "420px",
    background: "white",
    boxShadow: "0 10px 30px rgba(0,0,0,.2)",
    borderRadius: "12px",
    overflow: "hidden",
    display: "none",
    zIndex: 99999
  });

  document.body.appendChild(bubble);
  document.body.appendChild(panel);
  bubble.onclick = () => (panel.style.display = panel.style.display === "none" ? "block" : "none");

  const messages = panel.querySelector("#agentchat-messages");
  const input = panel.querySelector("#agentchat-input");
  const send = panel.querySelector("#agentchat-send");

  function add(role, text) {
    const p = document.createElement("p");
    p.style.margin = "0 0 8px";
    p.innerHTML = `<strong>${role}:</strong> ${text}`;
    messages.appendChild(p);
    messages.scrollTop = messages.scrollHeight;
  }

  async function submit() {
    const value = input.value.trim();
    if (!value) return;
    add("You", value);
    input.value = "";
    add("AI", "Typing...");

    const response = await fetch(apiBase, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agent_id: agentId, message: value })
    });
    const data = await response.json();
    messages.lastChild.remove();
    add("AI", data.reply || "Sorry, no response");
  }

  send.onclick = submit;
  input.addEventListener("keypress", function (e) {
    if (e.key === "Enter") submit();
  });
})();
