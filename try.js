const canvas = document.getElementById("spaceCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let stars = [];
let mouse = { x: 0, y: 0 };

function initStars(count = 250) {
  stars = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * canvas.width - canvas.width / 2,
      y: Math.random() * canvas.height - canvas.height / 2,
      z: Math.random() * canvas.width,
      radius: Math.random() * 2
    });
  }
}

function drawStars() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let star of stars) {
    star.z -= 2;
    if (star.z <= 0) star.z = canvas.width;

    let k = 128.0 / star.z;
    let x = (star.x + mouse.x / 50) * k + canvas.width / 2;
    let y = (star.y + mouse.y / 50) * k + canvas.height / 2;
    let size = (1 - star.z / canvas.width) * 2 + star.radius * 0.3;

    if (x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height) {
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = "#0ff";
      ctx.fill();
    }
  }
}

function animate() {
  drawStars();
  requestAnimationFrame(animate);
}

initStars();
animate();

// Glowing enter button effect
const enterBtn = document.getElementById("enterBtn");
enterBtn.style.boxShadow = "0 0 20px #0ff, 0 0 40px #0ff";
enterBtn.addEventListener("mouseenter", () => {
  enterBtn.style.boxShadow = "0 0 25px #0ff, 0 0 50px #0ff";
});
enterBtn.addEventListener("mouseleave", () => {
  enterBtn.style.boxShadow = "0 0 20px #0ff, 0 0 40px #0ff";
});

// Enter button transition
enterBtn.addEventListener("click", () => {
  const overlay = document.querySelector(".overlay");
  overlay.style.opacity = "0";
  setTimeout(() => {
    window.location.href = "explore.html";
  }, 1000);
});

// Interactive movement with mouse
window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX - window.innerWidth / 2;
  mouse.y = e.clientY - window.innerHeight / 2;
});

// Resize canvas
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initStars();
});
