import { render, screen, fireEvent } from "@testing-library/react";
import { expect, test } from "vitest";
import ToggleMessage from "./submission";

test("toggles message visibility", () => {
    render(<ToggleMessage />);

    const button = screen.getByRole("button");

    // Initially hidden (assuming) or check based on text
    // Let's verify initial state: Message should NOT be visible? 
    // Requirement says "Toggle". Let's assume initially hidden.
    expect(screen.queryByText("Hello World")).not.toBeInTheDocument();
    expect(button).toHaveTextContent(/Show/i);

    // Click to show
    fireEvent.click(button);
    expect(screen.getByText("Hello World")).toBeInTheDocument();
    expect(button).toHaveTextContent(/Hide/i);

    // Click to hide
    fireEvent.click(button);
    expect(screen.queryByText("Hello World")).not.toBeInTheDocument();
    expect(button).toHaveTextContent(/Show/i);
});
