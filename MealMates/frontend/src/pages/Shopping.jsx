import ShoppingList from "../components/ShoppingList";

function Shopping({ recipe, setRecipe }) {
  return (
    <div className="container">

      <ShoppingList recipe={recipe} setRecipe={setRecipe} />
    </div>
  );
}

export default Shopping;
