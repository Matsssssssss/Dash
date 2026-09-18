const express = require("express");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = 3000;

//Middleware
app.use(cors({origin: "http://127.0.0.1:5500", credentials: true}));
app.use(express.json());
app.use(express.static("Dromic"));
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


// ----- SERVER-SIDE SESSION STORE -----
// The browser only receives the session ID.
// The actual session information stays here:
// sessionId → username
// Example: "abc123..." → "admin"
const sessions = new Map();

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
      const user = users.find(user => user.username === username);

      // Don't reveal whether the username exists
      if (!user) {
        return res.status(401).json({
            message: "Invalid username or password."
        });
      }

      // Compare supplied password with stored hash
      const passwordValid = await bcrypt.compare(password, user.passwordHash);

      if (!passwordValid) {
        return res.status(401).json({
            message: "Invalid username or password."
        });
      }

      // Generate a session identifier
      const sessionId = crypto.randomBytes(32).toString("hex");

      // Store session SERVER-SIDE
      sessions.set(sessionId, {username: user.username, createdAt: Date.now()});
      console.log("Current sessions:", sessions);

      // In production, store this session ID
      // server-side (database/Redis/etc.).
      // This example only demonstrates the flow.
      res.cookie("session", sessionId, {
        httpOnly: true,
        secure: false,       // Requires HTTP
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 1000 // 1 hour
      });
      console.log("Cookie set for session:", sessionId);

      return res.status(200).json({message: "Login successful."});
      
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({
          message: "Internal server error."
      });
    }
});


app.get("/api/auth/check", (req, res) => {
  console.log("AUTH CHECK");
  console.log("Cookies received:", req.cookies);

  const sessionId = req.cookies.session;

  if (!sessionId) {
    console.log("NO SESSION COOKIE");
    return res.status(401).json({
      authenticated: false,
      message: "Not authenticated."
      });
  }

  const session = sessions.get(sessionId);

  if (!session) {
    console.log("SESSION NOT FOUND");
    return res.status(401).json({
      authenticated: false,
      message: "Session expired or invalid."
      });
  }

  return res.status(200).json({
    authenticated: true,
    username: session.username
  });
});

// --------------------------------------------------
// LOGOUT
// --------------------------------------------------
app.post("/api/logout", (req, res) => {

    const sessionId = req.cookies.session;

    if (sessionId) {
        // Remove session from server
        sessions.delete(sessionId);
    }

    // Remove browser cookie
    res.clearCookie("session", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/"
    });

    return res.status(200).json({
        message: "Logout successful."
    });
});

app.listen(PORT, () => {console.log(`Server running on http://localhost:${PORT}`);});