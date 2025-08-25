import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const tshirtProducts = [
  { id: 1, name: "Red T-Shirt", price: 20, image: "/images/tshirt1.jpg" },
  { id: 2, name: "Blue T-Shirt", price: 25, image: "/images/tshirt2.jpg" },
  { id: 3, name: "Green T-Shirt", price: 18, image: "/images/tshirt3.jpg" },
  { id: 4, name: "Yellow T-Shirt", price: 22, image: "/images/tshirt4.jpg" },
  { id: 5, name: "Black T-Shirt", price: 19, image: "/images/tshirt5.jpg" },
  { id: 6, name: "White T-Shirt", price: 15, image: "/images/tshirt6.jpg" },
  { id: 7, name: "Purple T-Shirt", price: 24, image: "/images/tshirt7.jpg" },
  { id: 8, name: "Orange T-Shirt", price: 21, image: "/images/tshirt8.jpg" },
  { id: 9, name: "Pink T-Shirt", price: 23, image: "/images/tshirt9.jpg" },
  { id: 10, name: "Grey T-Shirt", price: 17, image: "/images/tshirt10.jpg" },
  // Add more if needed, but min 10
];

function TShirts() {
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState({});
  const [selectedQty, setSelectedQty] = useState({});

  const handleOrder = (product) => {
    const size = selectedSize[product.id] || "M";
    const quantity = selectedQty[product.id] || 1;
    navigate("/checkout", {
      state: { product, size, quantity, type: "tshirt" },
    });
  };

  return (
    <div>
      <h2>T-Shirts</h2>
      <div className="product-grid">
        {tshirtProducts.map((product) => (
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

export default TShirts;
