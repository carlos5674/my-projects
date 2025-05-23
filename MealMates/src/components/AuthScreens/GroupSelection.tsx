import '../../styles/auth.css';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { GetAllGroupIDsFromUser, GetGroup } from './GroupDataStorage';
import { WipeLocalStorage, createDynamicComponent } from './Utils';

const GroupSelection = () => {
  const navigate = useNavigate();

  const handleCreateGroup = () => navigate('/create-group');
  const handleCookingAssistant = () => navigate('/cooking-assistant');
  const handleClearLocal = () => {
    WipeLocalStorage();
    navigate('/group');
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) navigate('/');
    });
    return () => unsubscribe();
  }, [navigate]);

  interface GroupItem {
    groupid: string;
    groupJSON: string;
  }

  const GroupElement: React.FC<GroupItem> = ({ groupid, groupJSON }) => {
    const group = JSON.parse(groupJSON);
    return (
      <div className="group-card">
        <p className="group-name">Group Name: {group['name']}</p>
        <button
          className="auth-button secondary"
          onClick={() => navigate(`/existing-group/${groupid}`)}
        >
          Go To Group
        </button>
      </div>
    );
  };

  const RenderGroups = () => {
    const groupIDs = GetAllGroupIDsFromUser(auth.currentUser?.email || 'nil');
  
    if (groupIDs.length === 0) {
      return (
        <div className="no-groups-message">
          You are not in any groups currently.
        </div>
      );
    }
  
    return (
      <div className="group-list">
        {groupIDs.map((item) =>
          createDynamicComponent(GroupElement, {
            groupid: item,
            groupJSON: JSON.stringify(JSON.parse(GetGroup(item))[item]),
          })
        )}
      </div>
    );
  };

  return (
    <div className="auth-container group-selection">
      <div className="group-box">
        <h2 className="group-title">Your Groups</h2>
        <RenderGroups />

        <div className="divider"><span>Or</span></div>

        <div className="group-buttons">
          <button className="auth-button primary" onClick={handleCreateGroup}>
            CREATE GROUP
          </button>
          <button className="auth-button assistant" onClick={handleCookingAssistant}>
            COOKING ASSISTANT
          </button>
          <button className="auth-button primary" onClick={handleClearLocal}>
            DEBUG: CLEAR STORAGE
          </button>
          <button className="auth-button logout" onClick={handleLogout}>
            LOGOUT
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupSelection;
