document.addEventListener("DOMContentLoaded", () => {
    // --- DOM Elements for Card Filtering ---
    const searchInput = document.getElementById("searchInput");
    const categoryFilter = document.getElementById("categoryFilter");
    const cards = document.querySelectorAll(".card");

    // --- Card Filtering Logic ---
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

    // Event listeners for filtering controls
    if (searchInput) {
        searchInput.addEventListener("input", filterCards);
    }
    if (categoryFilter) {
        categoryFilter.addEventListener("change", filterCards);
    }

    // --- Background Canvas Animation (Interactive Stars) ---
    const canvas = document.getElementById("bgCanvas");
    // Ensure canvas exists before proceeding with animation setup
    if (canvas) {
        const ctx = canvas.getContext("2d");
        let stars = []; // Array to hold star objects
        let w, h;     // Variables for canvas width and height

        // VIBGYOR color spectrum for stars
        const colors = ["#ff0000", "#ff7f00", "#ffff00", "#00ff00", "#0000ff", "#4b0082", "#9400d3"];

        // Function to resize canvas dimensions and re-initialize stars
        function resizeCanvas() {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
            // Canvas positioning and sizing are now handled by CSS
            initStars(); // Re-initialize stars when canvas size changes
        }

        // Function to initialize star positions and properties
        function initStars(count = 200) {
            stars = []; // Clear existing stars
            for (let i = 0; i < count; i++) {
                stars.push({
                    x: Math.random() * w,        // Random X position within canvas width
                    y: Math.random() * h,        // Random Y position within canvas height
                    r: Math.random() * 1.5 + 0.5, // Random radius between 0.5 and 2 pixels
                    dx: (Math.random() - 0.5) * 0.5, // Random horizontal movement speed (-0.25 to 0.25)
                    dy: (Math.random() - 0.5) * 0.5, // Random vertical movement speed (-0.25 to 0.25)
                    interactive: false,          // Flag to indicate if star is currently interactive (white color)
                    color: colors[Math.floor(Math.random() * colors.length)] // Assign a random VIBGYOR color
                });
            }
        }

        // Animation loop for drawing and updating stars
        function animateStars() {
            ctx.clearRect(0, 0, w, h); // Clear the entire canvas for the next frame
            // The background color for the canvas is set by CSS

            for (let star of stars) {
                // Update star position based on its movement vectors
                star.x += star.dx;
                star.y += star.dy;

                // Reverse movement direction if star hits a canvas edge
                if (star.x < 0 || star.x > w) star.dx *= -1;
                if (star.y < 0 || star.y > h) star.dy *= -1;

                ctx.beginPath();
                ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2); // Draw the star as a circle
                // If interactive, draw white; otherwise, draw its assigned color
                ctx.fillStyle = star.interactive ? "white" : star.color;
                ctx.fill();
            }
            requestAnimationFrame(animateStars); // Request the next animation frame
        }

        // Function to detect mouse interaction with stars
        function detectInteraction(e) {
            const mouseX = e.clientX; // Get mouse X coordinate relative to viewport
            const mouseY = e.clientY; // Get mouse Y coordinate relative to viewport

            stars.forEach(star => {
                const dx = star.x - mouseX;
                const dy = star.y - mouseY;
                const distance = Math.sqrt(dx * dx + dy * dy); // Calculate distance from mouse to star

                // If mouse is within 50 pixels of a star
                if (distance < 50) {
                    star.interactive = true; // Mark as interactive
                    // Make interactive stars move faster and more erratically
                    star.dx = (Math.random() - 0.5) * 4;
                    star.dy = (Math.random() - 0.5) * 4;
                } else {
                    star.interactive = false; // Not interactive
                }
            });
        }

        // Add mousemove listener to the window to detect interaction across the entire page
        window.addEventListener("mousemove", detectInteraction);

        // Initial setup calls for the canvas animation
        resizeCanvas(); // Set initial canvas size and populate stars
        animateStars(); // Start the animation loop
        window.addEventListener("resize", resizeCanvas); // Add resize listener for responsiveness
    } else {
        console.warn("Canvas element with ID 'bgCanvas' not found. Background animation will not run.");
    }

    // --- Special Gift Card / Birthday Modal Logic ---
    const availGiftCardBtn = document.getElementById("availGiftCardBtn");
    const birthdayModalOverlay = document.getElementById("birthdayModalOverlay");
    const birthdayModalContent = document.getElementById("birthdayModalContent");
    const closeBirthdayModalBtn = document.getElementById("closeBirthdayModalBtn");

    const codeEntry = document.getElementById("codeEntry");
    const codeInput = document.getElementById("codeInput");
    const submitCodeBtn = document.getElementById("submitCodeBtn");
    const codeMessage = document.getElementById("codeMessage");

    const birthdayMessageContainer = document.getElementById("birthdayMessageContainer");
    const birthdayWishHeading = document.getElementById("birthdayWishHeading");
    const birthdayWishText = document.getElementById("birthdayWishText");
    const balloonContainer = document.getElementById("balloonContainer");
    const confettiContainer = document.getElementById("confettiContainer"); // Get confetti container

    const SECRET_CODE_NYSA = "NYSA20"; // Secret code for Nysa's wish
    const SECRET_CODE_NEHA = "NEHA2122"; // Secret code for Neha
    const SECRET_CODE_DIVPREET = "DIVBRO"; // Secret code for Neha
    const SECRET_CODE_SISTER = "SISLOVE"; // New secret code for your sister
    const SECRET_CODE_SHIVANI = "SHIVANI"; // New secret code for Shivani
    const SECRET_CODE_YAMINI = "FUZZYY"; // Secret code for Yamini
    const SECRET_CODE_ABHI = "LOVE2924"; // Secret code for Abhi

    // Directly set the song filename here
    const BIRTHDAY_SONG_FILE = "happy-birthday-357371.mp3";
    let userAudio = null; // Global variable for the Audio object

    // Function to play the hardcoded song file
    const playBirthdaySongFile = () => {
        if (BIRTHDAY_SONG_FILE) {
            if (userAudio) { // If audio already exists, stop and clear it
                userAudio.pause();
                userAudio.currentTime = 0;
                userAudio = null;
            }
            try {
                userAudio = new Audio(BIRTHDAY_SONG_FILE);
                userAudio.loop = true; // Loop the song
                userAudio.volume = 0.5; // Set a default volume
                userAudio.play().catch(e => {
                    console.error("Failed to play audio. This might be due to browser autoplay policies or file not found:", e);
                    // Inform user about autoplay policy if it's the issue
                    codeMessage.textContent = `❗ Auto-play blocked or file not found (${BIRTHDAY_SONG_FILE}). Please click anywhere to enable audio.`;
                    codeMessage.style.color = "#FFA500"; // Orange warning color
                });
            } catch (e) {
                console.error("Error creating audio object:", e);
                codeMessage.textContent = `❗ Error loading song file (${BIRTHDAY_SONG_FILE}). Please ensure it's in the same folder.`;
                codeMessage.style.color = "#ff4d4d";
            }
        } else {
            console.warn("BIRTHDAY_SONG_FILE is not defined.");
            codeMessage.textContent = "❗ Birthday song file path is missing. Song will not play.";
            codeMessage.style.color = "#ff4d4d";
        }
    };

    // Function to stop the song
    const stopBirthdaySongFile = () => {
        if (userAudio) {
            userAudio.pause();
            userAudio.currentTime = 0;
            userAudio = null;
        }
    };


    const createBalloons = (count = 15) => {
        clearBalloons();
        const colors = ['#FFD700', '#FF69B4', '#87CEEB', '#98FB98', '#FF4500', '#EE82EE']; // Gold, HotPink, SkyBlue, PaleGreen, OrangeRed, Violet

        for (let i = 0; i < count; i++) {
            const balloon = document.createElement('div');
            balloon.className = 'balloon';
            balloon.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            balloon.style.left = `${Math.random() * 100}vw`; // Random horizontal position
            balloon.style.animationDuration = `${10 + Math.random() * 8}s`; // Random duration for variety
            balloon.style.animationDelay = `${Math.random() * 3}s`; // Random delay for staggered appearance

            // Add click listener for hearts
            balloon.addEventListener('click', (e) => {
                // Get click position relative to the modal content for spawning hearts
                const rect = birthdayModalContent.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const clickY = e.clientY - rect.top;
                const balloonColor = balloon.style.backgroundColor; // Pass balloon color to hearts

                createHeartParticles(clickX, clickY, balloonColor);
                balloon.remove(); // Remove the balloon after it's clicked
            });

            balloonContainer.appendChild(balloon);
        }
    };

    const clearBalloons = () => {
        if (balloonContainer) balloonContainer.innerHTML = '';
    };

    // Confetti Sprinklers functions
    const createConfetti = (count = 50) => {
        clearConfetti();
        const colors = ['#FFC0CB', '#FFFFFF', '#ADD8E6', '#90EE90', '#FFD700', '#FF6347']; // Pink, White, Light Blue, Light Green, Gold, Tomato

        if (!confettiContainer) {
            console.warn("Confetti container not found.");
            return;
        }

        // Get the dimensions of the confettiContainer itself, not the modal
        const containerRect = confettiContainer.getBoundingClientRect();

        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'confetti-particle';
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

            // Position within the confettiContainer's internal space
            // Start positions randomly across the top 20% of the container
            const initialXRelativeToContainer = Math.random() * containerRect.width;
            const initialYRelativeToContainer = Math.random() * (containerRect.height * 0.2); // Start within top 20%

            // Calculate end positions relative to the confettiContainer
            // Spread horizontally across the container's width, falling past its bottom
            const destinationXRelativeToContainer = initialXRelativeToContainer + (Math.random() - 0.5) * (containerRect.width * 0.8); // Spread more horizontally
            const destinationYRelativeToContainer = containerRect.height + Math.random() * 100; // Fall past bottom

            particle.style.left = `${initialXRelativeToContainer}px`;
            particle.style.top = `${initialYRelativeToContainer}px`;

            // These CSS variables define the *offset* movement from the initial position
            particle.style.setProperty('--x-start', `0px`);
            particle.style.setProperty('--y-start', `0px`);
            particle.style.setProperty('--x-end', `${destinationXRelativeToContainer - initialXRelativeToContainer}px`);
            particle.style.setProperty('--y-end', `${destinationYRelativeToContainer - initialYRelativeToContainer}px`);

            particle.style.animationDuration = `${5 + Math.random() * 5}s`; // 5-10 seconds
            particle.style.animationDelay = `${Math.random() * 2}s`; // 0-2 seconds delay

            confettiContainer.appendChild(particle);

            // Remove particle after animation to prevent DOM clutter, adjusting timeout for longer duration
            setTimeout(() => {
                if (particle.parentElement) particle.remove();
            }, (parseFloat(particle.style.animationDuration) * 1000) + (parseFloat(particle.style.animationDelay) * 1000) + 500); // Added 500ms buffer
        }
    };

    const clearConfetti = () => {
        if (confettiContainer) confettiContainer.innerHTML = '';
    };

    // Heart Particles functions
    const createHeartParticles = (x, y, color, count = 5) => {
        // Use confettiContainer as the parent for hearts too, as it's positioned for overlays
        if (!confettiContainer) {
            console.warn("Confetti container not found for hearts.");
            return;
        }

        for (let i = 0; i < count; i++) {
            const heart = document.createElement('div');
            heart.className = 'heart-particle';
            heart.style.backgroundColor = color || '#FF69B4'; // Use balloon color or default pink
            
            // Position the heart relative to the click point (which is relative to modalContent)
            // Since confettiContainer is 100% of modalContent, these coordinates work directly.
            heart.style.left = `${x}px`;
            heart.style.top = `${y}px`;

            // Randomize trajectory
            const angle = Math.random() * Math.PI * 2; // Full circle burst
            const distance = 30 + Math.random() * 40; // Spread distance 30-70px
            const endX = Math.cos(angle) * distance;
            const endY = Math.sin(angle) * distance;

            heart.style.setProperty('--end-x', `${endX}px`);
            heart.style.setProperty('--end-y', `${endY}px`);
            heart.style.animationDuration = `${0.8 + Math.random() * 0.5}s`; // Faster animation for burst
            heart.style.animationDelay = `${Math.random() * 0.2}s`; // Small delay variation

            confettiContainer.appendChild(heart);

            // Remove particle after animation to prevent DOM clutter
            setTimeout(() => {
                if (heart.parentElement) heart.remove();
            }, (parseFloat(heart.style.animationDuration) * 1000) + (parseFloat(heart.style.animationDelay) * 1000) + 50);
        }
    };


    const openBirthdayModal = () => {
        birthdayModalOverlay.classList.add('show');
        codeEntry.style.display = 'block'; // Show code entry section
        birthdayMessageContainer.style.display = 'none'; // Hide birthday wish section
        codeInput.value = ''; // Clear any previous input
        codeMessage.textContent = ''; // Clear any previous messages
        codeInput.focus(); // Automatically focus the input field for user convenience
    };

    const closeBirthdayModal = () => {
        birthdayModalOverlay.classList.remove('show');
        stopBirthdaySongFile(); // Stop the hardcoded song file
        clearBalloons(); // Remove all balloons when the modal is closed
        clearConfetti(); // Clear confetti and hearts when closing
    };

    // Event listeners for the gift card button and modal close button
    if (availGiftCardBtn) {
        availGiftCardBtn.addEventListener('click', openBirthdayModal);
    }

    if (closeBirthdayModalBtn) {
        closeBirthdayModalBtn.addEventListener('click', closeBirthdayModal);
    }

    // Event listener for submitting the secret code
    if (submitCodeBtn) {
        submitCodeBtn.addEventListener('click', () => {
            if (!codeInput) {
                console.error("codeInput element is null, cannot read value.");
                codeMessage.textContent = "Error: Input field not found.";
                codeMessage.style.color = "#ff4d4d";
                return;
            }
            const enteredCode = codeInput.value.toUpperCase();

            if (enteredCode === SECRET_CODE_NYSA) {
                codeMessage.textContent = "✅ Code accepted! Preparing Nysa's surprise...";
                codeMessage.style.color = "#00ff00";

                setTimeout(() => {
                    if (codeEntry) codeEntry.style.display = 'none';
                    if (birthdayMessageContainer) birthdayMessageContainer.style.display = 'block';
                    playBirthdaySongFile(); // Play the hardcoded song file
                    createBalloons(); // Start the balloon animation
                    createConfetti(); // Start confetti animation

                    // Populate personalized birthday wish for Nysa
                    if (birthdayWishHeading) birthdayWishHeading.textContent = "Happy 20th Birthday, Nysa! 💖";
                    if (birthdayWishText) birthdayWishText.innerHTML = `
                        My dearest date twin, Nysa! 🎉<br><br>
                        Can you believe it's been 20 years since we both arrived on the 24th? It's pretty cool how we share that day, even if our months are different! Time flies when you're having a blast with an amazing friend like you!<br><br>
                        To my incredible, witty, and truly special twin, may your 20s be filled with boundless joy, exciting adventures, and all the happiness you deserve.<br><br>
                        Cheers to many more years of shared laughter, silly moments, and unforgettable memories. You're truly one in a million, and I'm so grateful to have you as my friend.<br><br>
                        Wishing you the happiest birthday ever! Keep shining bright! ✨🎂<br><br>
                        Lots of love,<br>
                        Your Date Twin!
                    `;
                }, 1500);
            } else if (enteredCode === SECRET_CODE_NEHA) {
                codeMessage.textContent = "✅ Code accepted! Here's a special message for you Neha!";
                codeMessage.style.color = "#00ff00";

                setTimeout(() => {
                    if (codeEntry) codeEntry.style.display = 'none';
                    if (birthdayMessageContainer) birthdayMessageContainer.style.display = 'block';
                    // No music for this code
                    createBalloons(); // Still show balloons
                    createConfetti(); // Still show confetti

                    // Populate a different message
                    if (birthdayWishHeading) birthdayWishHeading.textContent = "A Special Message Just for You! 🌟";
                    if (birthdayWishText) birthdayWishText.innerHTML = `
                        Dearest friend,<br><br>
                        Life is so much brighter with you in it. Thank you for your kindness, your laughter, and your unwavering support. May your days be filled with endless happiness and incredible new experiences.<br><br>
                        No matter what, remember how much you are appreciated and loved. Wishing you all the best!<br><br>
                        With much warmth,<br>
                        Mr. Popular CSE
                    `;
                }, 1500);
            } else if (enteredCode === SECRET_CODE_DIVPREET) {
                codeMessage.textContent = "✅ Code accepted! Here's a special message for my Brother!";
                codeMessage.style.color = "#00ff00";

                setTimeout(() => {
                    if (codeEntry) codeEntry.style.display = 'none';
                    if (birthdayMessageContainer) birthdayMessageContainer.style.display = 'block';
                    // No music for this code
                    createBalloons(); // Still show balloons
                    createConfetti(); // Still show confetti

                    // Populate a different message
                    if (birthdayWishHeading) birthdayWishHeading.textContent = "A Special Message Just for You Bro! 🌟";
                    if (birthdayWishText) birthdayWishText.innerHTML = `
                        Hey Brother,<br><br>
                        It's awesome having you not just as a brother, but as one of my best friends too. From all our shared laughs and crazy adventures to being there for each other through thick and thin, you truly make life better.<br><br>
                        Thanks for being you – reliable, fun, and always up for anything. Here's to many more years of good times and continuing to conquer everything together!<br><br>
                        With much warmth,<br>
                        Your Bachpan Ka Dost
                    `;
                }, 1500);
            }else if (enteredCode === SECRET_CODE_SISTER) { // New code for your sister!
                codeMessage.textContent = "✅ Code accepted! For my dear sister...";
                codeMessage.style.color = "#00ff00";

                setTimeout(() => {
                    if (codeEntry) codeEntry.style.display = 'none';
                    if (birthdayMessageContainer) birthdayMessageContainer.style.display = 'block';
                    // No music for this code
                    createBalloons(); // Still show balloons
                    createConfetti(); // Still show confetti

                    // Populate the message for your sister
                    if (birthdayWishHeading) birthdayWishHeading.textContent = "To My Amazing Sister! 💖";
                    if (birthdayWishText) birthdayWishText.innerHTML = `
                        My dearest sister,<br><br>
                        Through thick and thin, you've always been there. Thank you for being not just a sister, but a wonderful friend. May your journey ahead be filled with dreams come true, strength, and joy.<br><br>
                        I cherish our bond more than words can say. Love you always!<br><br>
                        Your Broo
                    `;
                }, 1500);
            }else if (enteredCode === SECRET_CODE_SHIVANI) { // New code for your Shivani!
                codeMessage.textContent = "✅ Code accepted! Special message for gorgeous Shivanii...";
                codeMessage.style.color = "#00ff00";

                setTimeout(() => {
                    if (codeEntry) codeEntry.style.display = 'none';
                    if (birthdayMessageContainer) birthdayMessageContainer.style.display = 'block';
                    // No music for this code
                    createBalloons(); // Still show balloons
                    createConfetti(); // Still show confetti

                    // Populate the message for your sister
                    if (birthdayWishHeading) birthdayWishHeading.textContent = "To My Amazing Shivani..";
                    if (birthdayWishText) birthdayWishText.innerHTML = `
                        Dearest Shivanii, <br><br>
                        It's truly a blessing to have you on the team. Not only do you bring brilliant insights and dedication to every task, but your guidance and warmth make our workplace feel like family. Thank you for being such an incredible person and for always being like an elder sister to me. Your support means the world! 💖<br><br>
                        Keep shining your light and inspiring me always. We're so lucky to have you! ✨😊<br><br>
                        With immense respect & affection,<br>
                        Witty Sarthak ❤️
                    `;
                }, 1500);
            }else if (enteredCode === SECRET_CODE_YAMINI) {
                codeMessage.textContent = "✅ Code accepted! A secret msg for Yaminii...";
                codeMessage.style.color = "#00ff00";

                setTimeout(() => {
                    if (codeEntry) codeEntry.style.display = 'none';
                    if (birthdayMessageContainer) birthdayMessageContainer.style.display = 'block';
                    // No music for this code
                    createBalloons(); // Start the balloon animation
                    createConfetti(); // Start confetti animation

                    // Populate the message for your Yamini
                    if (birthdayWishHeading) birthdayWishHeading.textContent = "Thank Youu, Yaminii ❤️";
                    if (birthdayWishText) birthdayWishText.innerHTML = `
                        Heyy, Fuzzy Rainy!!<br><br>
                        Thank you for being there!! it honestly means a lot. You don’t even know
                        what I went through in my personal life recently, but just talking to you makes things feel lighter.
                        Whether it’s work stress or life being a mess, somehow it all feels more manageable after
                        our chats. You might not wear a cape, but you definitely have superhero energy. Really
                        grateful to have such a coool & glamourous friend like you. 💛<br><br>
                        Your Neww Friendd<br>
                        Sarthak 😊
                    `;
                }, 1500);
                else if (enteredCode === SECRET_CODE_ABHI) { // New code for your Abhi!
                codeMessage.textContent = "✅ Code accepted! Special message for sassyy Abhilasha...";
                codeMessage.style.color = "#00ff00";

                setTimeout(() => {
                    if (codeEntry) codeEntry.style.display = 'none';
                    if (birthdayMessageContainer) birthdayMessageContainer.style.display = 'block';
                    // No music for this code
                    createBalloons(); // Still show balloons
                    createConfetti(); // Still show confetti

                    // Populate the message for your sister
                    if (birthdayWishHeading) birthdayWishHeading.textContent = "To My Lovee Abhii";
                    if (birthdayWishText) birthdayWishText.innerHTML = `
                        Sweeet Abhi, <br><br>
                        It feels so special to have met you. Even in such a short time, your presence brings so much positivity and warmth. The way you carry yourself, the kindness in your words, and the spark in your smile already make a big difference to me. 💖
                        I’m truly grateful our paths crossed, and I’m excited to see where this journey takes us. Keep being your wonderful self, you’re already inspiring me in more ways than you know. ✨😊<br><br>
                        With immense respect & affection,<br>
                        Yourr Neww Lovee ❤️
                    `;
                }, 1500);
            } else {
                codeMessage.textContent = "❌ Invalid code. Please try again.";
                codeMessage.style.color = "#ff4d4d";
            }
        });
    }
});
