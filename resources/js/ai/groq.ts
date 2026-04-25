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

const NAVIGABLE_PATHS = new Set([
  "/user/dashboard",
  "/user/transfer",
  "/profile",
  "/notification",
]);

function toNavigatePath(rawPath: unknown): string | null {
  if (typeof rawPath !== "string") {
    return null;
  }

  return NAVIGABLE_PATHS.has(rawPath) ? rawPath : null;
}

function parseNavigateArguments(rawArguments: unknown): string | null {
  if (typeof rawArguments === "string") {
    try {
      const parsed = JSON.parse(rawArguments) as { path?: unknown };

      return toNavigatePath(parsed.path);
    } catch {
      return null;
    }
  }

  if (rawArguments && typeof rawArguments === "object") {
    return toNavigatePath((rawArguments as { path?: unknown }).path);
  }

  return null;
}

function parseNavigateFromRawMessage(message: string | null): string | null {
  if (!message) {
    return null;
  }

  // Make < optional
  const attrMatch = message.match(
    /<?navigateTo[^>]*path=["']([^"']+)["'][^>]*>/i,
  );
  if (attrMatch?.[1]) {
    return toNavigatePath(attrMatch[1]);
  }

  const jsonMatch = message.match(/<?navigateTo[\s>]*(\{[\s\S]*?\})/i);

  if (jsonMatch?.[1]) {
    try {
      const parsed = JSON.parse(jsonMatch[1]) as { path?: unknown };
      return toNavigatePath(parsed.path);
    } catch {
      return null;
    }
  }

  return null;
}

function buildNavigationReply(path: string): string {
  const pageName = path
    .replace(/^\//, "")
    .replace("user/", "")
    .replace("/", " ");

  return `Taking you to ${pageName}.`;
}

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
  const response = await fetch("/api/ai/operator/chat", {
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

  if (payload.tool_calls && payload.tool_calls.length > 0) {
    for (const toolCall of payload.tool_calls) {
      if (toolCall.function?.name !== "navigateTo") {
        continue;
      }

      const path = parseNavigateArguments(toolCall.function.arguments);

      if (path) {
        onNavigate(path);

        return buildNavigationReply(path);
      }
    }
  }

  const fallbackPath = parseNavigateFromRawMessage(payload.message);

  if (fallbackPath) {
    onNavigate(fallbackPath);

    return buildNavigationReply(fallbackPath);
  }

  return payload.message?.trim() || "I could not generate a response.";
}
