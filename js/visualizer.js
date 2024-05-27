let audioCanvas = null;
let audioCanvasCtx = null;
let prevHeight = [];
const debug = document.getElementById("debug");
function wallpaperAudioListener(audioArray) {
  audioCanvasCtx.clearRect(0, 0, audioCanvas.width, audioCanvas.height);

  const centerX = audioCanvas.width / 2;
  const centerY = audioCanvas.height / 2;
  const radius = 250;
  const indexCoefficient = audioArray.length / (Math.PI * 2);
  const soundMagnitude = 500;
  const dampingRatio = 0.2;

  audioCanvasCtx.fillStyle = "rgb(255,255,255)";
  audioCanvasCtx.lineWidth = 5;
  audioCanvasCtx.lineCap = "round";

  audioCanvasCtx.beginPath();
  for (var i = 0; i < audioArray.length; i++) {
    const xOffset = Math.cos(i / indexCoefficient) * height;
    const yOffset = Math.sin(i / indexCoefficient) * height;
    const endX =
      Math.cos(i / indexCoefficient) * radius + centerX + xOffset;
    const endY =
      Math.sin(i / indexCoefficient) * radius + centerY + yOffset;
    if(i === 0) {
      audioCanvasCtx.moveTo(endX, endY);
    } else {
      audioCanvasCtx.lineTo(endX, endY)
    }
  }
  audioCanvasCtx.fill()
  audioCanvasCtx.closePath();
  for (var i = 0; i < audioArray.length; i++) {
    // audioCanvasCtx.strokeStyle = `rgb(${colorCoefficient * i},${
    //   colorCoefficient * i
    // },255)`;
    audioCanvasCtx.strokeStyle = "white";
    if(prevHeight.length === 0){
      prevHeight = Array(audioArray.length).fill(1);
    }
    
    var height = Math.max(
      soundMagnitude * Math.min(audioArray[i], 1),
      prevHeight[i]
    );

    prevHeight[i] = height - (dampingRatio * height)

    const startX =
      Math.cos(i / indexCoefficient + Math.PI / 2) * radius + centerX;
    const startY =
      Math.sin(i / indexCoefficient + Math.PI / 2) * radius + centerY;
    const xOffset = Math.cos(i / indexCoefficient + Math.PI / 2) * height;
    const yOffset = Math.sin(i / indexCoefficient + Math.PI / 2) * height;
    const endX =
      Math.cos(i / indexCoefficient + Math.PI / 2) * radius + centerX + xOffset;
    const endY =
      Math.sin(i / indexCoefficient + Math.PI / 2) * radius + centerY + yOffset;
    audioCanvasCtx.beginPath();
    audioCanvasCtx.moveTo(startX, startY);
    audioCanvasCtx.lineTo(endX, endY);
    audioCanvasCtx.stroke();
    audioCanvasCtx.closePath();
  }
}


// Get the audio canvas once the page has loaded
audioCanvas = document.getElementById("AudioCanvas");
// Setting internal canvas resolution to user screen resolution
// (CSS canvas size differs from internal canvas size)
audioCanvas.height = window.innerHeight;
audioCanvas.width = window.innerWidth;
// Get the 2D context of the canvas to draw on it in wallpaperAudioListener
audioCanvasCtx = audioCanvas.getContext("2d");

// Register the audio listener provided by Wallpaper Engine.
window.wallpaperRegisterAudioListener(wallpaperAudioListener);
