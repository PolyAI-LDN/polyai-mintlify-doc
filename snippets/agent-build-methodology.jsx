import { useState } from "react";

const stages = [
  { id: 1, label: "Define", short: "DEF" },
  { id: 2, label: "Design", short: "DES" },
  { id: 3, label: "Build", short: "BLD" },
  { id: 4, label: "Test", short: "TST" },
  { id: 5, label: "Promote", short: "PRO" },
  { id: 6, label: "Review", short: "REV" },
];

export const AgentBuildMethodology = () => {
  const [active, setActive] = useState(0);
  return (
    <div>
      {stages.map((s, i) => (
        <button key={s.id} onClick={() => setActive(i)}>
          {s.label}
        </button>
      ))}
      <p>Active: {stages[active].label}</p>
    </div>
  );
};