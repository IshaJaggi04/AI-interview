import { useState, useEffect } from "react";
import React from "react";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Button, Input } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";

export default function Login() {
  const navigate = useNavigate();
 
  // State for email and password
  const [username, setname] = useState("");
  const baseURL = "http://test-api.talentfinders.io/check_for_login";
  const [password, setPassword] = useState("");

  useEffect(() => {
    // Retrieve user data from local storage
    //const storedUser = localStorage.getItem("user");
    //  const userData = storedUser ? JSON.parse(storedUser) : null;
    // Set email and password from local storage if available
    // if (userData) {
    //   setEmail(userData.email || "");
    //   setPassword(userData.password || "");
    // }
  }, []); // Run this effect only once, on component mount

  // Function to handle login
  const handleLogin = () => {
    // Retrieve user data from local storage
    // const storedUser = localStorage.getItem("user");
    // const userData = storedUser ? JSON.parse(storedUser) : null;

    axios
      .post(
        baseURL,
        {
          username: username,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "API-Key": "haduanjk-13232810-bjadsnio-1pi18867",
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          localStorage.setItem("userData", JSON.stringify(res));
          let socket = "";
          socket = io("ws://node.talentfinders.io/");
          socket.on("connection", (socket) => {
            console.log("a user connected");
        
            socket.on("disconnect", () => {
              console.log("a user disconnected!");
            });
          });
          navigate("/Home");
        }
      })
      .catch((err) => {
        console.error(err);
      });

    // Validate credentials
    // if (
    //   userData &&
    //   userData.email === email &&
    //   userData.password === password
    // ) {
    //   // Credentials match, navigate to profile page
    //   navigate("/instructions");
    // } else {
    //   // Credentials do not match, show error message
    //   alert("Invalid email or password.");
    // }
  };

  return (
    <div className="flex flex-col justify-center lg:flex-row h-screen bg-white">
      {/* Left Side Content */}
      <div className="lg:w-1/2 flex flex-col justify-center items-center bg-white p-12 lg:flex-grow lg:flex-shrink lg:justify-center lg:items-center">
        <div className="w-full max-w-sm">
          <h1 className="text-4xl font-bold text-left w-full mb-4">Sign In</h1>
          <p className="mb-4">Enter your Username and Password to sign in</p>

          {/* Email Input */}
          <div className="mb-4">
            <Input
              placeholder="username"
              className="h-12"
              value={username}
              onChange={(e) => setname(e.target.value)}
            />
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <Input.Password
              className="h-12"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </div>

          {/* Login Button */}
          <div className="flex flex-col items-center justify-between gap-4">
            <Button
              onClick={handleLogin}
              className="bg-blue-400 text-white font-bold w-full h-12 !hover:text-white"
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>

      {/* Right Side Content */}
    </div>
  );
}
