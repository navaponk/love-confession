const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Heart pixel map (1 represents pixel, 0 represents empty space)
const heartPixels = [
    [0, 1, 1, 0, 0, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0],
];

const LETTERS = {
    'H': [
        [1,0,1],
        [1,0,1],
        [1,1,1],
        [1,0,1],
        [1,0,1]
    ],
    'A': [
        [1,1,1],
        [1,0,1],
        [1,1,1],
        [1,0,1],
        [1,0,1]
    ],
    'P': [
        [1,1,1],
        [1,0,1],
        [1,1,1],
        [1,0,0],
        [1,0,0]
    ],
    'Y': [
        [1,0,1],
        [1,0,1],
        [0,1,0],
        [0,1,0],
        [0,1,0]
    ],
    'N': [
        [1,0,1],
        [1,1,1],
        [1,1,1],
        [1,0,1],
        [1,0,1]
    ],
    'I': [
        [1,1,1],
        [0,1,0],
        [0,1,0],
        [0,1,0],
        [1,1,1]
    ],
    'V': [
        [1,0,1],
        [1,0,1],
        [1,0,1],
        [1,0,1],
        [0,1,0]
    ],
    'E': [
        [1,1,1],
        [1,0,0],
        [1,1,1],
        [1,0,0],
        [1,1,1]
    ],
    'R': [
        [1,1,1],
        [1,0,1],
        [1,1,0],
        [1,0,1],
        [1,0,1]
    ],
    'S': [
        [1,1,1],
        [1,0,0],
        [1,1,1],
        [0,0,1],
        [1,1,1]
    ],
    'F': [
        [1,1,1],
        [1,0,0],
        [1,1,1],
        [1,0,0],
        [1,0,0]
    ],
    'L': [
        [1,0,0],
        [1,0,0],
        [1,0,0],
        [1,0,0],
        [1,1,1]
    ],
    'O': [
        [1,1,1],
        [1,0,1],
        [1,0,1],
        [1,0,1],
        [1,1,1]
    ],
    'C': [
        [1,1,1],
        [1,0,0],
        [1,0,0],
        [1,0,0],
        [1,1,1]
    ],
    'D': [
        [1,1,0],
        [1,0,1],
        [1,0,1],
        [1,0,1],
        [1,1,0]
    ],
    'U': [
        [1,0,1],
        [1,0,1],
        [1,0,1],
        [1,0,1],
        [1,1,1]
    ],
    'T': [
        [1,1,1],
        [0,1,0],
        [0,1,0],
        [0,1,0],
        [0,1,0]
    ],
    'M': [
        [1,0,1],
        [1,1,1],
        [1,1,1],
        [1,0,1],
        [1,0,1]
    ],
    'W': [
        [1,0,1],
        [1,0,1],
        [1,1,1],
        [1,1,1],
        [1,0,1]
    ],
    'B': [
        [1,1,1],
        [1,0,1],
        [1,1,0],
        [1,0,1],
        [1,1,1]
    ],
    '!': [
        [1],
        [1],
        [1],
        [0],
        [1]
    ],
    ' ': [
        [0],
        [0],
        [0],
        [0],
        [0]
    ]
};

const pixelSize = 20;
const activePixels = [];
const colors = ['#ff0000', '#ff3333', '#ff6666']; // Different shades of red

class Pixel {
    constructor(x, y, scale = 1) {
        this.x = x;
        this.y = y;
        this.alpha = 0;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.scale = scale;
    }

    draw(scale = 1, yOffset = 0) {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        
        const centerX = canvas.width/2;
        const centerY = canvas.height/2;
        const x = this.x * pixelSize + (centerX - (heartPixels[0].length * pixelSize)/2);
        const y = this.y * pixelSize + (centerY - (heartPixels.length * pixelSize)/2) + yOffset;
        
        const relX = x - centerX;
        const relY = y - centerY;
        
        const scaledX = centerX + relX * scale;
        const scaledY = centerY + relY * scale;
        
        ctx.fillRect(
            scaledX,
            scaledY,
            pixelSize * scale,
            pixelSize * scale
        );
        
        ctx.globalAlpha = 1;
    }

