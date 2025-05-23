import TeamMembers from "../components/TeamMembers";
import RecipeScreen from "../components/RecipeScreen";

function Home({ members, setMembers, recipe, setRecipe }) {
  return (
    <div className="container">
      <TeamMembers members={members} setMembers={setMembers} />
      <RecipeScreen members={members} recipe={recipe} setRecipe={setRecipe} />
    </div>
  );
}

export default Home;