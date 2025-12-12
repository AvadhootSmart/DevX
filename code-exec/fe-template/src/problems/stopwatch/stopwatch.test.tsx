import { render, screen, fireEvent, act } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import Stopwatch from "./submission";

test("starts, stops, and resets the timer", () => {
    vi.useFakeTimers();
    render(<Stopwatch />);

    const startBtn = screen.getByText("Start");
    const stopBtn = screen.getByText("Stop");
    const resetBtn = screen.getByText("Reset");
    const display = screen.getByRole("heading");

    // Initial state
    expect(display).toHaveTextContent("0.0s");

    // Start
    fireEvent.click(startBtn);
    act(() => {
        vi.advanceTimersByTime(1000); // 1 second
    });
    expect(display).toHaveTextContent("1.0s");

    // Stop
    fireEvent.click(stopBtn);
    act(() => {
        vi.advanceTimersByTime(1000); // Should not increase
    });
    expect(display).toHaveTextContent("1.0s");

    // Resume (Start again)
    fireEvent.click(startBtn);
    act(() => {
        vi.advanceTimersByTime(500);
    });
    expect(display).toHaveTextContent("1.5s");

    // Reset
    fireEvent.click(resetBtn);
    expect(display).toHaveTextContent("0.0s");
    expect(startBtn).not.toBeDisabled();

    vi.useRealTimers();
});
