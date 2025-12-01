import { render, fireEvent, screen } from "@testing-library/react";

export const counterTests = [
  function rendersInitialCount(mod) {
    const App = mod.default ?? mod.App;
    render(React.createElement(App));
    expect(screen.getByTestId("counter")).toHaveTextContent("0");
  },

  function increments(mod) {
    const App = mod.default ?? mod.App;
    render(React.createElement(App));
    const btn = screen.getByTestId("counter");
    fireEvent.click(btn);
    expect(btn).toHaveTextContent("1");
  },
];
