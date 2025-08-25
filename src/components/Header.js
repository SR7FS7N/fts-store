import React from "react";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    // send logout request with current token (best-effort)
    try {
      if (token) {
        fetch("http://localhost:5000/api/users/logout", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }).catch(() => {});
      }
    } catch (e) {
      /* ignore */
    }
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className="site-header">
      <div className="header-left" onClick={() => navigate("/")}>
        FTS Store
      </div>
      <div className="header-right">
        <button className="btn secondary" onClick={() => navigate("/products")}>
          Products
        </button>
        {token ? (
          <>
            <button
              className="btn secondary"
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </button>
            <button className="btn danger" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <button className="btn" onClick={() => navigate("/signin")}>
            Sign In
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
