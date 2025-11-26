import { render, screen } from "@testing-library/react";
import { Badge } from "./Badge";

test("shows badge if count > 0", () => {
  render(<Badge count={3} />);
  expect(screen.getByTestId("badge")).toHaveTextContent("3");
});

test("hides badge if count = 0", () => {
  render(<Badge count={0} />);
  expect(screen.queryByTestId("badge")).toBeNull();
});
