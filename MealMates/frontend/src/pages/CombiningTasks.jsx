import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function CombiningTasks() {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/finish");
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="container" style={{ textAlign: "center", marginTop: "20%" }}>
            <h1>Combining all tasks...</h1>
            <p>Finalizing the dish. Ready to serve!</p>
        </div>
    );
}

export default CombiningTasks;
