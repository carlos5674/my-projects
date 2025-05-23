import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { AddUserToGroup } from './GroupDataStorage';
import '../../styles/auth.css';

const InviteToGroup = () => {
  const navigate = useNavigate();
  const { id } = useParams() as { id: string };

  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) navigate('/');
    });
    return () => unsubscribe();
  }, [navigate]);

  const [formData, setFormData] = useState({ email: '' });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (AddUserToGroup(id, formData.email, auth.currentUser?.email || '')) {
      navigate(`/existing-group/${id}`);
    }
  };

  const returnToGroup = () => navigate(`/existing-group/${id}`);

  return (
    <div className="auth-container group-selection">
      <div className="group-box">
        <h2 className="group-title">Invite to Group</h2>
        <form className="group-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="email"
            placeholder="Enter user's email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <button type="submit" className="auth-button logout">
            Submit
          </button>
        </form>
        <button className="auth-button secondary" onClick={returnToGroup}>
          Back To Group
        </button>

      </div>
    </div>
  );
};

export default InviteToGroup;
