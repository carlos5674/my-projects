import { useNavigate } from "react-router-dom";

function ExistingRecipe() {
  const navigate = useNavigate();

  const recipes = [
    {
      title: "Veggie Stir Fry",
      ingredients: ["Tofu", "Bell Peppers", "Soy Sauce", "Garlic"],
      instructions: [
        "Chop all vegetables.",
        "Stir fry in a hot pan.",
        "Add soy sauce and cook for 2 mins."
      ]
    },
    {
      title: "Pasta Primavera",
      ingredients: ["Pasta", "Zucchini", "Tomatoes", "Parmesan"],
      instructions: [
        "Boil pasta.",
        "Cook veggies.",
        "Mix together and add cheese."
      ]
    },
    {
      title: "Grilled Cheese",
      ingredients: ["Bread", "Cheddar Cheese", "Butter"],
      instructions: [
        "Butter the bread.",
        "Place cheese between slices.",
        "Grill until golden brown."
      ]
    }
  ];

  const handleRecipeClick = (recipe) => {
    navigate("/new-recipe", { state: recipe });
  };

  return (
    <div className="container">
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Existing Recipes</h2>
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
    </div>
    </div>
  );
}

export default ExistingRecipe;
