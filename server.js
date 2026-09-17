const express = require("express");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = 3000;

app.use(cors({origin: "http://127.0.0.1:5500", credentials: true}));
app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());

// --------------------------------------------------
// Example user
// --------------------------------------------------
// In a real application, users should come from a
// database. Never store plain-text passwords.
//
// Generate your own hash with:
// const hash = await bcrypt.hash("your-password", 12);

const users = [
    {
        username: "admin",
        passwordHash: "$2b$12$gg0s3nOM4e1AxmgPk5K2F.fmf3zI8WzDgYSay5DWwHyvqzvbfcy7u"
    }
];

// --------------------------------------------------
// Login endpoint
// --------------------------------------------------

app.post("/api/login", async (req, res) => {

    try {
      const { username, password } = req.body;

      // Validate request
      if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required."
        });
      }

      // Find user
      const user = users.find(
        user => user.username === username
      );

      // Don't reveal whether the username exists
      if (!user) {
        return res.status(401).json({
            message: "Invalid username or password."
        });
      }

      // Compare supplied password with stored hash
      const passwordValid = await bcrypt.compare(
        password,
        user.passwordHash
      );

      if (!passwordValid) {
        return res.status(401).json({
            message: "Invalid username or password."
        });
      }

      // Generate a session identifier
      const sessionId = crypto.randomBytes(32).toString("hex");

      // In production, store this session ID
      // server-side (database/Redis/etc.).
      // This example only demonstrates the flow.

      res.cookie("session", sessionId, {
        httpOnly: true,
        secure: false,       // Requires HTTPS
        sameSite: "strict",
        maxAge: 60 * 60 * 1000 // 1 hour
      });

      return res.status(200).json({message: "Login successful."});
      
    } catch (error) {

      console.error("Login error:", error);
      return res.status(500).json({
          message: "Internal server error."
      });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});