    fadeIn() {
        if (this.alpha < 1) {
            this.alpha += 0.1;
        }
    }
}

// Create array of possible pixel positions
const possiblePixels = [];
for (let y = 0; y < heartPixels.length; y++) {
    for (let x = 0; x < heartPixels[y].length; x++) {
        if (heartPixels[y][x] === 1) {
            possiblePixels.push([x, y]);
        }
    }
}

function addNewPixel() {
    if (possiblePixels.length > 0) {
        const randomIndex = Math.floor(Math.random() * possiblePixels.length);
        const [x, y] = possiblePixels.splice(randomIndex, 1)[0];
        activePixels.push(new Pixel(x, y));
    }
}

let isHeartFormed = false;
let scale = 1;
let time = 0;
const baseScale = 1;
const pulseSpeed = 0.05;  // Increased for more dramatic effect
const beatInterval = 60;  // Controls time between beats
const beatStrength = 0.3; // How strong the beat is

// Add these variables at the top with your other constants
let floatOffset = 0;
let glowIntensity = 0;
let glowDirection = 1;

// Add these variables at the top of your file
let colorPhase = 0;
const gradientColors = [
    { r: 255, g: 51, b: 153 },  // Pink
    { r: 255, g: 102, b: 178 }, // Rose pink
    { r: 255, g: 153, b: 204 }, // Light pink
    { r: 204, g: 102, b: 255 }, // Light purple
];

// Add at the top of your file
const heartbeatSound = new Audio('./sounds/heartbeat.mp3');
heartbeatSound.volume = 1;
heartbeatSound.loop = true;

// Add these debug logs
console.log('Sound file path:', heartbeatSound.src);
console.log('Initial mute state:', heartbeatSound.muted);
console.log('Initial volume:', heartbeatSound.volume);

// Add mute button
const muteButton = document.createElement('button');
muteButton.innerHTML = '🔊';
muteButton.style.position = 'fixed';
muteButton.style.bottom = '20px';
muteButton.style.right = '20px';
muteButton.style.zIndex = '1000';
muteButton.style.padding = '10px';
muteButton.style.background = 'rgba(255, 255, 255, 0.2)';
muteButton.style.border = 'none';
muteButton.style.borderRadius = '50%';
muteButton.style.cursor = 'pointer';
document.body.appendChild(muteButton);

let isMuted = false;
muteButton.addEventListener('click', () => {
    isMuted = !isMuted;
    muteButton.innerHTML = isMuted ? '🔇' : '🔊';
    if (isMuted) {
        heartbeatSound.pause();
    } else if (isHeartFormed) {
        heartbeatSound.play()
            .catch(err => console.log('Audio play failed:', err));
    }
});

function animate() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add multiple new pixels every frame for smoother formation
    for (let i = 0; i < 3; i++) {
        if (possiblePixels.length > 0) {
            addNewPixel();
        }
    }

    // Check if heart formation is complete
    if (possiblePixels.length === 0 && !isHeartFormed) {
        isHeartFormed = true;
    }

    // Handle heartbeat animation
    if (isHeartFormed) {
        time++;
        
        // Create double-beat effect
        if (time % beatInterval === 0 || time % beatInterval === 10) {
            scale = baseScale + beatStrength;
            // Play heartbeat sound
            if (!isMuted && heartbeatSound.paused) {  // Only start if not already playing
                heartbeatSound.play()
                    .catch(err => console.log('Audio play failed:', err));
            }
        } else {
            // Smooth return to normal size
            scale += (baseScale - scale) * pulseSpeed;
        }
    }

    // Draw and update all active pixels
    activePixels.forEach(pixel => {
        pixel.fadeIn();
        pixel.draw(scale);
    });

    requestAnimationFrame(animate);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Add these at the top of your file with other variables
let lastClickTime = 0;
const DOUBLE_CLICK_TIME = 300;

