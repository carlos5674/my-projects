import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

function NewRecipePage() {
  const location = useLocation();
  const navigate = useNavigate();

  const recipeData = location.state;

  // If no recipe data was passed, fallback to empty/default
  const [recipe, setRecipe] = useState(recipeData || {
    title: "Untitled Recipe",
    ingredients: [],
    instructions: []
  });

  const [newIngredient, setNewIngredient] = useState("");

  // Add new ingredient
  const handleAddIngredient = () => {
    if (!newIngredient.trim()) return;
    setRecipe({
      ...recipe,
      ingredients: [...recipe.ingredients, newIngredient.trim()]
    });
    setNewIngredient("");
  };

  // Remove an ingredient
  const handleRemoveIngredient = (ingredientToRemove) => {
    setRecipe({
      ...recipe,
      ingredients: recipe.ingredients.filter(
        (ingredient) => ingredient !== ingredientToRemove
      )
    });
  };

  return (
    <div className="container">
      <h2>{recipe.title}</h2>

      <h3>Ingredients</h3>
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

      <h3>Instructions</h3>
      <ol>
        {recipe.instructions.map((instruction, index) => (
          <li key={index}>{instruction}</li>
        ))}
      </ol>

      <button onClick={() => navigate(-1)}>Back to Recipes</button>
    </div>
  );
}

export default NewRecipePage;
