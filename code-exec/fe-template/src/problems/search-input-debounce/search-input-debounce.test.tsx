// code-exec/fe-template/src/problems/search-input-debounce/search-input-debounce.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import SearchInput from "./submission";

describe("SearchInput debounce behavior", () => {
  it("renders input", () => {
    render(<SearchInput onSearch={() => {}} />);
    expect(screen.getByTestId("search-input")).toBeInTheDocument();
  });

  it("debounces search calls", async () => {
    vi.useFakeTimers();
    const onSearch = vi.fn();

    render(<SearchInput onSearch={onSearch} delay={300} />);
    const input = screen.getByTestId("search-input");

    fireEvent.change(input, { target: { value: "a" } });
    fireEvent.change(input, { target: { value: "ab" } });

    expect(onSearch).not.toHaveBeenCalled();

    vi.advanceTimersByTime(300);
    expect(onSearch).toHaveBeenCalledOnceWith("ab");

    vi.useRealTimers();
  });

  it("calls onSearch with empty string when cleared", async () => {
    vi.useFakeTimers();
    const onSearch = vi.fn();

    render(<SearchInput onSearch={onSearch} />);
    const input = screen.getByTestId("search-input");

    fireEvent.change(input, { target: { value: "test" } });
    vi.advanceTimersByTime(300);

    fireEvent.change(input, { target: { value: "" } });
    vi.advanceTimersByTime(300);

    expect(onSearch).toHaveBeenLastCalledWith("");

    vi.useRealTimers();
  });
});