const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const statusText = document.getElementById("status");

const keys = {};

document.addEventListener("keydown", (e) => {
    keys[e.key.toLowerCase()] = true;

    if (e.key === "Escape") {
        restartGame();
    }
});

document.addEventListener("keyup", (e) => {
    keys[e.key.toLowerCase()] = false;
});

const player = {
    x: 70,
    y: 430,
    size: 22,
    speed: 2.8
};

const goal = {
    x: 730,
    y: 45,
    size: 35
};

// Paredes
const walls = [
    { x: 0, y: 0, w: 800, h: 20 },
    { x: 0, y: 480, w: 800, h: 20 },
    { x: 0, y: 0, w: 20, h: 500 },
    { x: 780, y: 0, w: 20, h: 500 },

    { x: 130, y: 80, w: 30, h: 300 },
    { x: 280, y: 20, w: 30, h: 220 },
    { x: 280, y: 330, w: 30, h: 150 },

    { x: 430, y: 100, w: 30, h: 300 },
    { x: 590, y: 20, w: 30, h: 200 },
    { x: 590, y: 300, w: 30, h: 180 }
];

// Esconderijos
const hidingSpots = [
    { x: 45, y: 310, w: 55, h: 55 },
    { x: 350, y: 260, w: 55, h: 55 },
    { x: 660, y: 350, w: 55, h: 55 }
];

// Sombras
const shadows = [
    {
        x: 210,
        y: 100,
        size: 25,
        dx: 1.3,
        dy: 0,
        range: 100,
        startX: 210,
        startY: 100
    },
    {
        x: 500,
        y: 400,
        size: 25,
        dx: 0,
        dy: -1.2,
        range: 100,
        startX: 500,
        startY: 400
    },
    {
        x: 680,
        y: 180,
        size: 25,
        dx: 1.1,
        dy: 0,
        range: 80,
        startX: 680,
        startY: 180
    }
];

let gameOver = false;
let victory = false;

function rectCollision(a, b) {
    return (
        a.x < b.x + b.w &&
        a.x + a.size > b.x &&
        a.y < b.y + b.h &&
        a.y + a.size > b.y
    );
}

function canMove(newX, newY) {

    const test = {
        x: newX,
        y: newY,
        size: player.size
    };

    for (const wall of walls) {
        if (rectCollision(test, wall)) {
            return false;
        }
    }

    return true;
}

function isHidden() {

    for (const spot of hidingSpots) {

        const inside =
            player.x > spot.x &&
            player.x + player.size < spot.x + spot.w &&
            player.y > spot.y &&
            player.y + player.size < spot.y + spot.h;

        if (inside) {
            return true;
        }
    }

    return false;
}

function updatePlayer() {

    if (gameOver || victory) return;

    let dx = 0;
    let dy = 0;

    if (keys["arrowup"] || keys["w"]) dy -= player.speed;
    if (keys["arrowdown"] || keys["s"]) dy += player.speed;
    if (keys["arrowleft"] || keys["a"]) dx -= player.speed;
    if (keys["arrowright"] || keys["d"]) dx += player.speed;

    if (canMove(player.x + dx, player.y)) {
        player.x += dx;
    }

    if (canMove(player.x, player.y + dy)) {
        player.y += dy;
    }
}

function updateShadows() {

    for (const shadow of shadows) {

        shadow.x += shadow.dx;
        shadow.y += shadow.dy;

        if (
            Math.abs(shadow.x - shadow.startX) > shadow.range
        ) {
            shadow.dx *= -1;
        }

        if (
            Math.abs(shadow.y - shadow.startY) > shadow.range
        ) {
            shadow.dy *= -1;
        }
    }
}

function checkDetection() {

    if (isHidden()) {
        statusText.textContent = "🫥 ESCONDIDO";
        statusText.style.color = "#55ff88";
        return;
    }

    statusText.textContent = "⚠ CUIDADO COM AS SOMBRAS!";
    statusText.style.color = "#ffcf3f";

    for (const shadow of shadows) {

        const distance = Math.hypot(
            player.x - shadow.x,
            player.y - shadow.y
        );

        if (distance < 65) {
            loseGame();
        }
    }
}

function checkVictory() {

    const distance = Math.hypot(
        player.x - goal.x,
        player.y - goal.y
    );

    if (distance < 40) {
        winGame();
    }
}

