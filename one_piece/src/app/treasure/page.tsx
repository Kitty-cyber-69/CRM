export default function FullScreenBackground() {
  return (
    <div
      className="h-screen w-screen bg-center"
      style={{
        backgroundImage: "url('/images/treasure.png')",
        // backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Content can go here */}
    </div>
  );
}

