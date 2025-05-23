import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { GetAllMembersInGroup } from './GroupDataStorage';
import MyTasks from './Tasks';
import '../../styles/auth.css';

const TasksPage = () => {
  const navigate = useNavigate();
  const { id } = useParams() as { id: string };
  const [members, setMembers] = useState<string[]>([]);
  const [instructions, setInstructions] = useState<string[]>([
    "Buy groceries",
    "Cook dinner",
    "Clean up kitchen",
    "Plan next meal",
    "Update shopping list"
  ]); // Default sample tasks

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) navigate('/');
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    // Fetch members from the group
    const groupMembers = GetAllMembersInGroup(id);
    setMembers(groupMembers);

    // TODO: Fetch actual tasks from the database when that functionality is implemented
  }, [id]);

  return (
    <div className="auth-page">
      <MyTasks initialInstructions={instructions} members={members} />
      <div className="button-container">
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button 
            className="auth-button secondary" 
            onClick={() => navigate(`/existing-group/${id}`)}
          >
            Back to Group
          </button>
        </div>
      </div>
    </div>
  );
};

export default TasksPage; 