import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import {
  Role,
  GetGroup,
  LeaveGroup,
  DeleteGroup,
  IsOwner,
  GetUserRole,
  GetAllMembersInGroup,
} from './GroupDataStorage';
import '../../styles/auth.css';

/*
TODO: 
- add task creation and task assignment
- integrate shopping lists
*/

const ExistingGroup = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) navigate('/');
    });
    return () => unsubscribe();
  }, [navigate]);

  const returnToGroupSelection = () => navigate('/group');

  const { id } = useParams() as { id: string };
  const isOwner = IsOwner(id, auth.currentUser?.email || '');
  const group = JSON.parse(GetGroup(id));
  const groupinfo = group[id];
  const currentUser = auth.currentUser?.email || '';

  const leaveGroup = () => {
    if (LeaveGroup(id, currentUser)) returnToGroupSelection();
  };

  const deleteGroup = () => {
    if (DeleteGroup(id, currentUser)) returnToGroupSelection();
  };

  const RenderMembers = () => {
    const members = GetAllMembersInGroup(id);
    return (
      <div className="group-member-list">
        <p className="group-role-label">Members:</p>
        {members.map((member) => (
          <div key={member} className="group-member">
            {member}
            <div className="member-role">Role: {GetUserRole(id, member)}</div>
          </div>
        ))}
      

      </div>
    );
  };

  return (
    <div className="existing-group-container">
      <div className="group-info-box">
        <h2 className="group-title">Existing Group</h2>
        <p className="group-name-display" style={{ fontSize: '22px' }}>{groupinfo['name']}</p>
        <p>
          <strong>Description:</strong>{' '}
          <span className="group-description">{groupinfo['description'] || 'No description provided.'}</span>
        </p>

        <RenderMembers />

        <div className="group-buttons">
          <button
            className="auth-button secondary"
            onClick={() => navigate(`/existing-group/invite/${id}`)}
          >
            Invite Member
          </button>
          <button
            className="auth-button secondary"
            onClick={isOwner ? deleteGroup : leaveGroup}
          >
            {isOwner ? 'Delete' : 'Leave'} Group
          </button>
          <button className="auth-button secondary" onClick={() => navigate(`/existing-group/new-recipe/${id}`)}>Create Recipe</button>
          <button className="auth-button secondary" onClick={() => navigate(`/existing-group/recipes/${id}`)}>View Recipes</button>
          <button className="auth-button secondary" onClick={() => navigate(`/existing-group/shopping-list/${id}`)}>Shopping List</button>
          <button className="auth-button secondary" onClick={() => navigate(`/existing-group/tasks/${id}`)}>Tasks</button>
          <button className="auth-button logout" onClick={returnToGroupSelection}>
            Return to Group Selection
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExistingGroup;
