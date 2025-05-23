import { useState, useEffect } from "react";

function MyTasks({ initialInstructions = [], members = [] }) {
  const [taskAssignments, setTaskAssignments] = useState({});
  const [selectedMember, setSelectedMember] = useState(members[0] || "");

  useEffect(() => {
    console.log("Members received:", members);
    console.log("Instructions received:", initialInstructions);

    if (members.length === 0 || initialInstructions.length === 0) return;

    const assignments = {};
    initialInstructions.forEach((instruction, index) => {
      const member = members[index % members.length];
      if (!assignments[member]) {
        assignments[member] = [];
      }
      assignments[member].push(instruction);
    });

    console.log("Task Assignments:", assignments);
    setTaskAssignments(assignments);

    if (!members.includes(selectedMember)) {
      setSelectedMember(members[0] || "");
    }

    console.log("Selected member:", selectedMember);
  }, [members, initialInstructions]);

  return (
    <div>
      <h2>My Tasks</h2>

      <div>
        <label>Select Team Member: </label>
        <select
          value={selectedMember}
          onChange={(e) => setSelectedMember(e.target.value)}
        >
          {members.map((member) => (
            <option key={member} value={member}>
              {member}
            </option>
          ))}
        </select>
      </div>

      {taskAssignments[selectedMember] && (
        <ul>
          {taskAssignments[selectedMember].map((task, index) => (
            <li key={index}>{task}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyTasks;
