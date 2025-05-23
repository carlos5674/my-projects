import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

// Define the shape of a recipe
type Recipe = {
  title: string;
  ingredients: string[];
  instructions: string[];
};

function NewRecipePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const recipeData = location.state as Recipe | undefined;

  // If no recipe data was passed, fallback to empty/default
  const [recipe, setRecipe] = useState<Recipe>(
    recipeData ?? {
      title: "Untitled Recipe",
      ingredients: [],
      instructions: []
    }
  );

  const [newIngredient, setNewIngredient] = useState("");
  const [newInstruction, setNewInstruction] = useState("");

  // Load recipes from localStorage on component mount
  useEffect(() => {
    const savedRecipes = localStorage.getItem(`recipes-${id}`);
    if (savedRecipes && !recipeData) {
      const recipes = JSON.parse(savedRecipes);
      setRecipe(recipes[recipes.length - 1] || recipe);
    }
  }, [id]);

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
  const handleRemoveIngredient = (ingredientToRemove: string): void => {
    setRecipe({
      ...recipe,
      ingredients: recipe.ingredients.filter(
        (ingredient) => ingredient !== ingredientToRemove
      )
    });
  };

  // Add new instruction
  const handleAddInstruction = () => {
    if (!newInstruction.trim()) return;
    setRecipe({
      ...recipe,
      instructions: [...recipe.instructions, newInstruction.trim()]
    });
    setNewInstruction("");
  };

  // Remove an instruction
  const handleRemoveInstruction = (index: number): void => {
    setRecipe({
      ...recipe,
      instructions: recipe.instructions.filter((_, i) => i !== index)
    });
  };

  // Save recipe
  const handleSaveRecipe = () => {
    const savedRecipes = localStorage.getItem(`recipes-${id}`);
    const recipes = savedRecipes ? JSON.parse(savedRecipes) : [];
    recipes.push(recipe);
    localStorage.setItem(`recipes-${id}`, JSON.stringify(recipes));
    navigate(`/existing-group/recipes/${id}`);
  };

  return (
    <div className="container">
      <input
        type="text"
        value={recipe.title}
        onChange={(e) => setRecipe({ ...recipe, title: e.target.value })}
        className="text-2xl font-bold mb-4 w-full"
      />

      <h3>Ingredients</h3>
      <ul>
        {recipe.ingredients.map((ingredient: string, index: number) => (
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
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewIngredient(e.target.value)}
        placeholder="Add new ingredient"
      />
      <button onClick={handleAddIngredient}>Add Ingredient</button>

      <h3>Instructions</h3>
      <ol>
        {recipe.instructions.map((instruction: string, index: number) => (
          <li key={index}>
            {instruction}{" "}
            <button onClick={() => handleRemoveInstruction(index)}>
              Remove
            </button>
          </li>
        ))}
      </ol>

      <input
        type="text"
        value={newInstruction}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewInstruction(e.target.value)}
        placeholder="Add new instruction"
      />
      <button onClick={handleAddInstruction}>Add Instruction</button>

      <div className="mt-4">
        <button onClick={handleSaveRecipe} className="mr-2">Save Recipe</button>
        <button onClick={() => navigate(`/existing-group/recipes/${id}`)}>Back to Recipes</button>
      </div>
    </div>
  );
}

export default NewRecipePage;
