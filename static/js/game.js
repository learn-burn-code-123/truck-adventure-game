class TruckGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.score = 0;
        this.isGameOver = false;
        this.truck = {
            x: 0,
            y: 0,
            width: 80,
            height: 60,
            speed: 5
        };
        
        // Game objects
        this.stars = [];
        this.obstacles = [];
        
        // Controls
        this.leftPressed = false;
        this.rightPressed = false;
        
        this.setupGame();
        this.setupControls();
    }

    setupGame() {
        // Make canvas fill the screen width while maintaining aspect ratio
        const aspectRatio = 16/9;
        this.canvas.width = Math.min(800, window.innerWidth - 20);
        this.canvas.height = this.canvas.width / aspectRatio;
        
        // Initial truck position
        this.truck.x = this.canvas.width / 2 - this.truck.width / 2;
        this.truck.y = this.canvas.height - this.truck.height - 20;
        
        // Create initial stars and obstacles
        this.createStars();
        this.createObstacles();
    }

    setupControls() {
        // Touch controls
        document.getElementById('leftBtn').addEventListener('touchstart', () => this.leftPressed = true);
        document.getElementById('leftBtn').addEventListener('touchend', () => this.leftPressed = false);
        document.getElementById('rightBtn').addEventListener('touchstart', () => this.rightPressed = true);
        document.getElementById('rightBtn').addEventListener('touchend', () => this.rightPressed = false);
        
        // Keyboard controls (for testing)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.leftPressed = true;
            if (e.key === 'ArrowRight') this.rightPressed = true;
        });
        document.addEventListener('keyup', (e) => {
            if (e.key === 'ArrowLeft') this.leftPressed = false;
            if (e.key === 'ArrowRight') this.rightPressed = false;
        });
        
        // Menu buttons
        document.getElementById('startBtn').addEventListener('click', () => this.startGame());
        document.getElementById('playAgainBtn').addEventListener('click', () => this.resetGame());
    }

    createStars() {
        const numStars = 3;
        this.stars = [];
        for (let i = 0; i < numStars; i++) {
            this.stars.push({
                x: Math.random() * (this.canvas.width - 30),
                y: -50 - Math.random() * 200,
                width: 30,
                height: 30,
                speed: 2 + Math.random() * 2
            });
        }
    }

    createObstacles() {
        const numObstacles = 2;
        this.obstacles = [];
        for (let i = 0; i < numObstacles; i++) {
            this.obstacles.push({
                x: Math.random() * (this.canvas.width - 50),
                y: -150 - Math.random() * 200,
                width: 50,
                height: 50,
                speed: 2 + Math.random() * 2
            });
        }
    }

    drawTruck() {
        // Simple truck drawing
        this.ctx.fillStyle = '#FF4444';
        this.ctx.fillRect(this.truck.x, this.truck.y, this.truck.width, this.truck.height);
        
        // Wheels
        this.ctx.fillStyle = '#333';
        this.ctx.beginPath();
        this.ctx.arc(this.truck.x + 20, this.truck.y + this.truck.height, 10, 0, Math.PI * 2);
        this.ctx.arc(this.truck.x + this.truck.width - 20, this.truck.y + this.truck.height, 10, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Window
        this.ctx.fillStyle = '#87CEEB';
        this.ctx.fillRect(this.truck.x + 50, this.truck.y + 10, 20, 20);
    }

    drawStar(star) {
        this.ctx.fillStyle = '#FFD700';
        this.ctx.beginPath();
        const spikes = 5;
        const outerRadius = star.width / 2;
        const innerRadius = star.width / 4;
        
        for (let i = 0; i < spikes * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = (i * Math.PI) / spikes;
            const x = star.x + star.width/2 + Math.cos(angle) * radius;
            const y = star.y + star.height/2 + Math.sin(angle) * radius;
            
            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        
        this.ctx.closePath();
        this.ctx.fill();
    }

    drawObstacle(obstacle) {
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    }

    updateGame() {
        // Move truck
        if (this.leftPressed && this.truck.x > 0) {
            this.truck.x -= this.truck.speed;
        }
        if (this.rightPressed && this.truck.x < this.canvas.width - this.truck.width) {
            this.truck.x += this.truck.speed;
        }

        // Update stars
        this.stars.forEach(star => {
            star.y += star.speed;
            if (star.y > this.canvas.height) {
                star.y = -50;
                star.x = Math.random() * (this.canvas.width - star.width);
            }
            
            // Check collision with truck
            if (this.checkCollision(this.truck, star)) {
                this.score += 1;
                document.getElementById('stars').textContent = this.score;
                star.y = -50;
                star.x = Math.random() * (this.canvas.width - star.width);
                this.playStarSound();
            }
        });

        // Update obstacles
        this.obstacles.forEach(obstacle => {
            obstacle.y += obstacle.speed;
            if (obstacle.y > this.canvas.height) {
                obstacle.y = -150;
                obstacle.x = Math.random() * (this.canvas.width - obstacle.width);
            }
            
            // Check collision with truck
            if (this.checkCollision(this.truck, obstacle)) {
                this.gameOver();
            }
        });
    }

    checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }

    drawGame() {
        // Clear canvas
        this.ctx.fillStyle = '#87CEEB';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw road
        this.ctx.fillStyle = '#666';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw road lines
        this.ctx.strokeStyle = '#FFF';
        this.ctx.setLineDash([20, 20]);
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width / 2, 0);
        this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
        this.ctx.stroke();
        
        // Draw game objects
        this.stars.forEach(star => this.drawStar(star));
        this.obstacles.forEach(obstacle => this.drawObstacle(obstacle));
        this.drawTruck();
    }

    gameLoop() {
        if (!this.isGameOver) {
            this.updateGame();
            this.drawGame();
            requestAnimationFrame(() => this.gameLoop());
        }
    }

    startGame() {
        document.getElementById('menu').classList.add('hidden');
        this.resetGame();
        this.gameLoop();
    }

    resetGame() {
        this.score = 0;
        document.getElementById('stars').textContent = '0';
        this.isGameOver = false;
        document.getElementById('gameOver').classList.add('hidden');
        this.setupGame();
        this.gameLoop();  // Restart the game loop
    }

    gameOver() {
        this.isGameOver = true;
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('gameOver').classList.remove('hidden');
    }

    playStarSound() {
        // Simple star collection sound
        const audio = new AudioContext();
        const oscillator = audio.createOscillator();
        const gain = audio.createGain();
        oscillator.connect(gain);
        gain.connect(audio.destination);
        oscillator.frequency.value = 800;
        gain.gain.value = 0.1;
        oscillator.start();
        setTimeout(() => oscillator.stop(), 100);
    }
}

// Start the game when the page loads
window.addEventListener('load', () => {
    const game = new TruckGame();
});
