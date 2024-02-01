import { useEffect } from "react";
import React from "react";
import io from "socket.io-client";





export default function Home() {
  useEffect(() => {
  
  }, []); // Run this effect only once, on component mount

  // Function to handle login
//   const getData = () => {};

  return (
    <div className="flex flex-col justify-center lg:flex-row h-screen bg-white">
      {/* Left Side Content */}
      <div className="lg:w-1/2 flex flex-col justify-center items-center bg-white p-12 lg:flex-grow lg:flex-shrink lg:justify-center lg:items-center">
        <div className="w-full max-w-sm">Welcome</div>
      </div>
    </div>
  );
}
