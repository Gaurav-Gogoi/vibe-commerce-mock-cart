import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  // Load products
  useEffect(() => {
    axios.get("http://localhost:5000/api/products").then((res) => {
      setProducts(res.data);
    });

    loadCart();
  }, []);

  const loadCart = () => {
    axios.get("http://localhost:5000/api/cart").then((res) => {
      setCart(res.data.cart);
      setTotal(res.data.total);
    });
  };

  const addToCart = (productId) => {
    axios
      .post("http://localhost:5000/api/cart", { productId, qty: 1 })
      .then(() => loadCart());
  };

  const removeFromCart = (id) => {
    axios.delete(`http://localhost:5000/api/cart/${id}`).then(() => loadCart());
  };

  const checkout = () => {
    axios
      .post("http://localhost:5000/api/checkout", { cartItems: cart })
      .then((res) => {
        alert(`Checkout successful! Total: ₹${res.data.total}`);
        loadCart();
      });
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Vibe Commerce</h1>

      <h2>Products</h2>
      <div style={{ display: "flex", gap: 20 }}>
        {products.map((p) => (
          <div
            key={p.id}
            style={{
              border: "1px solid black",
              padding: 10,
              width: 150,
            }}
          >
            <h4>{p.name}</h4>
            <p>₹{p.price}</p>
            <button onClick={() => addToCart(p.id)}>Add to Cart</button>
          </div>
        ))}
      </div>

      <h2>Cart</h2>
      {cart.map((item) => (
        <div key={item.id} style={{ marginBottom: 10 }}>
          {item.productId} — Qty: {item.qty}
          <button onClick={() => removeFromCart(item.id)}>Remove</button>
        </div>
      ))}

      <h3>Total: ₹{total}</h3>

      <button onClick={checkout}>Checkout</button>
    </div>
  );
}

export default App;
