document.addEventListener('DOMContentLoaded', () => {
    const midImage = document.getElementById('midImage');
    const heroText = document.getElementById('heroText');
    const moonLayer = document.getElementById('moonLayer');
    const cloudLayer = document.getElementById('cloudLayer');

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
        if (midImage) midImage.style.transform = "translateY(0)";
        if (heroText) heroText.style.transform = "translate(-50%, -50%)"; // Keep centered
        return;
    }

    const handleScroll = () => {
        const currentScrollY = window.scrollY;

        // Middle layer - medium speed (0.4x)
        if (midImage) {
            midImage.style.transform = `translateY(${-currentScrollY * 0.4}px)`;
        }

        // Cloud layer - slightly faster than mid (0.45x) for depth
        if (cloudLayer) {
            cloudLayer.style.transform = `translateY(${-currentScrollY * 0.45}px)`;
        }

        // Hero Text - moves at scroll speed (1.0x) to exit viewport completely by 200vh
        // Need to maintain the translate(-50%, -50%) centering + parallax Y
        if (heroText) {
            heroText.style.transform = `translate(-50%, calc(-50% - ${currentScrollY * 1.0}px))`;
        }

        // --- Moon Layer Logic ---
        if (moonLayer) {
            // 1. Visibility Control:
            // Ensure small moon only appears after the large moon has scrolled out.
            // Assuming 200vh is where content starts. Let's start fading in around 1.8 viewport heights
            // to ensure a smooth transition but distinct gap.
            const transitionStart = window.innerHeight * 1.8;
            const transitionDistance = window.innerHeight * 0.5; // Fade over half a screen

            let opacity = 0;
            if (currentScrollY > transitionStart) {
                opacity = Math.min((currentScrollY - transitionStart) / transitionDistance, 1);
            }
            moonLayer.style.opacity = opacity.toString();

            // 2. Slow Parallax (Quasi-Static):
            // The moon is absolutely positioned inside content-container (starts at 200vh).
            // To make it appear "almost immobile" relative to the viewport, we need to 
            // counter-scroll it down as the page scrolls up.
            // Formula: translation = (scrollY - startOffset) * (1 - speed)
            // If speed is 0.05 (very slow upward drift), translation factor is 0.95.

            const contentStart = window.innerHeight * 2; // 200vh
            // Only apply this effect when we are near or past the content section to avoid huge off-screen transforms
            if (currentScrollY > window.innerHeight * 1.5) {
                const speed = 0.05; // 5% of scroll speed
                const counterScroll = (currentScrollY - contentStart) * (1 - speed);
                moonLayer.style.transform = `translateY(${counterScroll}px)`;
            }
        }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Handle resize to update base offsets if needed, although the original code didn't strictly bind it, it's good practice
    window.addEventListener("resize", handleScroll, { passive: true });

    handleScroll(); // run once on init
});