function isClickOnMainHeart(x, y) {
    const mainHeartCenterX = canvas.width / 2;
    const mainHeartCenterY = canvas.height / 2;
    
    // Calculate the actual position of the heart based on how it's drawn
    const heartLeft = mainHeartCenterX - (heartPixels[0].length * pixelSize)/2;
    const heartRight = mainHeartCenterX + (heartPixels[0].length * pixelSize)/2;
    const heartTop = mainHeartCenterY - (heartPixels.length * pixelSize)/2;
    const heartBottom = mainHeartCenterY + (heartPixels.length * pixelSize)/2;
    
    return x >= heartLeft && x <= heartRight && y >= heartTop && y <= heartBottom;
}

// Replace the existing click event listener with this one
canvas.removeEventListener('click', () => {}); // Remove any existing listener
canvas.addEventListener('click', (event) => {
    const clickX = event.clientX;
    const clickY = event.clientY;
    
    const currentTime = Date.now();
    
    if (isClickOnMainHeart(clickX, clickY)) {
        console.log('Click on main heart detected'); // Debug log
        if (currentTime - lastClickTime < DOUBLE_CLICK_TIME) {
            console.log('Double click detected - starting countdown'); // Debug log
            startCountdown();
        }
        lastClickTime = currentTime;
    } else if (!isTooCloseToMainHeart(clickX, clickY)) {
        createSmallHeart(clickX, clickY);
    }
});

// Add this at the top level of your code
let activeSmallHearts = [];

function createSmallHeart(centerX, centerY) {
    const smallHeartPixels = heartPixels.map(row => [...row]);
    const scale = 0.3;
    const smallPixelSize = pixelSize * scale;
    const smallActivePixels = [];
    let isComplete = false;
    let floatOffset = Math.random() * Math.PI * 2; // Random starting point for floating
    
    // Create array of possible positions
    const positions = [];
    for (let y = 0; y < smallHeartPixels.length; y++) {
        for (let x = 0; x < smallHeartPixels[y].length; x++) {
            if (smallHeartPixels[y][x] === 1) {
                positions.push([x, y]);
            }
        }
    }

    const heartObj = {
        pixels: smallActivePixels,
        isComplete: false,
        isExploding: false,
        particles: [],
        centerX,
        centerY,
        floatOffset,
        glowIntensity: 0,
        glowDirection: 1
    };
    
    activeSmallHearts.push(heartObj);

    function animate() {
        // Add new pixels
        for (let i = 0; i < 3 && positions.length > 0; i++) {
            const index = Math.floor(Math.random() * positions.length);
            const [x, y] = positions.splice(index, 1)[0];
            
            const pixel = {
                x: centerX + (x - smallHeartPixels[0].length/2) * smallPixelSize,
                y: centerY + (y - smallHeartPixels.length/2) * smallPixelSize,
                color: colors[Math.floor(Math.random() * colors.length)],
                alpha: 0,
                scale: scale
            };
            
            smallActivePixels.push(pixel);
        }

        // Check if heart is complete
        if (positions.length === 0 && !heartObj.isComplete) {
            heartObj.isComplete = true;
            setTimeout(() => {
                startExplosion(heartObj);
            }, 1000);
        }

        if (!heartObj.isComplete) {
            requestAnimationFrame(animate);
        }
    }

    animate();
}

function startExplosion(heartObj) {
    heartObj.isExploding = true;
    
    // Create explosion particles from the heart pixels
    heartObj.particles = heartObj.pixels.map(pixel => ({
        x: pixel.x,
        y: pixel.y,
        vx: (Math.random() - 0.5) * 20,  // Increased velocity for more dramatic effect
        vy: (Math.random() - 0.5) * 20,
        alpha: 1,
        color: pixel.color,
        size: pixelSize * 0.3,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        sparkTrail: [], // Add trail for sparkle effect
        maxTrailLength: 5
    }));
    
    // Add additional sparkle particles
    for (let i = 0; i < 20; i++) {
        heartObj.particles.push({
            x: heartObj.centerX,
            y: heartObj.centerY,
            vx: (Math.random() - 0.5) * 30,
            vy: (Math.random() - 0.5) * 30,
            alpha: 1,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: pixelSize * 0.15,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.4,
            sparkTrail: [],
            maxTrailLength: 3
        });
    }
    
    // Clear original pixels
    heartObj.pixels = [];
}

