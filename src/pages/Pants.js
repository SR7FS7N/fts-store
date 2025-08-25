import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const pantsProducts = [
  { id: 1, name: "Blue Jeans", price: 40, image: "/images/pants1.jpg" },
  { id: 2, name: "Black Pants", price: 35, image: "/images/pants2.jpg" },
  { id: 3, name: "Grey Trousers", price: 45, image: "/images/pants3.jpg" },
  { id: 4, name: "Khaki Pants", price: 38, image: "/images/pants4.jpg" },
  { id: 5, name: "White Jeans", price: 42, image: "/images/pants5.jpg" },
  { id: 6, name: "Red Chinos", price: 39, image: "/images/pants6.jpg" },
  { id: 7, name: "Green Cargo", price: 50, image: "/images/pants7.jpg" },
  { id: 8, name: "Navy Slacks", price: 44, image: "/images/pants8.jpg" },
  { id: 9, name: "Brown Corduroy", price: 46, image: "/images/pants9.jpg" },
  { id: 10, name: "Denim Shorts", price: 30, image: "/images/pants10.jpg" },
  // Min 10
];

function Pants() {
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState({});
  const [selectedQty, setSelectedQty] = useState({});

  const handleOrder = (product) => {
    const size = selectedSize[product.id] || "M";
    const quantity = selectedQty[product.id] || 1;
    navigate("/checkout", {
      state: { product, size, quantity, type: "pants" },
    });
  };

  return (
    <div>
      <h2>Pants</h2>
      <div className="product-grid">
        {pantsProducts.map((product) => (
          <div key={product.id} className="product">
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p>${product.price}</p>
            <label>
              Size:
              <select
                value={selectedSize[product.id] || "M"}
                onChange={(e) =>
                  setSelectedSize({
                    ...selectedSize,
                    [product.id]: e.target.value,
                  })
                }
              >
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
              </select>
            </label>
            <label>
              Quantity:
              <input
                type="number"
                min="1"
                value={selectedQty[product.id] || 1}
                onChange={(e) =>
                  setSelectedQty({
                    ...selectedQty,
                    [product.id]: parseInt(e.target.value, 10) || 1,
                  })
                }
              />
            </label>
            <button onClick={() => handleOrder(product)}>Order</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Pants;
