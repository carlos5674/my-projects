import React from 'react';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebaseConfig';

const CreateRecipe = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (!user) {
            navigate('/'); // Redirect to login page if not logged in
        }
        });

        return () => unsubscribe();
    }, [navigate]);

    const returnToGroupSelection = () => {
        navigate('/group'); // Replace with your desired route
    };

    return (
        <div>
            <h1>Create Recipe</h1>
            {/* Add your recipe details here */}
            <button onClick={returnToGroupSelection}>Back to Group Selection</button>
        </div>
    );
}


export default CreateRecipe;