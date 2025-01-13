
import express from "express";
import cors from "cors";

const app = express();
const port = 5000;


app.use(cors());

// Static song recommendations
/*
const songRecommendations = {
  happy: ["Happy Song 1", "Happy Song 2", "Happy Song 3"],
  sad: ["Sad Song 1", "Sad Song 2", "Sad Song 3"],
  neutral: ["Neutral Song 1", "Neutral Song 2", "Neutral Song 3"],
};*/
// Define song recommendations with audio file paths
const songRecommendations = {
  happy: [
    "/assets/audio/happy-song-1.",
    "/assets/audio/happy-song-2.mp3",
    "/assets/audio/happy-song-3.mp3"
  ],
  sad: [
    "/assets/audio/sad-song-1.mp3",
    "/assets/audio/sad-song-2.mp3",
    "/assets/audio/sad-song-3.mp3"
  ],
  neutral: [
    "/assets/audio/neutral-song-1.mp3",
    "/assets/audio/neutral-song-2.mp3",
    "/assets/audio/neutral-song-3.mp3"
  ],
};

// API endpoint for song recommendations based on emotion
app.get("/api/recommend", (req, res) => {
  try {
    const emotion = req.query.s;
    console.log("Received emotion:", emotion);

    const songs = songRecommendations[emotion] || ["No songs found"];
    res.json({ emotion, songs });
  } catch (error) {
    console.error("Error in /api/recommend endpoint:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
