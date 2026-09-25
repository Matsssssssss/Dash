require("dotenv").config();
const path = require("path");
const express = require("express");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3000;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  }
});

//Middleware
const allowedOrigin = process.env.FRONTEND_ORIGIN;
app.use(cors({origin: allowedOrigin, credentials: true}));
app.use(express.json());
app.use(cookieParser());

  //public route
app.get("/dromic-login", (req, res) => {
  res.sendFile(path.join(__dirname, "Dromic", "dromic-login.html"));
});

  //protected route
app.get("/dromic", requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, "Dromic", "dromic-report.html"));
});

 //protected route for api
app.get("/api/dromic/data", requireApiAuth, (req, res) => {
  res.sendFile(
    path.join(__dirname, "Dromic", "dromic-report.html"));
});

 //redirect root to login page
app.get("/", (req, res) => {
  res.redirect("/dromic-login");
});

//blocking old routes
app.get("https://matsssssssss.github.io/Dash/Dromic/dromic-login.html", (req, res) => {
  res.sendStatus(404).send("Not Found");});
app.get("https://matsssssssss.github.io/Dash/Dromic/dromic-report.html", (req, res) => {
  res.sendStatus(404).send("Not Found");});

app.use(express.static("supportFiles"));
app.use(express.static("Images"));

// Generate own hash
pool.query("SELECT NOW()").then(result => {
  console.log("PostgreSQL connected!");
  console.log("Database time:", result.rows[0].now);
})
.catch(error => {console.error("PostgreSQL connection failed:", error);});

// ----- SERVER-SIDE SESSION STORE -----
// The browser only receives the session ID.
// The actual session information stays here:
const sessions = new Map();

//requires Authentication for certain routes
//html page protection
function requireAuth(req, res, next) {
  const sessionId = req.cookies.session;
  if (!sessionId) {
    return res.redirect("/dromic-login");
  }

  const session = sessions.get(sessionId);
  if (!session) {
    return res.redirect("/dromic-login");
  }

  req.user = session;
  next();
}

//api protection
function requireApiAuth(req, res, next) {
  const sessionId = req.cookies.session;
  if (!sessionId) {
    return res.status(401).json({
      message: "Authentication required."
    });
  }

  const session = sessions.get(sessionId);
  if (!session) {
    return res.status(401).json({
     message: "Invalid or expired session."
    });
  }

  req.user = session;
  next();
}

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
      const result = await pool.query(
        `
        SELECT id, username, password_hash
        FROM users
        WHERE username = $1
        `,
        [username]
      );

      const user = result.rows[0];

      // Don't reveal whether the username exists
      if (!user) {
        return res.status(401).json({
            message: "Invalid username or password."
        });
      }

      // Compare supplied password with stored hash
      const passwordValid = await bcrypt.compare(password, user.password_hash);

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
      const isProduction = process.env.NODE_ENV === "production";

      // In production, store this session ID
      // This example only demonstrates the flow.
      res.cookie("session", sessionId, {
        httpOnly: true,
        secure: isProduction, // Requires HTTPS in production
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

//AUTHENTICATION CHECK
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

app.listen(PORT, "0.0.0.0", () => {console.log(`Server running on port ${PORT}`);});
// app.listen(PORT, () => {console.log(`Server running on http://localhost:${PORT}`);});


app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok"
  });
});