import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import Checkbox from "./checkbox";

test("renders checkbox input", () => {
  render(<Checkbox />);
  const input = screen.getByRole("checkbox");
  expect(input).toBeDefined();
});

test("accepts and applies custom className", () => {
  render(<Checkbox className="custom-class" />);
  const input = screen.getByRole("checkbox");
  expect(input.className).toContain("custom-class");
});

test("forwards input attributes", () => {
  render(<Checkbox id="terms" name="terms" />);
  const input = screen.getByRole("checkbox") as HTMLInputElement;
  expect(input.id).toBe("terms");
  expect(input.name).toBe("terms");
});

test("can be checked and unchecked", async () => {
  const user = userEvent.setup();
  render(<Checkbox />);
  const input = screen.getByRole("checkbox") as HTMLInputElement;

  expect(input.checked).toBe(false);
  await user.click(input);
  expect(input.checked).toBe(true);
});
