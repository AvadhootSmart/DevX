// code-exec/fe-template/src/problems/checkbox-controlled-state/checkbox-controlled-state.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import AgreementCheckbox from "./submission";

describe("AgreementCheckbox controlled behavior", () => {
  it("renders with correct checked state", () => {
    render(
      <AgreementCheckbox checked={true} label="Agree" onChange={() => {}} />
    );
    const checkbox = screen.getByTestId("agreement-checkbox") as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });

  it("calls onChange with next checked value", () => {
    const onChange = vi.fn();
    render(
      <AgreementCheckbox checked={false} label="Agree" onChange={onChange} />
    );

    const checkbox = screen.getByTestId("agreement-checkbox");
    fireEvent.click(checkbox);

    expect(onChange).toHaveBeenCalledOnceWith(true);
  });

  it("respects externally controlled checked prop", () => {
    const { rerender } = render(
      <AgreementCheckbox checked={false} label="Agree" onChange={() => {}} />
    );

    rerender(
      <AgreementCheckbox checked={true} label="Agree" onChange={() => {}} />
    );

    const checkbox = screen.getByTestId("agreement-checkbox") as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });
});