document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  const cards = document.querySelectorAll(".card");

  function filterCards() {
    const searchValue = searchInput.value.toLowerCase();
    const category = categoryFilter.value;

    cards.forEach(card => {
      const text = card.innerText.toLowerCase();
      const matchesSearch = text.includes(searchValue);
      const matchesCategory = category === "all" || card.dataset.category === category;

      card.style.display = (matchesSearch && matchesCategory) ? "block" : "none";
    });
  }

  searchInput.addEventListener("input", filterCards);
  categoryFilter.addEventListener("change", filterCards);

  // Background Canvas Animation
  const canvas = document.getElementById("bgCanvas");
  const ctx = canvas.getContext("2d");
  let stars = [];
  let w, h;

  const colors = ["#ff0000", "#ff7f00", "#ffff00", "#00ff00", "#0000ff", "#4b0082", "#9400d3"]; // VIBGYOR

  function resizeCanvas() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.zIndex = "-1";
    document.body.style.margin = "0";
    document.body.style.overflow = "hidden";
    initStars();
  }

  function initStars(count = 200) {
    stars = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.5 + 0.5,
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5,
        interactive: false,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
  }

  function animateStars() {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, w, h);

    for (let star of stars) {
      star.x += star.dx;
      star.y += star.dy;

      if (star.x < 0 || star.x > w) star.dx *= -1;
      if (star.y < 0 || star.y > h) star.dy *= -1;

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fillStyle = star.interactive ? "white" : star.color;
      ctx.fill();
    }
    requestAnimationFrame(animateStars);
  }

  function detectInteraction(e) {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    stars.forEach(star => {
      const dx = star.x - mouseX;
      const dy = star.y - mouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 50) {
        star.interactive = true;
        star.dx = (Math.random() - 0.5) * 4;
        star.dy = (Math.random() - 0.5) * 4;
      } else {
        star.interactive = false;
      }
    });
  }

  window.addEventListener("mousemove", detectInteraction);

  resizeCanvas();
  animateStars();
  window.addEventListener("resize", resizeCanvas);
});
