import React, { useEffect, useState } from "react";
import "./Dashboard.css";

function Dashboard() {
  const [userInfo, setUserInfo] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/signin";
        return;
      }
      const response = await fetch("http://localhost:5000/api/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setUserInfo({ username: data.username, password: data.password });
      setOrders(data.orders);
      setLoading(false);
    };
    fetchDashboard();
  }, []);

  if (loading) return <div className="dashboard-loading">Loading...</div>;
  if (!userInfo)
    return <div className="dashboard-empty">No user info found.</div>;

  return (
    <div className="dashboard-root">
      <div className="dashboard-header">
        <h2>Welcome to your Dashboard</h2>
        <p className="sub">Account overview and recent orders</p>
      </div>

      <div className="dashboard-grid">
        <div className="user-card card">
          <h3>Account</h3>
          <p>
            <strong>Username:</strong> {userInfo.username}
          </p>
          <p className="muted">
            <strong>Password (hashed):</strong> {userInfo.password}
          </p>
        </div>

        <div className="orders card">
          <h3>Your Orders</h3>
          {orders.length === 0 ? (
            <div className="empty">No orders found.</div>
          ) : (
            <div className="orders-list">
              {orders.map((order) => (
                <div className="order-card" key={order._id}>
                  <div className="order-left">
                    <div className="order-name">{order.productName}</div>
                    <div className="order-meta">{order.productType}</div>
                  </div>
                  <div className="order-right">
                    <div>
                      Size: <strong>{order.size}</strong>
                    </div>
                    <div>
                      Qty: <strong>{order.quantity}</strong>
                    </div>
                    <div>
                      Price: <strong>${order.price}</strong>
                    </div>
                    <div className="order-date">
                      {new Date(order.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
