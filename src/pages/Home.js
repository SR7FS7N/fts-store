import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css"; // Create this file for custom styles

function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <div className="home-container">
      <header className="home-header">
        <img src="/images/fts.png" alt="Hero" className="hero-img" />
        <h1>Welcome to FTS Project Store!</h1>
        <p className="home-desc">
          Discover high-quality T-Shirts and Pants at unbeatable prices. Our
          products are stylish, durable, and affordable—perfect for everyone!
        </p>
      </header>
      <nav className="home-links">
        <a href="#" className="home-link">
          Contact Developer
        </a>
        <a href="#" className="home-link">
          Help
        </a>
        <a href="/products" className="home-link">
          Browse Products
        </a>
        {!isLoggedIn ? (
          <a href="/signin" className="home-link">
            Sign In
          </a>
        ) : (
          <button
            onClick={handleLogout}
            className="home-link"
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            Logout
          </button>
        )}
      </nav>
    </div>
  );
}

export default Home;
