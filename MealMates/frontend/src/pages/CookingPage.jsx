// src/pages/CookingScreen.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function CookingScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/completion");  // go to CompletionScreen next
    }, 3000);  // 3 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="container" style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Combine Tasks</h2>
      <p>Task 1...</p>
      <p>Task 5...</p>
      <p>Task 7...</p>
    </div>
  );
}

export default CookingScreen;
