import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./CheckOut.css";

function CheckOut() {
  const location = useLocation();
  const navigate = useNavigate();
  const { product, size, quantity, type } = location.state || {};

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin", {
        state: { from: "/checkout", checkoutData: location.state },
      });
    }
  }, [navigate, location.state]);

  const handleOrder = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin", {
        state: { from: "/checkout", checkoutData: location.state },
      });
      return;
    }
    const response = await fetch("http://localhost:5000/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        productName: product.name,
        productType: type,
        price: product.price,
        size,
        quantity,
      }),
    });
    if (response.ok) {
      alert("Order placed successfully!");
      navigate("/products");
    } else {
      const data = await response.json();
      alert(data.message || "Error placing order");
    }
  };

  if (!product)
    return <div className="checkout-empty">No product selected.</div>;

  return (
    <div className="checkout-root">
      <div className="checkout-card">
        <div className="checkout-left">
          <img
            src={product.image}
            alt={product.name}
            className="checkout-img"
          />
        </div>
        <div className="checkout-right">
          <h2 className="title">{product.name}</h2>
          <div className="meta">
            <span className="chip">Type: {type}</span>
            <span className="chip">Size: {size}</span>
            <span className="chip">Qty: {quantity}</span>
          </div>
          <div className="price">
            Total: <strong>${product.price * quantity}</strong>
          </div>
          <div className="actions">
            <button className="btn-primary" onClick={handleOrder}>
              Place Order
            </button>
            <button className="btn-ghost" onClick={() => navigate(-1)}>
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckOut;
