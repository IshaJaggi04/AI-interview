import "./index.css";
import { Routes, Route } from "react-router-dom";
import React from "react";
import Login from "./components/login";
import Home from "./components/home"


export default function AppRouting() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/Home" element={<Home/>}/>
      
    </Routes>
  );

}