function render() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add gradients for all four corners
    const corners = [
        [0, 0],                              // Top-left
        [canvas.width, 0],                   // Top-right
        [0, canvas.height],                  // Bottom-left
        [canvas.width, canvas.height]        // Bottom-right
    ];
    
    corners.forEach(([x, y]) => {
        // Calculate transitioning colors
        const currentIndex = Math.floor(colorPhase);
        const nextIndex = (currentIndex + 1) % gradientColors.length;
        const progress = colorPhase - currentIndex;
        
        const currentColor = gradientColors[currentIndex];
        const nextColor = gradientColors[nextIndex];
        
        // Interpolate between colors
        const r = Math.floor(currentColor.r + (nextColor.r - currentColor.r) * progress);
        const g = Math.floor(currentColor.g + (nextColor.g - currentColor.g) * progress);
        const b = Math.floor(currentColor.b + (nextColor.b - currentColor.b) * progress);
        
        const gradient = ctx.createRadialGradient(
            x, y, 0,
            x, y, canvas.width * 0.45
        );
        
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.2)`);
        gradient.addColorStop(0.6, `rgba(${r}, ${g}, ${b}, 0.05)`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    });
    
    // Update the color phase
    colorPhase += 0.002; // Controls transition speed - lower is slower
    if (colorPhase >= gradientColors.length) {
        colorPhase = 0;
    }
    
    // Update floating animation
    floatOffset += 0.02;
    
    // Update glow effect
    glowIntensity += 0.02 * glowDirection;
    if (glowIntensity >= 1) {
        glowDirection = -1;
    } else if (glowIntensity <= 0) {
        glowDirection = 1;
    }
    
    // Formation logic
    for (let i = 0; i < 3; i++) {
        if (possiblePixels.length > 0) {
            addNewPixel();
        }
    }

    // Check if heart formation is complete
    if (possiblePixels.length === 0 && !isHeartFormed) {
        isHeartFormed = true;
    }

    // Handle heartbeat animation and sound
    if (isHeartFormed) {
        time++;
        if (time % beatInterval === 0 || time % beatInterval === 10) {
            scale = baseScale + beatStrength;
            // Add more detailed logging for sound playing
            if (!isMuted) {
                console.log('Attempting to play sound');
                console.log('Current time:', heartbeatSound.currentTime);
                console.log('Is muted:', isMuted);
                heartbeatSound.currentTime = 0;
                heartbeatSound.play()
                    .then(() => console.log('Sound played successfully'))
                    .catch(err => {
                        console.log('Sound play error:', err);
                        console.log('Audio state:', {
                            muted: heartbeatSound.muted,
                            volume: heartbeatSound.volume,
                            paused: heartbeatSound.paused
                        });
                    });
            }
        } else {
            scale += (baseScale - scale) * pulseSpeed;
        }
    }

    // Draw main heart with floating and glow effects
    ctx.save();
    
    // Add glow effect
    if (isHeartFormed) {
        ctx.shadowColor = '#ff3366';
        ctx.shadowBlur = 20 * glowIntensity;
    }
    
    activePixels.forEach(pixel => {
        pixel.fadeIn();
        // Add gentle floating motion
        const floatingY = Math.sin(floatOffset) * 10; // 10 pixels up and down
        pixel.draw(scale, floatingY);
    });
    
    ctx.restore();
    
    // Draw all small hearts and their explosions
    for (let i = activeSmallHearts.length - 1; i >= 0; i--) {
        const heart = activeSmallHearts[i];
        
        if (heart.isExploding) {
            // Update and draw explosion particles
            let particlesAlive = false;
            
            ctx.save();
            heart.particles.forEach(p => {
                // Update position
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.5; // gravity
                p.alpha -= 0.02;
                p.rotation += p.rotationSpeed;
                
                // Add current position to trail
                p.sparkTrail.unshift({ x: p.x, y: p.y, alpha: p.alpha });
                if (p.sparkTrail.length > p.maxTrailLength) {
                    p.sparkTrail.pop();
                }
                
                if (p.alpha > 0) {
                    particlesAlive = true;
                    
                    // Draw trail
                    p.sparkTrail.forEach((trail, index) => {
                        const trailAlpha = trail.alpha * (1 - index / p.maxTrailLength);
                        ctx.fillStyle = p.color;
                        ctx.globalAlpha = trailAlpha;
                        
                        // Draw rotating square for trail
                        ctx.save();
                        ctx.translate(trail.x + p.size/2, trail.y + p.size/2);
                        ctx.rotate(p.rotation);
                        ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
                        ctx.restore();
                    });
                    
                    // Draw main particle
                    ctx.fillStyle = p.color;
                    ctx.globalAlpha = p.alpha;
                    ctx.save();
                    ctx.translate(p.x + p.size/2, p.y + p.size/2);
                    ctx.rotate(p.rotation);
                    
                    // Add glow effect to particles
                    ctx.shadowColor = p.color;
                    ctx.shadowBlur = 10;
                    ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
                    
                    ctx.restore();
                }
            });
            ctx.restore();
            
            if (!particlesAlive) {
                activeSmallHearts.splice(i, 1);
            }
        } else {
            // Update floating and glow effects
            heart.floatOffset += 0.02;
            heart.glowIntensity += 0.02 * heart.glowDirection;
            if (heart.glowIntensity >= 1) {
                heart.glowDirection = -1;
            } else if (heart.glowIntensity <= 0) {
                heart.glowDirection = 1;
            }

            // Draw forming/formed heart with effects
            ctx.save();
            if (heart.isComplete) {
                ctx.shadowColor = '#ff3366';
                ctx.shadowBlur = 15 * heart.glowIntensity;
            }
            
            heart.pixels.forEach(pixel => {
                if (pixel.alpha < 1) pixel.alpha += 0.1;
                ctx.fillStyle = pixel.color;
                ctx.globalAlpha = pixel.alpha;
                
                // Add floating motion
                const floatingY = Math.sin(heart.floatOffset) * 5; // Smaller amplitude for small hearts
                
                ctx.fillRect(
                    pixel.x, 
                    pixel.y + floatingY, 
                    pixelSize * 0.3, 
                    pixelSize * 0.3
                );
            });
            
            ctx.restore();
        }
    }
    
    ctx.globalAlpha = 1;
    requestAnimationFrame(render);
}

// Start the render loop
render();

// Add this function to check if a point is too close to the main heart
function isTooCloseToMainHeart(x, y) {
    // Calculate main heart center
    const mainHeartCenterX = canvas.width / 2;
    const mainHeartCenterY = canvas.height / 2;
    
    // Calculate main heart dimensions
    const mainHeartWidth = heartPixels[0].length * pixelSize;
    const mainHeartHeight = heartPixels.length * pixelSize;
    
    // Add a buffer zone (1.5 times the heart size)
    const safeDistance = Math.max(mainHeartWidth, mainHeartHeight) * 1.5;
    
    // Calculate distance from click to main heart center
    const distance = Math.sqrt(
        Math.pow(x - mainHeartCenterX, 2) + 
        Math.pow(y - mainHeartCenterY, 2)
    );
    
    return distance < safeDistance;
}

// Add these number patterns at the top
const NUMBERS = {
    '0': [
        [1, 1, 1],
        [1, 0, 1],
        [1, 0, 1],
        [1, 0, 1],
        [1, 1, 1]
    ],
    '1': [
        [0, 1, 0],
        [1, 1, 0],
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 1]
    ],
    '2': [
        [1, 1, 1],
        [0, 0, 1],
        [1, 1, 1],
        [1, 0, 0],
        [1, 1, 1]
    ],
    '3': [
        [1, 1, 1],
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 1],
        [1, 1, 1]
    ],
    '4': [
        [1, 0, 1],
        [1, 0, 1],
        [1, 1, 1],
        [0, 0, 1],
        [0, 0, 1]
    ],
    '5': [
        [1, 1, 1],
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 1],
        [1, 1, 1]
    ],
    '6': [
        [1, 1, 1],
        [1, 0, 0],
        [1, 1, 1],
        [1, 0, 1],
        [1, 1, 1]
    ],
    '7': [
        [1, 1, 1],
        [0, 0, 1],
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 0]
    ],
    '8': [
        [1, 1, 1],
        [1, 0, 1],
        [1, 1, 1],
        [1, 0, 1],
        [1, 1, 1]
    ],
    '9': [
        [1, 1, 1],
        [1, 0, 1],
        [1, 1, 1],
        [0, 0, 1],
        [1, 1, 1]
    ],
    ':': [
        [0],
        [1],
        [0],
        [1],
        [0]
    ]
};

let isCountdownActive = false;

function startCountdown() {
    if (isCountdownActive) return;
    isCountdownActive = true;
    
    // Set target date to 5 seconds from now
    const targetDate = new Date('2024-12-18T00:00:00');  // Set target date to December 18, 2024
    
    // Clear existing heart
    activePixels.length = 0;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    let currentDisplay = '';
    let pixels = [];
    
    function createTimePixels(timeString) {
        const pixelSize = 10;
        const charWidth = 4 * pixelSize;
        const totalWidth = timeString.length * charWidth;
        const startX = (canvas.width - totalWidth) / 2;
        const startY = (canvas.height - 5 * pixelSize) / 2;
        
        const newPixels = [];
        
        timeString.split('').forEach((char, i) => {
            if (NUMBERS[char]) {
                NUMBERS[char].forEach((row, y) => {
                    row.forEach((pixel, x) => {
                        if (pixel === 1) {
                            newPixels.push({
                                x: startX + i * charWidth + x * pixelSize,
                                y: startY + y * pixelSize,
                                size: pixelSize,
                                color: colors[Math.floor(Math.random() * colors.length)],
                                glowIntensity: Math.random(), // Random starting glow
                                glowDirection: Math.random() < 0.5 ? 1 : -1 // Random starting direction
                            });
                        }
                    });
                });
            }
        });
        
        return newPixels;
    }
    
    function render() {
        if (!isCountdownActive) return;
        
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add gradients for all four corners
        const corners = [
            [0, 0],                              // Top-left
            [canvas.width, 0],                   // Top-right
            [0, canvas.height],                  // Bottom-left
            [canvas.width, canvas.height]        // Bottom-right
        ];
        
        corners.forEach(([x, y]) => {
            // Calculate transitioning colors
            const currentIndex = Math.floor(colorPhase);
            const nextIndex = (currentIndex + 1) % gradientColors.length;
            const progress = colorPhase - currentIndex;
            
            const currentColor = gradientColors[currentIndex];
            const nextColor = gradientColors[nextIndex];
            
            // Interpolate between colors
            const r = Math.floor(currentColor.r + (nextColor.r - currentColor.r) * progress);
            const g = Math.floor(currentColor.g + (nextColor.g - currentColor.g) * progress);
            const b = Math.floor(currentColor.b + (nextColor.b - currentColor.b) * progress);
            
            const gradient = ctx.createRadialGradient(
                x, y, 0,
                x, y, canvas.width * 0.45
            );
            
            gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.2)`);
            gradient.addColorStop(0.6, `rgba(${r}, ${g}, ${b}, 0.05)`);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        });
        
        ctx.save();
        pixels.forEach(pixel => {
            // Update glow effect
            pixel.glowIntensity += 0.02 * pixel.glowDirection;
            if (pixel.glowIntensity >= 1) {
                pixel.glowDirection = -1;
            } else if (pixel.glowIntensity <= 0) {
                pixel.glowDirection = 1;
            }

            // Apply glow effect
            ctx.shadowColor = pixel.color;
            ctx.shadowBlur = 15 * pixel.glowIntensity;
            
            ctx.fillStyle = pixel.color;
            ctx.fillRect(pixel.x, pixel.y, pixel.size, pixel.size);
        });
        ctx.restore();
        
        requestAnimationFrame(render);
    }
    
    function update() {
        if (!isCountdownActive) return;
        
        const now = new Date();
        const diff = targetDate - now;
        
        if (diff <= 0) {
            isCountdownActive = false;
            startExplosionWithMessage();
            return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        // Format each number to be exactly 2 digits
        const formattedDays = days.toString().padStart(2, '0');
        const formattedHours = hours.toString().padStart(2, '0');
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSeconds = seconds.toString().padStart(2, '0');
        
        const timeString = `${formattedDays}:${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
        
        if (timeString !== currentDisplay) {
            currentDisplay = timeString;
            pixels = createTimePixels(timeString);
        }
    }
    
    // Start render loop
    render();
    
    // Start update interval
    const updateInterval = setInterval(() => {
        if (isCountdownActive) {
            update();
        } else {
            clearInterval(updateInterval);
        }
    }, 1000);
}

// Original Code
function startExplosionWithMessage() {
    const pixelSize = 10;
    const activePixels = [];
    const colors = ['#ff0000', '#ff3333', '#ff6666']; // Different shades of red
    let heartCount = 0;
    const totalHearts = 100;
    let colorPhase = 0; // Initialize color phase
    const gradientColors = [
        { r: 255, g: 51, b: 153 },  // Pink
        { r: 255, g: 102, b: 178 }, // Rose pink
        { r: 255, g: 153, b: 204 }, // Light pink
        { r: 204, g: 102, b: 255 }, // Light purple
    ];

    const messages = [
        ["HAPPY", "ANNIVERSARY", "FLORENCE!"], // First message
        ["AND TO OUR", "MANY MORE", "YEARS OF", "HAPPINESS", "TO COME"], // Second message
        ["I LOVE YOU", "SO MUCH!"], // Third message
        ["CANT WAIT TO", "SPEND TIME", "WITH YOU TODAY!"], // Fourth message
        ["THATS IT", "BYE BYE"] // Fifth message
    ];

    let fadeOutStarted = false; // Flag to track if fade-out has started
    let currentMessageIndex = 0; // Track the current message

    const spawnHeart = () => {
        if (heartCount >= totalHearts) {
            setTimeout(() => {
                console.log("Heart explosion complete, rendering message...");
                activePixels.length = 0;

                // Show the first message
                displayMessage(0);

                animate(); // Start animation
            }, 2000);
            return;
        }

        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * Math.min(canvas.width, canvas.height) / 2;

        createSmallHeart(
            canvas.width / 2 + Math.cos(angle) * distance,
            canvas.height / 2 + Math.sin(angle) * distance
        );

        heartCount++;
        setTimeout(spawnHeart, 50 + Math.random() * 150);
    };

    function displayMessage(index) {
        if (index >= messages.length) {
            console.log("All messages displayed.");
            addSlideshow(); // Add slideshow after messages are displayed
            return;
        }

        fadeOutStarted = false; // Reset fade-out
        activePixels.length = 0;

        const pixels = createMessagePixels(messages[index]);
        activePixels.push(...pixels);

        // Start fade-out after 10 seconds
        setTimeout(() => {
            fadeOutStarted = true;

            // Show the next message after fade-out completes
            setTimeout(() => {
                currentMessageIndex++;
                displayMessage(currentMessageIndex);
            }, 2000); // Delay for the fade-out
        }, 3000); // 3 seconds delay before fading out
    }

    function renderGradient() {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add gradients for all four corners
        const corners = [
            [0, 0],                              // Top-left
            [canvas.width, 0],                   // Top-right
            [0, canvas.height],                  // Bottom-left
            [canvas.width, canvas.height]        // Bottom-right
        ];

        corners.forEach(([x, y]) => {
            const currentIndex = Math.floor(colorPhase);
            const nextIndex = (currentIndex + 1) % gradientColors.length;
            const progress = colorPhase - currentIndex;

            const currentColor = gradientColors[currentIndex];
            const nextColor = gradientColors[nextIndex];

            const r = Math.floor(currentColor.r + (nextColor.r - currentColor.r) * progress);
            const g = Math.floor(currentColor.g + (nextColor.g - currentColor.g) * progress);
            const b = Math.floor(currentColor.b + (nextColor.b - currentColor.b) * progress);

            const gradient = ctx.createRadialGradient(
                x, y, 0,
                x, y, canvas.width * 0.45
            );

            gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.2)`);
            gradient.addColorStop(0.6, `rgba(${r}, ${g}, ${b}, 0.05)`);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        });

        // Update the color phase
        colorPhase += 0.002;
        if (colorPhase >= gradientColors.length) {
            colorPhase = 0;
        }
    }

    function createMessagePixels(lines) {
        const charWidth = 4 * pixelSize; // Width of each character block
        const charHeight = 5 * pixelSize; // Height of each character block
        const lineSpacing = charHeight + pixelSize * 2; // Add spacing between lines
    
        const totalWidth = lines.map(line => line.length * charWidth); // Width of each line
        const totalHeight = lines.length * lineSpacing; // Total height of all lines
        const startY = (canvas.height - totalHeight) / 2; // Center vertically
    
        const newPixels = [];
    
        lines.forEach((line, lineIndex) => {
            const lineWidth = line.length * charWidth; // Calculate line width
            const startX = (canvas.width - lineWidth) / 2; // Center horizontally
    
            line.split('').forEach((char, charIndex) => {
                if (LETTERS[char]) {
                    LETTERS[char].forEach((row, rowIndex) => {
                        row.forEach((pixel, colIndex) => {
                            if (pixel === 1) {
                                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                                newPixels.push({
                                    x: startX + charIndex * charWidth + colIndex * pixelSize,
                                    y: startY + lineIndex * lineSpacing + rowIndex * pixelSize,
                                    size: pixelSize,
                                    color: randomColor, // Random shade of red
                                    opacity: 0 // Initial opacity for fade-in
                                });
                            }
                        });
                    });
                }
            });
        });
    
        return newPixels;
    }

    function animate() {
        renderGradient(); // Render the gradient background

        activePixels.forEach(pixel => {
            if (fadeOutStarted) {
                // Gradually decrease opacity if fade-out has started
                pixel.opacity -= 0.02;
                if (pixel.opacity <= 0) {
                    pixel.opacity = 0; // Ensure opacity doesn't go below 0
                }
            } else if (pixel.opacity < 1) {
                pixel.opacity += 0.05; // Fade-in effect
            }

            ctx.shadowBlur = 20; // Add glow
            ctx.shadowColor = pixel.color; // Glow color matches the pixel color
            ctx.globalAlpha = pixel.opacity;
            ctx.fillStyle = pixel.color;
            ctx.fillRect(pixel.x, pixel.y, pixel.size, pixel.size);
        });

        ctx.shadowBlur = 0; // Reset shadowBlur

        ctx.globalAlpha = 1;
        requestAnimationFrame(animate);
    }

    spawnHeart();
}

