document.addEventListener("DOMContentLoaded", () => {
  const modeToggle = document.getElementById("modeToggle");
  const particles = document.getElementById("tsparticles");
  const lightBg = document.getElementById("lightInteractiveBg");
  const contactForm = document.getElementById("contactForm");
  const formMsg = document.getElementById("formMsg");

  // ====== Mode Switch with Persistence ======
  const applyVisualMode = (isDark) => {
    document.body.classList.toggle("dark-mode", isDark);
    document.body.classList.toggle("light-mode", !isDark);

    const textColor = isDark ? "#fff" : "#000";
    document.querySelectorAll("section, footer").forEach((el) => {
      el.style.color = textColor;
    });

    if (particles) particles.style.display = isDark ? "block" : "none";
    if (lightBg) lightBg.style.display = isDark ? "none" : "block";

    if (modeToggle) modeToggle.textContent = isDark ? "🌙" : "☀️";

    localStorage.setItem("theme", isDark ? "dark" : "light");

    // Control bubble spawning based on the mode
    // If not dark, then it's light, so enable bubbles
    toggleBubbleSpawning(!isDark);
  };

  if (modeToggle) {
    modeToggle.addEventListener("click", () => {
      const isDark = document.body.classList.contains("dark-mode");
      applyVisualMode(!isDark);
    });

    const savedTheme = localStorage.getItem("theme") || "dark";
    applyVisualMode(savedTheme === "dark");
  }

  // ====== Scroll-triggered class ======
  window.addEventListener("scroll", () => {
    if (document.body.classList.contains("light-mode")) {
      document.body.classList.toggle("scrolled", window.scrollY > 50);
    }
  });

  // ====== Mouse Light Point Position (no 3D tilt) ======
  if (lightBg) {
    document.addEventListener("mousemove", (e) => {
      if (document.body.classList.contains("light-mode")) {
        const x = e.clientX;
        const y = e.clientY;

        lightBg.style.setProperty("--x", `${x}px`);
        lightBg.style.setProperty("--y", `${y}px`);
      }
    });
  }

  // ====== EmailJS Contact Form ======
  if (typeof emailjs !== "undefined") {
    // CORRECTED: emailjs.init() only takes your User ID.
    // The template ID is passed in the sendForm method.
    emailjs.init("4t_d9XTedd-WF_wY2"); // ONLY your user ID here

    if (contactForm && formMsg) {
      contactForm.addEventListener("submit", function (e) {
        e.preventDefault(); // Crucial: prevents default form submission (page reload)

        // Get and validate email
        const emailInput = contactForm.querySelector('input[name="reply_to"]');
        const email = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
          formMsg.textContent = "❌ Please enter a valid email address.";
          formMsg.style.color = "#ff4d4d";
          emailInput.style.border = "2px solid red";
          emailInput.focus();
          return; // Stop the function if validation fails
        } else {
          emailInput.style.border = ""; // reset border if valid
        }

        // Send main email to YOU (template_s8zxs0b)
        emailjs
          .sendForm("service_7n2ssp4", "template_s8zxs0b", this)
          .then(
            (response) => {
              console.log("Email to owner SENT!", response.status, response.text);
              // If successful, now send the auto-reply to the user
              return emailjs.sendForm("service_7n2ssp4", "template_qmvyfgr", this); // Send auto-reply
            },
            (error) => {
              // Handle error for the email sent to you
              console.error("FAILED to send email to owner:", error);
              throw new Error("Failed to send your message to the owner. Please try again.");
            }
          )
          .then(
            (response) => {
              console.log("Auto-reply to user SENT!", response.status, response.text);
              // Both emails sent successfully
              formMsg.textContent = "✅ Message sent successfully! Check your inbox for a confirmation.";
              formMsg.style.color = "#0ff";
              contactForm.reset(); // Clear form only after both are successful
            },
            (error) => {
              // Handle error for the auto-reply email
              console.error("FAILED to send auto-reply to user:", error);
              // If the first email (to you) succeeded, we still show success, but log auto-reply failure
              formMsg.textContent = "✅ Message sent successfully! (Auto-reply failed to send)"; // More specific
              formMsg.style.color = "#0ff"; // Still success, but with a note
              contactForm.reset();
            }
          )
          .catch((error) => {
            // This catch handles any errors that propagated from the chain,
            // especially the initial error from sending to the owner.
            console.error("Overall EmailJS Submission Error:", error);
            formMsg.textContent = `❌ Failed to send message: ${error.message || error.text || "An unknown error occurred."}`;
            formMsg.style.color = "#ff4d4d";
          });
      });
    }

    // ====== Clear Form Button ======
    const clearFormBtn = document.getElementById("clearFormBtn");
    if (clearFormBtn && contactForm) {
      clearFormBtn.addEventListener("click", () => {
        contactForm.reset();
        if (formMsg) formMsg.textContent = "";
      });
    }
  }

  // ====== File Upload (Creations Section) ======
  const uploadInput = document.getElementById("uploadInput");
  const creationsList = document.getElementById("creationsList");

  if (uploadInput && creationsList) {
    uploadInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const item = document.createElement("div");
        item.textContent = `📂 ${file.name}`;
        item.classList.add("creation-item");
        creationsList.appendChild(item);
      }
    });
  }

  // ====== Typed.js Animation ======
  if (document.getElementById("typed") && typeof Typed !== "undefined") {
    new Typed("#typed", {
      strings: ["Hi, I'm Sarthak Jain", "Welcome to My Futuristic Portfolio"],
      typeSpeed: 60,
      backSpeed: 30,
      loop: true,
    });
  }

  // ====== tsParticles Background ======
  if (typeof tsParticles !== "undefined") {
    tsParticles.load("tsparticles", {
      fullScreen: { enable: true, zIndex: -1 },
      particles: {
        number: { value: 60 },
        color: { value: "#0ff" },
        shape: { type: "circle" },
        opacity: { value: 0.5 },
        size: { value: 2 },
        move: { enable: true, speed: 1 },
        links: {
          enable: true,
          distance: 100,
          color: "#0ff",
          opacity: 0.4,
          width: 1,
        },
      },
      interactivity: {
        events: {
          onHover: { enable: true, mode: "repulse" },
          onClick: { enable: true, mode: "push" },
        },
        modes: {
          repulse: { distance: 80 },
          push: { quantity: 4 },
        },
      },
      background: { color: "#0a0a0a" },
    });
  }

  // ====== Vanilla Tilt 3D Effect ======
  if (typeof VanillaTilt !== "undefined") {
    VanillaTilt.init(document.querySelectorAll(".contact-card"), {
      max: 20,
      speed: 800,
      glare: true,
      "max-glare": 0.3,
    });
  }

  // ====== Mobile Navigation Toggle ======
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      navLinks.classList.toggle("show");
    });
  }

  // ====== Back to Top Button ======
  const backToTop = document.getElementById("backToTop");

  if (backToTop) {
    window.addEventListener("scroll", () => {
      backToTop.style.display = window.scrollY > 300 ? "block" : "none";
    });

    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});

