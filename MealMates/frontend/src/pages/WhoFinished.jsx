import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function WhoFinished() {
    const navigate = useNavigate();
    const [finishedList, setFinishedList] = useState([]);
    const members = ["Carlos", "Brandon", "Stefan"];

    useEffect(() => {
        let index = 0;

        const interval = setInterval(() => {
            setFinishedList((prev) => [...prev, members[index]]);
            index += 1;

            if (index === members.length) {
                clearInterval(interval);
                setTimeout(() => {
                    navigate("/combining");
                }, 2000);
            }
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="container" style={{ textAlign: "center", marginTop: "20%" }}>
            <h1>Task Completion Status</h1>
            <ul>
                {finishedList.map((member, index) => (
                    <li key={index}>{member} finished!</li>
                ))}
            </ul>
        </div>
    );
}

export default WhoFinished;