// Add Slideshow Functionality
function addSlideshow() {
    const images = ['./images/IMG_5292.jpg', './images/IMG_5293.jpg', './images/IMG_5294.jpg', './images/IMG_5295.jpg', './images/IMG_5296.jpg', './images/IMG_5297.jpg', './images/IMG_5298.jpg', './images/IMG_5299.jpg', './images/IMG_5300.jpg', './images/IMG_5301.jpg'];

    let currentIndex = 0;
    const slideshowInterval = 3000; // 3 seconds

    // Create and style the slideshow container
    const slideshowContainer = document.createElement('div');
    slideshowContainer.style.width = '500px';
    slideshowContainer.style.height = '500px';
    slideshowContainer.style.position = 'fixed'; // Use fixed positioning
    slideshowContainer.style.top = '50%'; // Center vertically
    slideshowContainer.style.left = '50%'; // Center horizontally
    slideshowContainer.style.transform = 'translate(-50%, -50%)'; // Adjust for centering

    document.body.appendChild(slideshowContainer);

    // Create and append the image element
    const imgElement = document.createElement('img');
    imgElement.src = images[currentIndex];
    imgElement.style.width = '100%';
    imgElement.style.height = '100%';
    imgElement.style.objectFit = 'cover';
    imgElement.style.position = 'absolute';

    slideshowContainer.appendChild(imgElement);

    // Function to update the slideshow
    function updateSlideshow() {
        currentIndex = (currentIndex + 1) % images.length;
        imgElement.src = images[currentIndex];
    }

    // Start the slideshow
    setInterval(updateSlideshow, slideshowInterval);
}