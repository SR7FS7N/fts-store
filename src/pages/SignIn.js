import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const redirect = new URLSearchParams(location.search).get("redirect");
  const productId = new URLSearchParams(location.search).get("id");
  const productType = redirect?.includes("tshirts") ? "tshirt" : "pants";
  const resumeCheckout = location.state?.checkoutData;

  useEffect(() => {
    // If already logged in and navigated to SignIn with checkout state,
    // forward user back to checkout so they can confirm and click Order.
    if (localStorage.getItem("token")) {
      if (resumeCheckout) {
        navigate("/checkout", { state: resumeCheckout });
      } else if (redirect) {
        // If a redirect query param exists, go there (e.g. /tshirts or /pants)
        try {
          navigate(redirect);
        } catch (e) {
          navigate("/dashboard");
        }
      }
    }
  }, [redirect, productId, productType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isSignup ? "/api/users/signup" : "/api/users/login";
      const res = await axios.post(`http://localhost:5000${endpoint}`, {
        username,
        password,
      });
      localStorage.setItem("token", res.data.token);
      if (resumeCheckout) {
        // return user to checkout to confirm and place order
        navigate("/checkout", { state: resumeCheckout });
        return;
      }
      if (redirect) {
        // redirect could be a path like /tshirts
        try {
          navigate(redirect);
          return;
        } catch (e) {
          /* fallthrough */
        }
      }
      navigate("/dashboard");
    } catch (err) {
      const serverMsg =
        err?.response?.data?.msg || err?.response?.data?.error || err.message;
      alert(serverMsg || "Error communicating with server");
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/auth/signin", {
      method: "POST",
      body: JSON.stringify({ email: username, password }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
      // redirect to products or home
      window.location.href = "/products";
    } else {
      alert(data.message || "Sign-in failed");
    }
  };

  const placeOrderAfterLogin = async (id, type) => {
    const products = type === "tshirt" ? tshirtProducts : pantsProducts;
    const product = products.find((p) => p.id === parseInt(id));
    if (!product) return;
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/orders",
        {
          productName: product.name,
          productType: type,
          price: product.price,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Order placed successfully!");
      navigate(`/${type}s`);
    } catch (err) {
      alert("Error placing order");
    }
  };

  const placeOrderObjectAfterLogin = async ({
    product,
    size,
    quantity,
    type,
  }) => {
    if (!product) return;
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/orders",
        {
          productName: product.name,
          productType: type,
          price: product.price,
          size,
          quantity,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Order placed successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Error placing order");
    }
  };

  // Dummy products for reference (actual in TShirts/Pants)
  const tshirtProducts = []; // Placeholder, actual in TShirts.js
  const pantsProducts = []; // Placeholder, actual in Pants.js

  return (
    <div>
      <h2>{isSignup ? "Sign Up" : "Sign In"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isSignup ? "Sign Up" : "Sign In"}</button>
      </form>
      <p>
        {isSignup ? "Already have an account?" : "No account?"}{" "}
        <button
          onClick={() => setIsSignup(!isSignup)}
          style={{
            background: "none",
            color: "#4a90e2",
            border: "none",
            cursor: "pointer",
          }}
        >
          {isSignup ? "Sign In" : "Sign Up"}
        </button>
      </p>
    </div>
  );
}

export default SignIn;
