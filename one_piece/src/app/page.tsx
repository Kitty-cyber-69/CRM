"use client";

import Lottie from "lottie-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Updated import

export default function Home() {
  const [animationData, setAnimationData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/animations/treasure-box.json")
      .then((response) => response.json())
      .then((data) => setAnimationData(data));
  }, []);

  const handleClick = () => {
    router.push("/level_one");
  };

  return (
    <div
      className="h-screen w-screen bg-cover bg-center flex flex-col justify-start items-center"
      style={{
        backgroundImage: "url('/images/onepiece1.jpeg')",
        paddingTop: "10vh",
        opacity: "0.8",
      }}
    >
      {/* Title Block */}
      <div
        className="flex justify-center items-center"
        style={{
          width: "78.2vh",
          height: "16.1vh",
          backgroundColor: "#B29B6A",
          marginBottom: "22vh",
        }}
      >
        <h1
          className="font-bold text-8xl"
          style={{
            WebkitTextStroke: "0.2px #EFE754", // Gold-ish outline
            WebkitTextFillColor: "black", // Black fill
          }}
        >
          THE ONE PIECE
        </h1>
      </div>

      {/* Lottie + Play Now Block */}
      <div
        className="flex justify-center items-center space-x-1"
        style={{
          width: "40.2vh",
          height: "10.4vh",
          backgroundColor: "#B29B6A",
          marginBottom: "10vh",
        }}
      >
        {animationData && (
          <Lottie
            animationData={animationData}
            loop
            autoPlay
            style={{ width: 140, height: 100, marginBottom: "2vh" }}
          />
        )}
        <h1
          className="font-bold text-5xl cursor-pointer transition-all duration-300"
          style={{
            WebkitTextStroke: "0.2px #EFE754", // Gold-ish outline
            WebkitTextFillColor: "black", // Black fill
            border: "2px solid transparent",
            padding: "10px",
            borderRadius: "10px",
          }}
          onClick={handleClick}
          onMouseEnter={(e) => {
            e.currentTarget.style.border = "2px solid #EFE754";
            e.currentTarget.style.transition = "border-color 0.3s ease-in-out";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.border = "2px solid transparent";
          }}
        >
          Play Now
        </h1>
      </div>
    </div>
  );
}
