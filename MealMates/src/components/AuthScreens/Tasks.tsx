import { useState, useEffect } from "react";
import "../../styles/auth.css";

interface MyTasksProps {
  initialInstructions: string[];
  members: string[];
}

function MyTasks({ initialInstructions = [], members = [] }: MyTasksProps) {
  const [taskAssignments, setTaskAssignments] = useState<Record<string, string[]>>({});
  const [selectedMember, setSelectedMember] = useState<string>(members[0] || "");

  useEffect(() => {
    console.log("Members received:", members);
    console.log("Instructions received:", initialInstructions);

    if (members.length === 0 || initialInstructions.length === 0) return;

    const assignments: Record<string, string[]> = {};
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
  }, [members, initialInstructions, selectedMember]);

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2 className="auth-title">Tasks</h2>

        <div className="form-group">
          <label className="form-label">Select Team Member: </label>
          <select
            className="form-input"
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
          <div className="tasks-list">
            <h3>Tasks for {selectedMember}</h3>
            <ul>
              {taskAssignments[selectedMember].map((task: string, index: number) => (
                <li key={index} className="task-item">{task}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyTasks;
