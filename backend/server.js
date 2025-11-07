const express = require("express");
const cors = require("cors");
const { loadDB, saveDB } = require("./data");
const { v4: uuid } = require("uuid");

const app = express();
app.use(cors());
app.use(express.json());

// GET PRODUCTS
app.get("/api/products", (req, res) => {
  const db = loadDB();
  res.json(db.products);
});

// GET CART
app.get("/api/cart", (req, res) => {
  const db = loadDB();
  let total = 0;

  db.cart.forEach((item) => {
    const product = db.products.find((p) => p.id === item.productId);
    total += product.price * item.qty;
  });

  res.json({ cart: db.cart, total });
});

// ADD TO CART
app.post("/api/cart", (req, res) => {
  const { productId, qty } = req.body;

  const db = loadDB();
  db.cart.push({ id: uuid(), productId, qty });
  saveDB(db);

  res.json({ message: "Added to cart" });
});

// DELETE CART ITEM
app.delete("/api/cart/:id", (req, res) => {
  const id = req.params.id;
  const db = loadDB();
  db.cart = db.cart.filter((item) => item.id !== id);

  saveDB(db);
  res.json({ message: "Removed" });
});

// CHECKOUT
app.post("/api/checkout", (req, res) => {
  const { cartItems } = req.body;
  const timestamp = new Date().toISOString();

  let total = 0;
  const db = loadDB();

  cartItems.forEach((c) => {
    const product = db.products.find((p) => p.id === c.productId);
    total += product.price * c.qty;
  });

  // after checkout, empty cart
  db.cart = [];
  saveDB(db);

  res.json({ receiptId: uuid(), total, timestamp });
});

app.listen(5000, () => console.log("Server running on port 5000"));
