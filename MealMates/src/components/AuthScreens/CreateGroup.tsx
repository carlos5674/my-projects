import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { NewGroup } from './GroupDataStorage';
import '../../styles/auth.css';

const CreateGroup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) navigate('/');
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const id = NewGroup(formData.name, formData.description, auth.currentUser?.email || 'nil');
    navigate(`/existing-group/${id}`);
  };

  const handleBack = () => {
    navigate('/group');
  };

  return (
    <div className="auth-container">
      <div className="group-box">
        <h2 className="group-title">Create Group</h2>
        <form className="group-form" onSubmit={handleSubmit}>
        <input
            type="text"
            name="name"
            placeholder="Group Name"
            value={formData.name}
            onChange={handleChange}
            required
        />
        <input
            type="text"
            name="description"
            placeholder="Description (optional)"
            value={formData.description}
            onChange={handleChange}
        />
        <button type="submit" className="auth-button logout">Submit</button>
        <button type="button" className="auth-button secondary" onClick={handleBack}>
            Back to Group Selection
        </button>
        </form>

      </div>
    </div>
  );
};

export default CreateGroup;
