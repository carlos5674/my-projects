import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function WaitingForOthers() {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/finished-sample");
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="container" style={{ textAlign: "center", marginTop: "20%" }}>
            <h1>Waiting for others to finish...</h1>
            <p>Brandon and Carlos are still working!</p>
        </div>
    );
}

export default WaitingForOthers;
