type ToolCall = {
  function?: {
    name?: string;
    arguments?: string;
  };
};

type OperatorChatResponse = {
  message: string | null;
  tool_calls?: ToolCall[];
};

function getCsrfToken(): string {
  const token = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute("content");

  if (!token) {
    throw new Error("Missing CSRF token meta tag.");
  }

  return token;
}

export async function chatWithOperator(
  userMessage: string,
  onNavigate: (path: string) => void,
): Promise<string> {
  const response = await fetch("/ai/operator/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-TOKEN": getCsrfToken(),
      Accept: "application/json",
    },
    body: JSON.stringify({ message: userMessage }),
  });

  if (!response.ok) {
    throw new Error(`Operator chat failed with status ${response.status}`);
  }

  const payload = (await response.json()) as OperatorChatResponse;

  if (payload.tool_calls) {
    for (const toolCall of payload.tool_calls) {
      if (toolCall.function?.name !== "navigateTo") {
        continue;
      }

      try {
        const args = JSON.parse(toolCall.function.arguments ?? "{}") as {
          path?: string;
        };

        if (args.path) {
          onNavigate(args.path);
          return `Sure! I'm taking you to the ${args.path.replace("/", "")} page now.`;
        }
      } catch {
        // Ignore malformed tool-call payloads and fall back to text response.
      }
    }
  }

  return payload.message ?? "I could not generate a response.";
}
