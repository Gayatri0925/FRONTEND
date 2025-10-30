const video = document.getElementById('video');
const canvas = document.getElementById('overlay');
const ctx = canvas.getContext('2d');
const statusText = document.getElementById('status');
const songTitle = document.getElementById('songTitle');
const player = document.getElementById('player');

// 🔑 Replace with YOUR YouTube API Key
const YOUTUBE_API_KEY = "AIzaSyBdNUTGRUBA6LT15-aaeBdzdmGIegZU2SU";

// Face API model source
const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/models/';

const moodToMusic = {
  happy: "happy upbeat pop songs",
  sad: "sad emotional piano music",
  angry: "calming relaxation instrumental",
  surprised: "exciting energetic edm songs",
  disgusted: "refreshing chill vibe tracks",
  fearful: "peaceful ambient lofi music",
  neutral: "lofi chill beats to relax"
};

async function loadModels() {
  statusText.innerText = "Loading AI models...";
  await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
  await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
  statusText.innerText = "✅ Models loaded successfully";
}

async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    await video.play();
    canvas.width = video.videoWidth || 340;
    canvas.height = video.videoHeight || 260;
    statusText.innerText = "✅ Camera started";
  } catch (err) {
    statusText.innerText = "❌ Camera blocked. Allow permission!";
    console.error(err);
  }
}

function getDominantExpression(expressions) {
  return Object.keys(expressions).reduce((a, b) => expressions[a] > expressions[b] ? a : b);
}

async function fetchMusic(mood) {
  const randomWord = ["mix", "playlist", "2024", "top hits", "official audio", "songs"][Math.floor(Math.random() * 6)];
  const query = `${moodToMusic[mood] || "feel good music"} ${randomWord}`;
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=10&videoEmbeddable=true&q=${encodeURIComponent(query)}&key=${YOUTUBE_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      songTitle.innerText = "No songs found.";
      return;
    }

    // Pick a random playable video
    const randomIndex = Math.floor(Math.random() * data.items.length);
    const video = data.items[randomIndex];
    const videoId = video.id.videoId;
    const title = video.snippet.title;

    songTitle.innerText = `Mood: ${mood.toUpperCase()} 🎶 ${title}`;
    player.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  } catch (error) {
    console.error("YouTube API Error:", error);
    songTitle.innerText = "⚠️ Error fetching music!";
  }
}

async function runDetection() {
  const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 160, scoreThreshold: 0.5 });
  let lastMood = "";
  setInterval(async () => {
    const result = await faceapi.detectSingleFace(video, options).withFaceExpressions();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (result) {
      const resized = faceapi.resizeResults(result, { width: canvas.width, height: canvas.height });
      const { x, y, width, height } = resized.detection.box;
      const mood = getDominantExpression(resized.expressions);

      ctx.strokeStyle = "#00b4d8";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);
      ctx.font = "16px Arial";
      ctx.fillStyle = "#00b4d8";
      ctx.fillText(mood.toUpperCase(), x, y > 20 ? y - 5 : y + height + 20);

      statusText.innerText = `Mood Detected: ${mood}`;

      if (mood !== lastMood) {
        lastMood = mood;
        fetchMusic(mood);
      }
    } else {
      statusText.innerText = "No face detected...";
    }
  }, 1500);

  // Optional: refresh new video every 30 seconds even if mood stays same
  setInterval(() => {
    if (lastMood) fetchMusic(lastMood);
  }, 30000);
}

(async function init() {
  await loadModels();
  await startCamera();
  runDetection();
})();
