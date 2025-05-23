import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// 1️⃣ Smart instructions for known ingredients:
const ingredientInstructions = {
    Pasta: "Boil pasta until al dente.",
    Milk: "Measure 1 cup of milk.",
    Cheese: "Grate cheese.",
    Water: "Boil water in a large pot.",
    Butter: "Melt butter in a saucepan.",
    Spinach: "Wash and chop spinach."
};

function RecipeScreen({ recipe, setRecipe }) {
    const navigate = useNavigate();
    const [newIngredient, setNewIngredient] = useState("");

    // 2️⃣ Set a default recipe only once when the page first loads:
    useEffect(() => {
        if (!recipe.title) {
            const initialIngredients = ["Pasta", "Milk", "Cheese", "Water", "Butter"];
            setRecipe({
                title: "Creamy Pasta",
                ingredients: initialIngredients,
                instructions: initialIngredients.map(
                    (ingredient) => ingredientInstructions[ingredient] || `Prepare ${ingredient}.`
                )
            });
        }
    }, []);

    // 3️⃣ Whenever ingredients change, update the instructions:
    useEffect(() => {
        setRecipe((prev) => ({
            ...prev,
            instructions: prev.ingredients.map(
                (ingredient) => ingredientInstructions[ingredient] || `Prepare ${ingredient}.`
            )
        }));
    }, [recipe.ingredients]);

    const handleAddIngredient = () => {
        const newIng = newIngredient.trim();
        if (!newIng || recipe.ingredients.includes(newIng)) return;

        setRecipe({
            ...recipe,
            ingredients: [...recipe.ingredients, newIng]
        });
        setNewIngredient("");
    };

    const handleRemoveIngredient = (ingredientToRemove) => {
        setRecipe({
            ...recipe,
            ingredients: recipe.ingredients.filter(
                (ingredient) => ingredient !== ingredientToRemove
            )
        });
    };

    return (
        <div>
            <h2>Today's Recipe (AI Suggested)</h2>
            <h3>{recipe.title}</h3>

            <h4>Ingredients:</h4>
            <ul>
                {recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>
                        {ingredient}{" "}
                        <button onClick={() => handleRemoveIngredient(ingredient)}>
                            Remove
                        </button>
                    </li>
                ))}
            </ul>

            <input
                type="text"
                value={newIngredient}
                onChange={(e) => setNewIngredient(e.target.value)}
                placeholder="Add new ingredient"
            />
            <button onClick={handleAddIngredient}>Add Ingredient</button>

            <h4>Instructions:</h4>
            <ol>
                {recipe.instructions.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                ))}
            </ol>

            <button
                onClick={() => navigate("/tasks")}
                style={{ marginTop: "20px" }}
            >
                Go to Tasks
            </button>
        </div>
    );
}

export default RecipeScreen;
