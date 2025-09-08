
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
let bird = {
    x: 50,
    y: 150,
    width: 20,
    height: 20,
    gravity: 0.4,
    lift: -10,
    velocity: 0
};

let pipes = [];
let frameCount = 0;
let score = 0;
let gameState = 'start'; // 'start', 'playing', 'gameOver'

// Pipe variables
const pipeWidth = 52;
const pipeGap = 200;
const pipeFrequency = 120; // frames
const pipeHeight = 320;


function draw() {
    ctx.fillStyle = "#70c5ce";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (gameState === 'playing') {
        // Draw bird
        ctx.fillStyle = 'yellow';
        ctx.fillRect(bird.x, bird.y, bird.width, bird.height);

        // Draw pipes
        ctx.fillStyle = 'green';
        for (let i = 0; i < pipes.length; i++) {
            ctx.fillRect(pipes[i].x, 0, pipeWidth, pipes[i].topHeight);
            ctx.fillRect(pipes[i].x, canvas.height - pipes[i].bottomHeight, pipeWidth, pipes[i].bottomHeight);
        }
    }

    // Draw score
    ctx.fillStyle = '#000';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, canvas.height - 20);

    if (gameState === 'start') {
        ctx.font = '30px Arial';
        ctx.fillText('Click to Start', 50, canvas.height / 2);
    }

    if (gameState === 'gameOver') {
        ctx.font = '30px Arial';
        ctx.fillText('Game Over', 80, canvas.height / 2);
        ctx.font = '20px Arial';
        ctx.fillText('Final Score: ' + score, 85, canvas.height / 2 + 30);
        ctx.fillText('Click to Restart', 75, canvas.height / 2 + 60);
    }
}

function update() {
    if (gameState !== 'playing') {
        return;
    }

    // Bird physics
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // Collision detection with top and bottom
    if (bird.y + bird.height > canvas.height || bird.y < 0) {
        gameOver();
    }

    // Pipe generation
    if (frameCount % pipeFrequency === 0) {
        const topHeight = Math.random() * (canvas.height - pipeGap - 100) + 50;
        const bottomHeight = canvas.height - topHeight - pipeGap;
        pipes.push({ x: canvas.width, topHeight: topHeight, bottomHeight: bottomHeight });
    }

    // Move pipes and collision detection
    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].x -= 1.5;

        // Collision with pipes
        if (
            bird.x < pipes[i].x + pipeWidth &&
            bird.x + bird.width > pipes[i].x &&
            (bird.y < pipes[i].topHeight || bird.y + bird.height > canvas.height - pipes[i].bottomHeight)
        ) {
            gameOver();
        }

        // Score
        if (pipes[i].x + pipeWidth < bird.x && !pipes[i].scored) {
            score++;
            pipes[i].scored = true;
        }

        // Remove off-screen pipes
        if (pipes[i].x + pipeWidth < 0) {
            pipes.splice(i, 1);
        }
    }

    frameCount++;
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

function flap() {
    bird.velocity = bird.lift;
}

function gameOver() {
    gameState = 'gameOver';
}

function resetGame() {
    bird.y = 150;
    bird.velocity = 0;
    pipes = [];
    score = 0;
    frameCount = 0;
    gameState = 'playing';
}

canvas.addEventListener('click', () => {
    if (gameState === 'playing') {
        flap();
    } else {
        resetGame();
        gameState = 'playing';
    }
});

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        if (gameState === 'playing') {
            flap();
        } else {
            resetGame();
            gameState = 'playing';
        }
    }
});


// Start the game loop
resetGame();
gameState = 'start';
gameLoop();
