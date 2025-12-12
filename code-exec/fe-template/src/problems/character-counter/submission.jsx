import React, { useState } from 'react';

export default function CharacterCounter() {
    const [text, setText] = useState('');

    return (
        <div>
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type something..."
            />
            <p>Character count: {text.length}</p>
        </div>
    );
}
