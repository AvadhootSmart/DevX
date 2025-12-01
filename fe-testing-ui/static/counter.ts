export const COUNTER = `export default function App() {
  const [count, setCount] = React.useState(0);

  return (
    <button
      className="p-2 bg-green-500 text-white rounded"
      onClick={() => setCount(count + 1)}
    >
      {count}
    </button>
  );
}
`;
export const COUNTER_2 = `
export default function UserComponent() {
  const [count, setCount] = React.useState(null);

  const handleClick = () => {
    setCount((c) => (c === null ? 1 : c + 1));
  };

  return (
    <button onClick={handleClick}>
      {count === null ? "Hello" : count}
    </button>
  );
}
`;
