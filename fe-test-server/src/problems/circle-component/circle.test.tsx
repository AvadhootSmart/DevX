import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";

test("renders a circle with correct styles", async () => {
    vi.resetModules();

    // Dynamic import to simulate how we might load user code, 
    // though static import works here too since it's in the same dir.
    // Using dynamic import to match the pattern in hello-counter if that was important,
    // but static is fine for this structure.
    // Let's stick to dynamic import to be safe with module resetting if we reuse this pattern.
    const CircleModule = await import("./submission");
    const Circle = CircleModule.default;

    render(<Circle />);

    const circle = screen.getByTestId("circle");
    expect(circle).toBeInTheDocument();
    expect(circle).toHaveStyle({
        width: "100px",
        height: "100px",
        borderRadius: "50%",
    });
});
