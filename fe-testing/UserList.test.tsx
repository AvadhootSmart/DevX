import { render, screen, waitFor } from "@testing-library/react";
import { UserList } from "./UserList";

beforeEach(() => {
  globalThis.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve([{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }]),
    })
  ) as jest.Mock;
});

test("renders user names from API", async () => {
  render(<UserList />);
  await waitFor(() => screen.getByText("Alice"));
  expect(screen.getByText("Bob")).toBeInTheDocument();
});
