import { useState } from "react";

export const AgentBuildMethodology = () => {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>Hello from snippet: {count}</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
};