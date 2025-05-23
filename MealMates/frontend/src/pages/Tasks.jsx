import MyTasks from "../components/MyTasks";
import { useNavigate } from "react-router-dom";

function Tasks({ members, recipe }) {
  const navigate = useNavigate();
  const instructions = recipe.instructions || [];

  return (
    <div className="container">
  
      <MyTasks initialInstructions={instructions} members={members} />
      <button onClick={() => navigate("/waiting")} style={{ marginTop: "20px" }}>
        Start Cooking
      </button>
    </div>
  );
}

export default Tasks;
