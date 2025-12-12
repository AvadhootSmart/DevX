import { render, screen, fireEvent } from "@testing-library/react";
import { expect, test } from "vitest";
import CharacterCounter from "./submission";

test("displays character count", () => {
    render(<CharacterCounter />);

    const input = screen.getByPlaceholderText("Type something...");

    fireEvent.change(input, { target: { value: "Hello" } });
    expect(screen.getByText("Character count: 5")).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "" } });
    expect(screen.getByText("Character count: 0")).toBeInTheDocument();
});
