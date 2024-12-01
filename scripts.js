/*
    Code sample for SITE 1101 Principles of Information Systems 
    (c)2024 by Araz Yusubov 
    DISCLAIMER: All code examples we will look at are quick hacks intended to present working prototypes.
    Hence they do not follow best practice of programming or software engineering.    
*/

// Global variables for Artist's position and orientation
var x, y;
var angle;

function radian(degree) {
    return degree * Math.PI / 180;
}

function moveForward(distance, context) {
    let a = radian(angle);
    x = x + distance * Math.cos(a);
    y = y + distance * Math.sin(a);
    context.lineTo(x, y);    
}

function turnRight(degree) {
    angle = angle - degree;
    if (angle < 0) angle = angle + 360;
}

function turnLeft(degree) {
    angle = angle + degree;
    if (angle > 360) angle = angle - 360;
}

function DrawSpiral(context) {
    // Inspired by Express Course (2024) Lesson 29: For Loops with Artist
    // https://studio.code.org/s/express-2024/lessons/29/levels/5

    // The initial position is in the center of the canvas
    x = context.canvas.width / 2;
    y = context.canvas.height / 2;
    // The initial orientation is zero degrees i.e. facing East
    angle = 0.0; 
    context.moveTo(x, y);
    context.beginPath();
    for (let counter = 3; counter < 600; counter += 3) {
        moveForward(counter, context);
        context.stroke();
        turnRight(89);
    }
}

function DrawAzerbaijaniFlag(context) {
    // Canvas dimensions
    const width = context.canvas.width * 0.6;
    const height = width / 2; // Standard flag ratio 2:1
    const startX = (context.canvas.width - width) / 2;
    const startY = (context.canvas.height - height) / 2;

    // Flag colors
    const colors = ['#0092BC', '#E4002B', '#00AF66'];

    // Draw the three horizontal stripes
    const stripeHeight = height / 3;
    for (let i = 0; i < 3; i++) {
        context.beginPath();
        context.fillStyle = colors[i];
        context.fillRect(startX, startY + i * stripeHeight, width, stripeHeight);
        context.closePath();
    }

    // Draw the crescent
    const outerRadius = stripeHeight * 0.4; // Size relative to red stripe
    const innerRadius = outerRadius * 0.9;
    const crescentX = startX + width * 0.5; // Horizontal position
    const crescentY = startY + stripeHeight * 1.5; // Center of red stripe
    const offsetX = -outerRadius * 0.65; // Adjusted distance for the smaller circle

    drawCrescent(context, crescentX, crescentY, outerRadius, crescentX + offsetX, crescentY, innerRadius);

    // Draw the star
    const starRadius = stripeHeight * 0.15;
    const starX = crescentX + outerRadius * 1 -20;
    const starY = crescentY;

    drawStar(context, starX, starY, starRadius, 8);
}

// Function to draw a crescent
function drawCrescent(ctx, x1, y1, r1, x2, y2, r2) {
    // Helper function to calculate intercept points
    function circleCircleIntercept(x1, y1, r1, x2, y2, r2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > r1 + r2 || dist < Math.abs(r1 - r2)) {
            return; // No intercept
        }

        const a = (dist * dist - r2 * r2 + r1 * r1) / (2 * dist);
        const h = Math.sqrt(r1 * r1 - a * a);
        const cx2 = x1 + (dx * a) / dist;
        const cy2 = y1 + (dy * a) / dist;

        const intersectX1 = cx2 + (h * dy) / dist;
        const intersectY1 = cy2 - (h * dx) / dist;
        const intersectX2 = cx2 - (h * dy) / dist;
        const intersectY2 = cy2 + (h * dx) / dist;

        return {
            x1: intersectX1,
            y1: intersectY1,
            x2: intersectX2,
            y2: intersectY2,
        };
    }

    const intercepts = circleCircleIntercept(x1, y1, r1, x2, y2, r2);
    if (!intercepts) {
        console.error("No intercept points found. Cannot create a crescent.");
        return;
    }

    const { x1: ix1, y1: iy1, x2: ix2, y2: iy2 } = intercepts;

    ctx.beginPath();
    ctx.arc(x1, y1, r1, Math.atan2(iy1 - y1, ix1 - x1), Math.atan2(iy2 - y1, ix2 - x1), false);
    ctx.arc(x2, y2, r2, Math.atan2(iy2 - y2, ix2 - x2), Math.atan2(iy1 - y2, ix1 - x2), true);
    ctx.closePath();
    ctx.fillStyle = "white";
    ctx.fill();
}

// Function to draw an 8-pointed star
function drawStar(ctx, x, y, radius, points) {
    ctx.beginPath();
    for (let i = 0; i < points * 2; i++) {
        const angle = (Math.PI * i) / points;
        const r = i % 2 === 0 ? radius : radius / 2;
        ctx.lineTo(x + r * Math.cos(angle), y - r * Math.sin(angle));
    }
    ctx.closePath();
    ctx.fillStyle = "white";
    ctx.fill();
}


document.addEventListener('DOMContentLoaded', () => {
    // Feedback form handling
    const feedbackForm = document.getElementById('feedback-form');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const feedbackText = document.getElementById('feedback').value;
            if (feedbackText.trim() === '') {
                alert('Please enter some feedback before submitting.');
                return;
            }
            document.getElementById('feedback-display').innerHTML = `<p>Thank you for your feedback: "${feedbackText}"</p>`;
            document.getElementById('feedback').value = ''; // Clear the textarea
        });
    }

    // Year in Footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
});
