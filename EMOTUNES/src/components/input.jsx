/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react";
import * as faceapi from "face-api.js";
import { useNavigate } from "react-router-dom";

const EmotionBasedMusicRecommender = () => {
  const [emotion, setEmotion] = useState(""); // Store the detected emotion
  const [songs, setSongs] = useState([]); // Store recommended songs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate=useNavigate();

  useEffect(() => {
    const checkLogin = () => {
      const email = sessionStorage.getItem("userEmail");
      if (!email) {
        console.log("User not logged in. Redirecting to login...");
        navigate("/login"); // Redirect to login page
      }
      
    };
    checkLogin();
    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
        await faceapi.nets.faceExpressionNet.loadFromUri("/models");
        console.log("Models loaded successfully!");
      } catch (err) {
        console.error("Error loading models:", err);
      }
    };

    loadModels();
  }, []);

  const handleLogout = () => {
    const video = videoRef.current;
    if (video && video.srcObject) {
      const stream = video.srcObject;
      const tracks = stream.getTracks();

      tracks.forEach((track) => {
        track.stop(); // Stop each track
      });

      video.srcObject = null; // Clear the video source
    }
    // Clear session storage
    sessionStorage.clear();

    // Redirect to login page
    navigate("/login");
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const captureAndAnalyze = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !video.readyState) {
      console.error("Video not ready for analysis.");
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const displaySize = { width: video.videoWidth, height: video.videoHeight };
    faceapi.matchDimensions(canvas, displaySize);

    try {
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (detections.length > 0) {
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

        const expressions = detections[0].expressions;
        const dominantEmotion = Object.keys(expressions).reduce((a, b) =>
          expressions[a] > expressions[b] ? a : b
        );

        setEmotion(dominantEmotion);
        recommendSongs(dominantEmotion);
      } else {
        console.log("No faces detected.");
        alert("No faces Detected....")
      }
    } catch (err) {
      console.error("Error analyzing emotions:", err);
    }
  };

  const recommendSongs = async (detectedEmotion) => {
    try {
      const email = sessionStorage.getItem("userEmail"); // Retrieve email from sessionStorage
      const response = await fetch(`http://localhost:5000/api/recommend?s=${detectedEmotion}&email=${email}`);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  
      const data = await response.json();
      setSongs(data.songs || ["No songs found"]);
    } catch (err) {
      console.error("Error fetching song recommendations:", err);
    }
  };
  

  return (
    <div
      style={{
        textAlign: "center",
        padding: "20px",
        backgroundColor: "black",
        color: "white",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Logout Button */}
      <button
        onClick={handleLogout}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          backgroundColor: "red",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
      <h1>Emotion Based Music Recommender</h1>
      <div style={{ position: "relative", display: "inline-block" }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            width: "100%",
            maxWidth: "500px",
            margin: "10px auto",
            border: "1px solid black",
            display: "block",
          }}
        ></video>
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        ></canvas>
      </div>
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={startCamera}
          style={{ margin: "10px", padding: "10px 20px", fontSize: "16px" }}
        >
          Start Camera
        </button>
        <button
          onClick={captureAndAnalyze}
          style={{ margin: "10px", padding: "10px 20px", fontSize: "16px" }}
        >
          Capture and Analyze
        </button>
      </div>
      {emotion && <h2>Detected Emotion: {emotion}</h2>}
      {songs.length > 0 && (
        <div>
          <h3>Recommended Songs:</h3>
          <ul>
            {songs.map((song, index) => (
              <li key={index}>{song}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default EmotionBasedMusicRecommender;
