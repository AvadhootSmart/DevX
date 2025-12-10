import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Automatically unmount components after every test
afterEach(() => {
  cleanup();
});
