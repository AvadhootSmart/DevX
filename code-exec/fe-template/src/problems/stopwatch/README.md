# Stopwatch

## Problem Description
Implement a simple stopwatch with Start, Stop, and Reset functionality.

## Requirements
1.  **Display:** Show the elapsed time in seconds with one decimal place (e.g., "0.0s", "1.5s").
2.  **Controls:**
    *   **Start:** Starts the timer. Disabled if already running.
    *   **Stop:** Pauses the timer. Disabled if not running.
    *   **Reset:** Stops the timer and resets time to 0.
3.  **Accuracy:** Update the timer roughly every 100ms.

## Hints
*   Use `setInterval` and `clearInterval`.
*   Remember to clean up the interval when the component unmounts.
