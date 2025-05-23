import { useState } from "react";

function TeamMembers({ members, setMembers }) {
  const [newMember, setNewMember] = useState("");

  const handleAddMember = () => {
    if (!newMember.trim()) return;
    setMembers([...members, newMember.trim()]);
    setNewMember("");
  };

  return (
    <div>
      <h2>Team Members</h2>
      <ul>
        {members.map((member, index) => (
          <li key={index}>{member}</li>
        ))}
      </ul>
      <input
        type="text"
        value={newMember}
        onChange={(e) => setNewMember(e.target.value)}
        placeholder="Enter member name"
      />
      <button onClick={handleAddMember}>Add Member</button>
    </div>
  );
}

export default TeamMembers;

