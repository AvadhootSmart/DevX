import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";

test("button initially shows Hello", async () => {
  vi.resetModules();

  const UserComponentModule = await import("./submission.jsx");
  const UserComponent = UserComponentModule.default;

  render(<UserComponent />);

  const button = screen.getByRole("button");
  expect(button).toHaveTextContent("Hello");
});

test("button clicks increment counter text", async () => {
  vi.resetModules();
  const user = userEvent.setup();

  const UserComponentModule = await import("./submission.jsx");
  const UserComponent = UserComponentModule.default;

  render(<UserComponent />);

  const button = screen.getByRole("button");

  // first click -> should change to "1"
  await user.click(button);
  expect(button).toHaveTextContent("1");

  // second click -> should change to "2"
  await user.click(button);
  expect(button).toHaveTextContent("2");

  // third click -> should change to "3"
  await user.click(button);
  expect(button).toHaveTextContent("3");
});
