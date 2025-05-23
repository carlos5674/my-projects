import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Analyzing() {
  const navigate = useNavigate();
  const [dots, setDots] = useState("");

  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 500);

    const timer = setTimeout(() => {
      navigate("/recipes");
    }, 3000);

    return () => {
      clearInterval(dotInterval);
      clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">
        AI Analyzing{dots}
      </h1>
      <p className="text-lg text-yellow-600">
        Group Z assigning tasks and generating list
      </p>
    </div>
  );
}

export default Analyzing;
