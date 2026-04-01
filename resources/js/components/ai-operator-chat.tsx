import { chatWithOperator } from "@/ai/groq";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { Send, Bot, User, Loader2 } from 'lucide-react';
type Message = {
  id: number;
  role: "user" | "ai";
  text: string;
};

export const AiOperatorChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "ai",
      text: "Hello! I'm your site assistant. How can I help you navigate today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input;
    setInput("");
    const userMsg: Message = { id: Date.now(), role: "user", text: userText };
    setMessages((prev) => [...prev, userMsg]);

    setIsLoading(true);

    try {
      // Connect to the logic we wrote earlier
      const reply = await chatWithOperator(userText, (path) => {
        console.log("Navigating to:", path);
        window.location.href = path; // Uncomment to actually redirect
      });

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "ai", text: reply || "" },
      ]);
    } catch (err) {
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
    <div className="flex h-[500px] w-full max-w-md flex-col overflow-hidden rounded-2xl border bg-white shadow-xl">
      {/* Header */}
      <div className="flex items-center gap-2 bg-blue-600 p-4 text-white">
        <Bot size={20} />
        <span className="font-semibold">Site Operator</span>
      </div>

      {/* Message List */}
      <div className="flex-1 space-y-4 overflow-y-auto bg-gray-50 p-4">
        <AnimatePresence>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-3 text-sm shadow-sm ${
                  m.role === "user"
                    ? "rounded-tr-none bg-blue-500 text-white"
                    : "rounded-tl-none border bg-white text-gray-800"
                }`}
              >
                {m.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <div className="flex justify-start">
            <Loader2 className="animate-spin text-blue-500" size={20} />
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="flex gap-2 border-t bg-white p-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me to go to settings..."
          className="flex-1 rounded-lg border p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <button
          disabled={isLoading}
          className="rounded-lg bg-blue-600 p-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};
