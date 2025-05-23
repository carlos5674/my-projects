import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function CompletionScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    // After 3 seconds, go to the Finish Screen
    const timer = setTimeout(() => {
      navigate("/finish");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="container" style={{ textAlign: "center", paddingTop: "100px" }}>
      <h2>DONE ......</h2>
      <h3>Woohooo</h3>
      <p>Adding Recipe To Inventory!</p>
    </div>
  );
}

export default CompletionScreen;
