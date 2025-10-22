const video = document.getElementById("video");
const statusText = document.getElementById("status");
let canvas;

// Cartoon sounds (online links)
const sounds = {
  happy: new Audio('https://www.soundjay.com/button/beep-07.mp3'),
  angry: new Audio('https://www.soundjay.com/button/button-10.mp3'),
  surprised: new Audio('https://www.soundjay.com/button/button-3.mp3'),
  sad: new Audio('https://www.soundjay.com/button/button-09.mp3')
};

// Load face-api models from online
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models')
]).then(startVideo);

function startVideo() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      video.srcObject = stream;
      console.log("Camera started ✅");
    })
    .catch(err => console.error("Camera error: ", err));
}

// Detect faces continuously
video.addEventListener("playing", () => {
  canvas = faceapi.createCanvasFromMedia(video);
  document.body.appendChild(canvas);
  canvas.width = video.width = 380;
  canvas.height = video.height = 300;

  detectFaces();
});

async function detectFaces() {
  const detection = await faceapi.detectSingleFace(video, 
    new faceapi.TinyFaceDetectorOptions({ inputSize: 128, scoreThreshold: 0.5 })
  ).withFaceExpressions();

  if (detection) {
    const resized = faceapi.resizeResults(detection, { width: video.width, height: video.height });
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    faceapi.draw.drawDetections(canvas, resized);

    displayAllEmotions(detection.expressions);
  }

  requestAnimationFrame(detectFaces);
}

// Display all emotions & trigger strongest
function displayAllEmotions(expressions) {
  const sorted = Object.entries(expressions).sort((a,b) => b[1]-a[1]);
  const top3 = sorted.slice(0,3);
  statusText.innerHTML = top3.map(e => `${e[0].toUpperCase()}: ${(e[1]*100).toFixed(1)}%`).join(' | ');
  const strongest = top3[0][0];
  triggerEmotionEffect(strongest);
}

// Reactions
function triggerEmotionEffect(emotion){
  switch(emotion){
    case "happy": confettiExplosion(); playSound('happy'); showEmoji('😁'); break;
    case "angry": screenShake(); playSound('angry'); showEmoji('😡'); break;
    case "surprised": flashEffect(); playSound('surprised'); showEmoji('😲'); break;
    case "sad": rainEffect(); playSound('sad'); showEmoji('😢'); break;
    default: resetEffects();
  }
}

// Play sounds
function playSound(type){
  if(sounds[type]){ sounds[type].currentTime=0; sounds[type].play(); }
}

// Effects
function confettiExplosion(){ confetti({ particleCount:200, spread:120, origin:{y:0.6} }); }
function screenShake(){ document.body.classList.add("shake"); setTimeout(()=>document.body.classList.remove("shake"),500); }
function flashEffect(){ document.body.style.filter="brightness(4)"; setTimeout(()=>document.body.style.filter="brightness(1)",150); }
function rainEffect(){ document.body.style.background="linear-gradient(#0a0f1f,#001)"; }
function resetEffects(){ document.body.classList.remove("shake"); document.body.style.filter="none"; document.body.style.background="radial-gradient(circle at top, #000428,#004e92)"; }

// Emoji animation
function showEmoji(emoji){
  const e=document.createElement('div');
  e.textContent=emoji;
  e.style.position='absolute';
  e.style.fontSize='50px';
  e.style.left=Math.random()*window.innerWidth+'px';
  e.style.top=Math.random()*window.innerHeight+'px';
  e.style.pointerEvents='none';
  document.body.appendChild(e);

  let t=0;
  const interval=setInterval(()=>{
    t+=2;
    e.style.top=(parseFloat(e.style.top)-t)+'px';
    e.style.opacity=1-t/200;
    if(t>200){ e.remove(); clearInterval(interval);}
  },20);
}
