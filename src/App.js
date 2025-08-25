import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import Products from "./pages/Products";
import TShirts from "./pages/TShirts";
import Pants from "./pages/Pants";
import CheckOut from "./pages/CheckOut";
import Dashboard from "./pages/Dashboard";
import Header from "./components/Header";

function App() {
  return (
    <div className="app">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/products" element={<Products />} />
        <Route path="/tshirts" element={<TShirts />} />
        <Route path="/pants" element={<Pants />} />
        <Route path="/checkout" element={<CheckOut />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
