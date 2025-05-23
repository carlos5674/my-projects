import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Shopping from "./pages/Shopping";
import Tasks from "./pages/Tasks";
import NewRecipePage from "./pages/NewRecipePage"; 
import ExistingRecipe from "./pages/ExistingRecipe";
import CookingPage from "./pages/CookingPage"; 
import Analyzing from "./pages/Analyzing";
import CookingScreen from "./pages/CookingPage";
import CompletionScreen from "./pages/CompletionScreen"; 
import FinishScreen from "./pages/FinishScreen";
import WaitingForOthers from "./pages/WaitingForOthers";
import WhoFinished from "./pages/WhoFinished";
import CombiningTasks from "./pages/CombiningTasks";


function App() {

  // 🔥 Global state for team members
  const [members, setMembers] = useState(["Brandon", "Carlos"]);

  // 🔥 Global state for recipe
  const [recipe, setRecipe] = useState({
    title: "Spicy Veggie Stir Fry",
    ingredients: ["Tofu", "Bell Peppers", "Soy Sauce", "Garlic"],
    instructions: []
  });

  return (
    <Router>
      <nav style={{ marginBottom: "20px" }}>
        <Link to="/" style={{ marginRight: "10px" }}>Home</Link>
        <Link to="/shopping" style={{ marginRight: "10px" }}>Shopping</Link>
        <Link to="/tasks">Tasks</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home members={members} setMembers={setMembers} recipe={recipe} setRecipe={setRecipe} />} />
        <Route path="/shopping" element={<Shopping recipe={recipe} setRecipe={setRecipe} />} />

        <Route path="/tasks" element={<Tasks members={members} recipe={recipe} />} />
        <Route path="/recipes" element={<ExistingRecipe />} />
        <Route path="/new-recipe" element={<NewRecipePage />} />
        <Route path="/cook" element={<CookingPage />} />
        <Route path="/analyzing" element={<Analyzing />} />
        <Route path="/cooking" element={<CookingScreen />} />
        <Route path="/completion" element={<CompletionScreen />} /> 
        <Route path="/finish" element={<FinishScreen />} />
        <Route path="/waiting" element={<WaitingForOthers />} />
        <Route path="/finished-sample" element={<WhoFinished />} />
        <Route path="/combining" element={<CombiningTasks />} />

      </Routes>
    </Router>
  );
}

export default App;
