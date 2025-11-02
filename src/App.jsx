import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
function App() {
  return (
    <div className="min-h-screen flex justify-center items-start bg-gray-50">
      <Navbar/>
    <Home/>
    </div>
  );
}

export default App;