// ==== Floating & Poppable Bubbles for Light Mode Only ====
let bubbleInterval; // Declare a variable to hold the interval ID

function spawnBubble() {
  if (!document.body.classList.contains("light-mode")) return;

  const container = document.getElementById("bubbleContainer");
  if (!container) return;

  const bubble = document.createElement("div");
  bubble.className = "bubble";

  bubble.style.left = Math.random() * 100 + "vw";
  bubble.style.animationDuration = 8 + Math.random() * 5 + "s";

  bubble.addEventListener("click", function (e) {
    e.stopPropagation();
    showSplash(e.clientX, e.clientY);
    container.removeChild(bubble);
  });

  container.appendChild(bubble);

  setTimeout(() => {
    if (bubble.parentElement) bubble.remove();
  }, 14000);
}

function showSplash(x, y) {
  const container = document.getElementById("bubbleContainer");
  if (!container) return;

  for (let i = 0; i < 6; i++) {
    const splash = document.createElement("div");
    splash.className = "splash";

    const angle = Math.random() * 2 * Math.PI;
    const distance = 20 + Math.random() * 30;

    const dx = Math.cos(angle) * distance + "px";
    const dy = Math.sin(angle) * distance + "px";

    splash.style.left = `${x}px`;
    splash.style.top = `${y}px`;
    splash.style.setProperty("--x", dx);
    splash.style.setProperty("--y", dy);

    container.appendChild(splash);

    setTimeout(() => splash.remove(), 600);
  }
}

// Function to start/stop the bubble spawning
function toggleBubbleSpawning(enable) {
  if (enable && !bubbleInterval) {
    bubbleInterval = setInterval(() => {
      if (document.body.classList.contains("light-mode")) {
        spawnBubble();
      }
    }, 500);
  } else if (!enable && bubbleInterval) {
    clearInterval(bubbleInterval);
    bubbleInterval = null;
  }
}

// Initial call for bubbles based on saved theme outside DOMContentLoaded
const initialThemeForBubbles = localStorage.getItem("theme") || "dark";
toggleBubbleSpawning(initialThemeForBubbles === "light");