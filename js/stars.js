let starsCanvas = null;
let ctx = null;
const lifeLength = 4;
starsCanvas = document.getElementById("starsCanvas");
starsCanvas.height = window.innerHeight;
starsCanvas.width = window.innerWidth;
ctx = starsCanvas.getContext("2d");
// Generate random stars
const stars = [];
const numStars = 10000;
const maxStars = 12000; // Maximum number of stars
const minFadeOutAlpha = 0.05; // Minimum alpha for stars to fade out
const maxFadeInSpeed = 0.1;
const maxFadeOutSpeed = 0.1;

function generateStar() {
  return {
    x: Math.random() * starsCanvas.width,
    y: Math.random() * starsCanvas.height,
    alpha: 0,
    fadeInSpeed: Math.random() * maxFadeInSpeed,
    maxAlpha: Math.random() * 1,
    lifeTime: Math.random() * 4000,
    fadeOutSpeed: Math.random() * maxFadeOutSpeed,
  };
}

function updateStars() {
  for (let i = stars.length - 1; i >= 0; i--) {
    const star = stars[i];
    if (star.alpha < star.maxAlpha) {
      star.alpha += star.fadeInSpeed;
    } else if (star.lifeTime > 0) {
      star.lifeTime -= 16;
    } else if (star.alpha > minFadeOutAlpha) {
      star.alpha -= star.fadeOutSpeed;
    } else {
      stars.splice(i, 1);
    }
  }
  while (stars.length < maxStars) {
    stars.push(generateStar());
  }
}

function draw() {
  ctx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);

  stars.forEach((star) => {
    ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
    ctx.fillRect(star.x, star.y, 1, 1);
  });

  updateStars();
  requestAnimationFrame(draw);
}

draw();
