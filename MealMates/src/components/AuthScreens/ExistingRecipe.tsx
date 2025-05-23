import React from 'react';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebaseConfig';

const ExistingRecipe = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (!user) {
            navigate('/'); // Redirect to login page if not logged in
        }
        });

        return () => unsubscribe();
    }, [navigate]);

    const returnToGroup = () => {
        navigate(`/existing-group/${id}`); // Replace with your desired route
    };

    // Add recipes data and click handler
    const { id } = useParams<{ id: string }>();
    type Recipe = { title: string; ingredients: string[]; instructions: string[]; };
    const recipes: Recipe[] = [
        {
            title: "Veggie Stir Fry",
            ingredients: ["Tofu", "Bell Peppers", "Soy Sauce", "Garlic"],
            instructions: ["Chop all vegetables.", "Stir fry in a hot pan.", "Add soy sauce and cook for 2 mins."]
        },
        {
            title: "Pasta Primavera",
            ingredients: ["Pasta", "Zucchini", "Tomatoes", "Parmesan"],
            instructions: ["Boil pasta.", "Cook veggies.", "Mix together and add cheese."]
        },
        {
            title: "Grilled Cheese",
            ingredients: ["Bread", "Cheddar Cheese", "Butter"],
            instructions: ["Butter the bread.", "Place cheese between slices.", "Grill until golden brown."]
        }
    ];
    const handleRecipeClick = (recipe: Recipe) => {
        navigate(`/existing-group/new-recipe/${id}`, { state: recipe });
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Existing Recipes</h1>
            <ul className="space-y-4 w-full max-w-md">
                {recipes.map((recipe, index) => (
                    <li key={index}>
                        <button
                            onClick={() => handleRecipeClick(recipe)}
                            className={`w-full rounded-lg py-3 px-4 text-white text-xl ${
                                index === 0 ? "bg-red-500" : "bg-green-500"
                            } hover:opacity-90 transition`}
                        >
                            {recipe.title}
                        </button>
                    </li>
                ))}
            </ul>
            <button onClick={returnToGroup} className="mt-6 text-blue-500 hover:underline">
                Back to Group
            </button>
        </div>
    );
}

export default ExistingRecipe;