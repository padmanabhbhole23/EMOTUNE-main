/* eslint-disable no-unused-vars */
import express from "express";
import cors from "cors";
import mysql from "mysql";

const app = express();
const port = 5000;

// Middleware
app.use(express.json()); // For parsing JSON requests
app.use(cors());

// MySQL Connection
const db = mysql.createConnection({
  host: "localhost", // Adjust according to your XAMPP setup
  user: "root",      // Default XAMPP username
  password: "",      // Default XAMPP password
  database: "project", // Replace with your database name
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL");
});

// Song Recommendations Data
const songRecommendations = {
  happy: [
    "/assets/audio/happy-song-1.mp3",
    "/assets/audio/happy-song-2.mp3",
    "/assets/audio/happy-song-3.mp3",
  ],
  sad: [
    "/assets/audio/sad-song-1.mp3",
    "/assets/audio/sad-song-2.mp3",
    "/assets/audio/sad-song-3.mp3",
  ],
  neutral: [
    "/assets/audio/neutral-song-1.mp3",
    "/assets/audio/neutral-song-2.mp3",
    "/assets/audio/neutral-song-3.mp3",
  ],
  surprised: [
    "/assets/audio/surprised-song-1.mp3",
    "/assets/audio/surprised-song-2.mp3",
    "/assets/audio/surprised-song-3.mp3",
  ],
  angry: [
    "/assets/audio/angry-song-1.mp3",
    "/assets/audio/angry-song-2.mp3",
    "/assets/audio/angry-song-3.mp3",
  ],
};

// Login API Endpoint
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and Password are required" });
  }

  const query = "SELECT * FROM userinform WHERE email = ? AND pass = ?";
  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }

    if (results.length > 0) {
      res.status(200).json({ message: "Login successful", user: results[0], email });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  });
});

// Song Recommendations API Endpoint
app.get("/api/recommend", (req, res) => {
  try {
    
    const emotion = req.query.s; 
    const email=sessionStorage.getItem('userEmail');// Emotion passed as query parameter
    console.log("Received emotion:", emotion);

    const songs = songRecommendations[emotion] || ["No songs found"];
    res.json({ emotion, songs });
    if (!email || !emotion) {
      return res.status(400).json({ message: "Email and Emotion are required" });
    }
  
    // Insert emotion and email into the database
    const query = "INSERT INTO emotiondetail (userName,emotion) VALUES (?, ?)";
    db.query(query, [email, emotion], (err, result) => {
      if (err) {
        console.error("Error storing emotion:", err);
        return res.status(500).json({ message: "Server error" });
      }
  
      res.status(201).json({ message: "Emotion stored successfully" });
    });
  } catch (error) {
    console.error("Error in /api/recommend endpoint:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Sign-Up API Endpoint
app.post("/api/signup", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check if the email is already registered
  const checkQuery = "SELECT * FROM userinform WHERE email = ?";
  db.query(checkQuery, [email], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }

    if (results.length > 0) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    // Insert the new user
    const insertQuery = "INSERT INTO userinform (userName, email, pass) VALUES (?, ?, ?)";
    db.query(insertQuery, [name, email, password], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
      }
      res.status(201).json({ message: "User registered successfully" });
    });
  });
});
/*
// Emotion Storage API Endpoint
app.post("/api/input", (req, res) => {
  const { email, emotion } = req.body;

  if (!email || !emotion) {
    return res.status(400).json({ message: "Email and Emotion are required" });
  }

  // Insert emotion and email into the database
  const query = "INSERT INTO emotiondetail (userName,emotion) VALUES (?, ?)";
  db.query(query, [email, emotion], (err, result) => {
    if (err) {
      console.error("Error storing emotion:", err);
      return res.status(500).json({ message: "Server error" });
    }

    res.status(201).json({ message: "Emotion stored successfully" });
  });
});*/

// Start Server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
