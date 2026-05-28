import { afterEach, beforeEach, expect, test, vi } from "vitest";

import { chatWithOperator } from "./groq";

beforeEach(() => {
  document.head.innerHTML =
    '<meta name="csrf-token" content="test-csrf-token">';
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  document.head.innerHTML = "";
});

test("navigates from structured tool_calls payload", async () => {
  const navigate = vi.fn();

  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        message: null,
        tool_calls: [
          {
            function: {
              name: "navigateTo",
              arguments: '{"path":"/user/transfer"}',
            },
          },
        ],
      }),
    }),
  );

  const reply = await chatWithOperator("open transfer", navigate);

  expect(navigate).toHaveBeenCalledWith("/user/transfer");
  expect(reply).toBe("Taking you to transfer.");
});

test("navigates when model returns tool call as plain text", async () => {
  const navigate = vi.fn();

  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        message: '<navigateTo>{"path":"/user/transfer"}</navigateTo>',
        tool_calls: [],
      }),
    }),
  );

  const reply = await chatWithOperator("go to transfer", navigate);

  expect(navigate).toHaveBeenCalledWith("/user/transfer");
  expect(reply).toBe("Taking you to transfer.");
});

test("returns plain assistant text without navigating", async () => {
  const navigate = vi.fn();

  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        message: "You can update your profile on the profile page.",
        tool_calls: [],
      }),
    }),
  );

  const reply = await chatWithOperator("how can i change my name", navigate);

  expect(navigate).not.toHaveBeenCalled();
  expect(reply).toBe("You can update your profile on the profile page.");
});
