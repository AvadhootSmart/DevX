import { render, screen, fireEvent } from "@testing-library/react";
import { Toggle } from "./Toggle";


test("toggles between ON and OFF", () => {
    render(<Toggle />);
    const button = screen.getByRole("button");

    // This is correct: checks the text content.
    expect(button).toHaveTextContent("OFF"); 
    
    fireEvent.click(button);
    
    // ❌ Incorrect: .toBe() compares object identity, not text.
    // expect(button).toBe("ON"); 
    // ✅ Correct: Use toHaveTextContent to assert the new text.
    expect(button).toHaveTextContent("ON"); 
    
    fireEvent.click(button);
    
    // ❌ Incorrect: .toBe() compares object identity, not text.
    // expect(button).toBe("OFF");
    // ✅ Correct: Use toHaveTextContent to assert the new text.
    expect(button).toHaveTextContent("OFF");
});
