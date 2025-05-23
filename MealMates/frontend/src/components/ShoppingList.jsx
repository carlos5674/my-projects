import { useState } from "react";
function ShoppingList({ recipe, setRecipe }) {
  const [newItem, setNewItem] = useState("");

  const handleAddItem = () => {
    if (!newItem.trim()) return;
    setRecipe({
      ...recipe,
      ingredients: [...recipe.ingredients, newItem.trim()]
    });
    setNewItem("");
  };

  const handleRemoveItem = (itemToRemove) => {
    setRecipe({
      ...recipe,
      ingredients: recipe.ingredients.filter((item) => item !== itemToRemove)
    });
  };

  return (
    <div>
      <h2>Shopping List</h2>
      <ul>
        {recipe.ingredients.map((item, index) => (
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
