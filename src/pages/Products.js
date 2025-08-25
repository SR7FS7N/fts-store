import React from "react";
import { Link } from "react-router-dom";
import "./Products.css"; // Custom styles

const productLinks = [
  {
    name: "T-Shirts",
    img: "/images/tshirt2.jpg",
    path: "/tshirts",
    blurb: "Stylish, comfortable tees at great prices.",
  },
  {
    name: "Pants",
    img: "/images/pants2.jpg",
    path: "/pants",
    blurb: "Durable, trendy pants for everyday wear.",
  },
];

function Products() {
  return (
    <div className="products-container">
      <h2>Our Products</h2>

      <div className="products-stack">
        {productLinks.map((link) => (
          <div className="product-card" key={link.name}>
            <div className="product-media">
              <img src={link.img} alt={link.name} />
            </div>
            <div className="product-body">
              <h3>{link.name}</h3>
              <p className="product-blurb">{link.blurb}</p>
              <div className="product-actions">
                <Link to={link.path} className="btn primary">
                  Browse {link.name}
                </Link>
                <Link to="/products" className="btn secondary">
                  More Info
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;
