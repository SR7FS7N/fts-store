const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

if (!process.env.MONGO_URI)
  console.warn("Warning: MONGO_URI not set in environment");
if (!process.env.JWT_SECRET)
  console.warn("Warning: JWT_SECRET not set in environment");

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("MongoDB connected");
    // Attempt to remove a legacy non-sparse email index that causes duplicate null errors
    try {
      const coll = mongoose.connection.collection("users");
      const indexes = await coll.indexes();
      const hasEmailIndex = indexes.some((ix) => ix.name === "email_1");
      if (hasEmailIndex) {
        try {
          await coll.dropIndex("email_1");
          console.log(
            "Dropped legacy index email_1 to allow sparse email indexing."
          );
        } catch (dropErr) {
          console.warn(
            "Could not drop legacy email_1 index:",
            dropErr.message || dropErr
          );
        }
      }
    } catch (err) {
      console.warn("Index check error:", err.message || err);
    }
  })
  .catch((err) => console.log(err));

// User Model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, unique: true, sparse: true },
  password: { type: String, required: true },
});
const User = mongoose.model("User", userSchema);

// Order Model
const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  productName: { type: String, required: true },
  productType: { type: String, required: true },
  price: { type: Number, required: true },
  size: { type: String, required: true },
  quantity: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});
const Order = mongoose.model("Order", orderSchema);

// Middleware for auth
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ msg: "No token" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
};

// Signup
app.post("/api/users/signup", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ msg: "Username and password required" });
  try {
    let user = await User.findOne({ username });
    if (user) return res.status(400).json({ msg: "User exists" });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user = new User({ username, password: hashedPassword });
    await user.save();
    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// Login
app.post("/api/users/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ msg: "Username and password required" });
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });
    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// Auth middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // decoded is expected to be { user: { id: ... }, iat, exp }
    req.user = decoded.user || decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
}

// Example order endpoint
app.post("/api/orders", authenticateToken, async (req, res) => {
  try {
    const { productName, productType, price, size, quantity } = req.body;
    if (!productName || !productType || !price || !size || !quantity) {
      return res.status(400).json({ message: "Missing order details" });
    }
    const order = new Order({
      userId: req.user.id,
      productName,
      productType,
      price,
      size,
      quantity,
    });
    await order.save();
    res.json({ message: "Order placed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error placing order" });
  }
});
// Get user info and orders for dashboard
app.get("/api/dashboard", authenticateToken, async (req, res) => {
  try {
    // Find user by ID
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Find user's orders (you can filter for pending if you add a status field)
    const orders = await Order.find({ userId: req.user.id });

    res.json({
      username: user.username,
      password: user.password, // Note: This is hashed!
      orders,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching dashboard info" });
  }
});

// Logout (client should remove token); endpoint provided for completeness
app.post("/api/users/logout", authenticateToken, (req, res) => {
  // Optionally: add token blacklist here
  return res.json({ message: "Logged out" });
});
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
