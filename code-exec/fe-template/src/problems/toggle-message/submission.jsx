import React, { useState } from 'react';

export default function ToggleMessage() {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div>
            <button onClick={() => setIsVisible(!isVisible)}>
                {isVisible ? 'Hide' : 'Show'} Message
            </button>
            {isVisible && <p>Hello World</p>}
        </div>
    );
}
