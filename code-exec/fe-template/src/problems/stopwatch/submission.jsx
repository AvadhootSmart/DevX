import React, { useState, useEffect, useRef } from 'react';

export default function Stopwatch() {
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setTime((prevTime) => prevTime + 1);
            }, 100); // Tenth of a second for faster feedback in tests/usage
        } else {
            clearInterval(intervalRef.current);
        }
        return () => clearInterval(intervalRef.current);
    }, [isRunning]);

    const handleReset = () => {
        setIsRunning(false);
        setTime(0);
    };

    return (
        <div>
            <h1>{(time / 10).toFixed(1)}s</h1>
            <button onClick={() => setIsRunning(true)} disabled={isRunning}>Start</button>
            <button onClick={() => setIsRunning(false)} disabled={!isRunning}>Stop</button>
            <button onClick={handleReset}>Reset</button>
        </div>
    );
}
