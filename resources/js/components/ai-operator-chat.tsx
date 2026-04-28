import { chatWithOperator } from "@/ai/groq";
import { router } from "@inertiajs/react";
import { Bot, Loader2, MessageCircle, Send, X } from "lucide-react";
import React, { useState } from "react";

type Message = {
  id: number;
  role: "user" | "ai";
  text: string;
};

export function AiOperatorChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "ai",
      text: "Hello! I'm your site assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input;
    setInput("");
    const userMsg: Message = { id: Date.now(), role: "user", text: userText };
    setMessages((prev) => [...prev, userMsg]);

    setIsLoading(true);

    try {
      const reply = await chatWithOperator(userText, (path) => {
        router.visit(path, {
          preserveScroll: true,
        });
      });

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "ai", text: reply || "" },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "ai",
          text: "Sorry, I hit an error. Try again!",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pointer-events-none fixed bottom-7 left-7 z-60">
      <>
        {isOpen && (
          <div className="pointer-events-auto mb-4 flex h-115 w-[min(92vw,380px)] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between bg-green-600 px-4 py-3 text-white">
              <div className="flex items-center gap-2">
                <Bot size={18} />
                <span className="text-sm font-semibold">AI Operator</span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-md p-1 text-slate-300 transition hover:bg-white/10 hover:text-white"
                aria-label="Close AI operator"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 p-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-sm ${
                      message.role === "user"
                        ? "rounded-tr-none bg-emerald-600 text-white"
                        : "rounded-tl-none border border-slate-200 bg-white text-slate-800"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <Loader2
                    className="animate-spin text-emerald-600"
                    size={20}
                  />
                </div>
              )}
            </div>

            <form
              onSubmit={handleSend}
              className="flex gap-2 border-t border-slate-200 bg-white p-3"
            >
              <input
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask me to open dashboard, transfer, profile..."
                className="flex-1 rounded-lg border border-slate-300 p-2 text-sm text-slate-900 focus:ring-2 focus:ring-black focus:outline-none"
              />
              <button
                aria-label="Send message"
                type="submit"
                disabled={isLoading}
                className="rounded-lg bg-emerald-600 p-2 text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        )}
      </>

      <button
        type="button"
        onClick={() => setIsOpen((state) => !state)}
        className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xl transition hover:bg-emerald-500"
        aria-label="Toggle AI operator"
      >
        <MessageCircle size={22} />
      </button>
    </div>
  );
}