function drawBackground() {

    ctx.fillStyle = "#0e0b15";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Piso em pixel art
    for (let x = 20; x < 780; x += 32) {
        for (let y = 20; y < 480; y += 32) {

            ctx.fillStyle =
                ((x + y) / 32) % 2 === 0
                    ? "#15111e"
                    : "#181421";

            ctx.fillRect(x, y, 32, 32);
        }
    }
}

function drawWalls() {

    for (const wall of walls) {

        ctx.fillStyle = "#281d35";
        ctx.fillRect(
            wall.x,
            wall.y,
            wall.w,
            wall.h
        );

        ctx.fillStyle = "#4a304f";

        for (
            let x = wall.x;
            x < wall.x + wall.w;
            x += 8
        ) {
            ctx.fillRect(
                x,
                wall.y,
                4,
                wall.h
            );
        }
    }
}

function drawHidingSpots() {

    for (const spot of hidingSpots) {

        ctx.fillStyle = "#123c32";
        ctx.fillRect(
            spot.x,
            spot.y,
            spot.w,
            spot.h
        );

        ctx.fillStyle = "#39d98a";
        ctx.fillRect(
            spot.x + 8,
            spot.y + 8,
            spot.w - 16,
            5
        );

        ctx.fillStyle = "#237f5d";
        ctx.fillRect(
            spot.x + 10,
            spot.y + 20,
            spot.w - 20,
            25
        );
    }
}

function drawGoal() {

    ctx.fillStyle = "#ff174f";

    ctx.fillRect(
        goal.x - 18,
        goal.y - 18,
        36,
        36
    );

    ctx.fillStyle = "#fff";

    ctx.fillRect(
        goal.x - 8,
        goal.y - 8,
        16,
        16
    );
}

function drawShadows() {

    for (const shadow of shadows) {

        // Área de percepção
        ctx.fillStyle = "rgba(255, 20, 80, 0.07)";

        ctx.beginPath();

        ctx.arc(
            shadow.x + shadow.size / 2,
            shadow.y + shadow.size / 2,
            65,
            0,
            Math.PI * 2
        );

        ctx.fill();

        // Corpo
        ctx.fillStyle = "#050509";

        ctx.fillRect(
            shadow.x,
            shadow.y,
            shadow.size,
            shadow.size
        );

        ctx.fillStyle = "#ff174f";

        ctx.fillRect(
            shadow.x + 5,
            shadow.y + 7,
            4,
            4
        );

        ctx.fillRect(
            shadow.x + 16,
            shadow.y + 7,
            4,
            4
        );
    }
}

function drawBibble() {

    // Corpo
    ctx.fillStyle = "#d99aff";

    ctx.fillRect(
        player.x,
        player.y,
        player.size,
        player.size
    );

    // Orelhinhas/asas
    ctx.fillStyle = "#ffb7ec";

    ctx.fillRect(
        player.x - 6,
        player.y + 5,
        7,
        10
    );

    ctx.fillRect(
        player.x + player.size - 1,
        player.y + 5,
        7,
        10
    );

    // Olhos
    ctx.fillStyle = "#17121f";

    ctx.fillRect(
        player.x + 5,
        player.y + 7,
        4,
        4
    );

    ctx.fillRect(
        player.x + 14,
        player.y + 7,
        4,
        4
    );

    // Laço
    ctx.fillStyle = "#ff174f";

    ctx.fillRect(
        player.x + 7,
        player.y - 5,
        8,
        5
    );
}

function draw() {

    drawBackground();
    drawWalls();
    drawHidingSpots();
    drawGoal();
    drawShadows();
    drawBibble();
}

function gameLoop() {

    updatePlayer();
    updateShadows();
    checkDetection();
    checkVictory();

    draw();

    requestAnimationFrame(gameLoop);
}

function loseGame() {

    if (gameOver) return;

    gameOver = true;

    document
        .getElementById("game-over")
        .classList.add("active");
}

function winGame() {

    if (victory) return;

    victory = true;

    document
        .getElementById("victory")
        .classList.add("active");
}

function restartGame() {

    player.x = 70;
    player.y = 430;

    gameOver = false;
    victory = false;

    document
        .getElementById("game-over")
        .classList.remove("active");

    document
        .getElementById("victory")
        .classList.remove("active");
}

gameLoop();
