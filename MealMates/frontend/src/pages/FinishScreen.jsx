import { useNavigate } from "react-router-dom";

function FinishScreen() {
  const navigate = useNavigate();

  return (
    <div className="container" style={{ textAlign: "center", paddingTop: "100px" }}>
      <h2>What do you want to do next?</h2>
      <button
        onClick={() => navigate("/")}
        style={{ margin: "10px", padding: "12px 24px", fontSize: "16px" }}
      >
        New Meal
      </button>
      <button
        onClick={() => alert("Thank you for cooking with us!")}
        style={{ margin: "10px", padding: "12px 24px", fontSize: "16px" }}
      >
        Finish
      </button>
    </div>
  );
}

export default FinishScreen;
