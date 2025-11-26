import { render, screen } from "@testing-library/react";

import { Card } from "./Card";

test("has correct styles", () => {
  render(<Card />);
  const card = screen.getByTestId("card");

  const styles = getComputedStyle(card);
  expect(styles.width).toBe("300px");
  expect(styles.height).toBe("200px");
  expect(styles.borderRadius).toBe("12px");
});
