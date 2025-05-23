import { useState } from "react";

interface Ingredient {
  name: string;
}

interface Recipe {
  ingredients: string[];
  [key: string]: any;
}

interface ShoppingListProps {
  recipe: Recipe;
  setRecipe: React.Dispatch<React.SetStateAction<Recipe>>;
}

function ShoppingList({ recipe, setRecipe }: ShoppingListProps) {
  const [newItem, setNewItem] = useState("");

  const handleAddItem = () => {
    if (!newItem.trim()) return;
    setRecipe({
      ...recipe,
      ingredients: [...recipe.ingredients, newItem.trim()]
    });
    setNewItem("");
  };

  const handleRemoveItem = (itemToRemove: string) => {
    setRecipe({
      ...recipe,
      ingredients: recipe.ingredients.filter((item: string) => item !== itemToRemove)
    });
  };

  return (
    <div>
      <h2>Shopping List</h2>
      <ul>
        {recipe.ingredients.map((item: string, index: number) => (
          <li key={index}>
            {item}{" "}
            <button onClick={() => handleRemoveItem(item)}>Remove</button>
          </li>
        ))}
      </ul>

      <input
        type="text"
        value={newItem}
        onChange={(e) => setNewItem(e.target.value)}
        placeholder="Add new item"
      />
      <button onClick={handleAddItem}>Add Item</button>
    </div>
  );
}

export default ShoppingList;
