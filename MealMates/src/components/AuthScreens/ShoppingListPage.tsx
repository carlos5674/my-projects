import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import ShoppingList from './ShoppingList';
import '../../styles/auth.css';

const ShoppingListPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  // Load shopping list from localStorage or initialize empty
  const [recipe, setRecipe] = useState<{
    ingredients: string[];
    [key: string]: any;
  }>(() => {
    const savedList = localStorage.getItem(`shoppingList-${id}`);
    return savedList ? JSON.parse(savedList) : {
      ingredients: [],
      name: 'Shopping List',
    };
  });

  // Save to localStorage whenever recipe changes
  useEffect(() => {
    localStorage.setItem(`shoppingList-${id}`, JSON.stringify(recipe));
  }, [recipe, id]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) navigate('/');
    });
    return () => unsubscribe();
  }, [navigate]);

  const returnToGroup = () => {
    navigate(`/existing-group/${id}`);
  };

  return (
    <div className="existing-group-container">
      <div className="group-info-box">
        <h2 className="group-title">Group Shopping List</h2>
        <ShoppingList recipe={recipe} setRecipe={setRecipe} />
        <div className="group-buttons">
          <button className="auth-button logout" onClick={returnToGroup}>
            Return to Group
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShoppingListPage; 