// ============================================================
// MILENETE'S SHADOW HEIST
// GAME.JS — VERSÃO COMPLETA
// ============================================================

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

ctx.imageSmoothingEnabled = false;

// ------------------------------------------------------------
// TELAS
// ------------------------------------------------------------

const startScreen = document.getElementById("startScreen");
const loseScreen = document.getElementById("loseScreen");
const winScreen = document.getElementById("winScreen");

const alertText = document.getElementById("alertText");

// ------------------------------------------------------------
// ESTADO DO JOGO
// ------------------------------------------------------------

let playing = false;
let gameOver = false;
let victory = false;
let frame = 0;

// ------------------------------------------------------------
// TECLADO
// ------------------------------------------------------------

const keys = {};

window.addEventListener("keydown", function (event) {

    keys[event.code] = true;

    // Impede as setas de rolarem a página
    if (
        event.code === "ArrowUp" ||
        event.code === "ArrowDown" ||
        event.code === "ArrowLeft" ||
        event.code === "ArrowRight" ||
        event.code === "Space"
    ) {
        event.preventDefault();
    }

    if (event.code === "Escape") {
        restartGame();
    }
});

window.addEventListener("keyup", function (event) {
    keys[event.code] = false;
});

// ------------------------------------------------------------
// JOGADOR
// ------------------------------------------------------------

const player = {

    x: 70,
    y: 475,

    width: 24,
    height: 24,

    speed: 3.5,

    direction: "up",

    moving: false
};

// ------------------------------------------------------------
// SAÍDA
// ------------------------------------------------------------

const exit = {

    x: 830,
    y: 55,

    width: 40,
    height: 40
};

// ------------------------------------------------------------
// PAREDES
// ------------------------------------------------------------

const walls = [

    // Bordas

    {
        x: 0,
        y: 0,
        width: 900,
        height: 20
    },

    {
        x: 0,
        y: 540,
        width: 900,
        height: 20
    },

    {
        x: 0,
        y: 0,
        width: 20,
        height: 560
    },

    {
        x: 880,
        y: 0,
        width: 20,
        height: 560
    },

    // Parede 1

    {
        x: 150,
        y: 70,
        width: 35,
        height: 350
    },

    // Parede 2

    {
        x: 300,
        y: 20,
        width: 35,
        height: 230
    },

    {
        x: 300,
        y: 350,
        width: 35,
        height: 190
    },

    // Parede 3

    {
        x: 450,
        y: 80,
        width: 35,
        height: 350
    },

    // Parede 4

    {
        x: 600,
        y: 20,
        width: 35,
        height: 220
    },

    {
        x: 600,
        y: 350,
        width: 35,
        height: 190
    },

    // Parede 5

    {
        x: 745,
        y: 100,
        width: 35,
        height: 270
    }
];

// ------------------------------------------------------------
// ESCONDERIJOS
// ------------------------------------------------------------

const hidingSpots = [

    {
        x: 55,
        y: 350,
        width: 65,
        height: 65
    },

    {
        x: 215,
        y: 70,
        width: 60,
        height: 60
    },

    {
        x: 370,
        y: 285,
        width: 65,
        height: 65
    },

    {
        x: 520,
        y: 100,
        width: 60,
        height: 60
    },

    {
        x: 680,
        y: 400,
        width: 60,
        height: 60
    },

    {
        x: 805,
        y: 220,
        width: 55,
        height: 55
    }
];

// ------------------------------------------------------------
// SOMBRAS
// ------------------------------------------------------------

const shadows = [

    {
        x: 220,
        y: 220,
        width: 25,
        height: 25,

        startX: 220,
        startY: 220,

        range: 100,

        speedX: 1.3,
        speedY: 0
    },

    {
        x: 390,
        y: 460,
        width: 25,
        height: 25,

        startX: 390,
        startY: 460,

        range: 90,

        speedX: 0,
        speedY: -1.2
    },

    {
        x: 520,
        y: 240,
        width: 25,
        height: 25,

        startX: 520,
        startY: 240,

        range: 110,

        speedX: 1.1,
        speedY: 0
    },

    {
        x: 690,
        y: 160,
        width: 25,
        height: 25,

        startX: 690,
        startY: 160,

        range: 80,

        speedX: 0,
        speedY: 1.2
    },

    {
        x: 820,
        y: 420,
        width: 25,
        height: 25,

        startX: 820,
        startY: 420,

        range: 70,

        speedX: -1,
        speedY: 0
    }
];

// ============================================================
// COLISÃO
// ============================================================

function rectanglesCollide(a, b) {

    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}

// ------------------------------------------------------------
// VERIFICA SE O BIBBLE PODE ANDAR
// ------------------------------------------------------------

function canMove(newX, newY) {

    const testPlayer = {

        x: newX,
        y: newY,

        width: player.width,
        height: player.height
    };

    for (const wall of walls) {

        if (rectanglesCollide(testPlayer, wall)) {
            return false;
        }
    }

    return true;
}

// ============================================================
// MOVIMENTO DO JOGADOR
// ============================================================

function updatePlayer() {

    if (!playing || gameOver || victory) {
        return;
    }

    let dx = 0;
    let dy = 0;

    // CIMA
    if (keys["KeyW"] || keys["ArrowUp"]) {

        dy -= player.speed;

        player.direction = "up";
    }

    // BAIXO
    if (keys["KeyS"] || keys["ArrowDown"]) {

        dy += player.speed;

        player.direction = "down";
    }

    // ESQUERDA
    if (keys["KeyA"] || keys["ArrowLeft"]) {

        dx -= player.speed;

        player.direction = "left";
    }

    // DIREITA
    if (keys["KeyD"] || keys["ArrowRight"]) {

        dx += player.speed;

        player.direction = "right";
    }

    player.moving = dx !== 0 || dy !== 0;

    // Evita que diagonal seja mais rápida
    if (dx !== 0 && dy !== 0) {

        dx *= 0.7071;
        dy *= 0.7071;
    }

    // Movimento horizontal

    if (canMove(player.x + dx, player.y)) {

        player.x += dx;
    }

    // Movimento vertical

    if (canMove(player.x, player.y + dy)) {

        player.y += dy;
    }
}

// ============================================================
// MOVIMENTO DAS SOMBRAS
// ============================================================

function updateShadows() {

    if (!playing || gameOver || victory) {
        return;
    }

    for (const shadow of shadows) {

        shadow.x += shadow.speedX;
        shadow.y += shadow.speedY;

        if (
            Math.abs(shadow.x - shadow.startX) >
            shadow.range
        ) {
            shadow.speedX *= -1;
        }

        if (
            Math.abs(shadow.y - shadow.startY) >
            shadow.range
        ) {
            shadow.speedY *= -1;
        }
    }
}

// ============================================================
// ESCONDERIJO
// ============================================================

function isHidden() {

    const centerX =
        player.x + player.width / 2;

    const centerY =
        player.y + player.height / 2;

    for (const spot of hidingSpots) {

        if (
            centerX > spot.x &&
            centerX < spot.x + spot.width &&
            centerY > spot.y &&
            centerY < spot.y + spot.height
        ) {
            return true;
        }
    }

    return false;
}

// ============================================================
// DETECÇÃO
// ============================================================

function checkDetection() {

    if (!playing || gameOver || victory) {
        return;
    }

    if (isHidden()) {

        alertText.innerHTML =
            "● ESCONDIDO";

        alertText.style.color =
            "#53ff91";

        return;
    }

    let danger = false;

    for (const shadow of shadows) {

        const playerX =
            player.x + player.width / 2;

        const playerY =
            player.y + player.height / 2;

        const shadowX =
            shadow.x + shadow.width / 2;

        const shadowY =
            shadow.y + shadow.height / 2;

        const distance = Math.hypot(
            playerX - shadowX,
            playerY - shadowY
        );

        if (distance < 105) {
            danger = true;
        }

        if (distance < 40) {

            loseGame();

            return;
        }
    }

    if (danger) {

        alertText.innerHTML =
            "▲ ALERTA! SOMBRA PRÓXIMA!";

        alertText.style.color =
            "#ff334f";

    } else {

        alertText.innerHTML =
            "● ESCORREGANDO PELAS SOMBRAS...";

        alertText.style.color =
            "#ffd21c";
    }
}

// ============================================================
// VITÓRIA
// ============================================================

function checkVictory() {

    if (!playing || gameOver || victory) {
        return;
    }

    if (rectanglesCollide(player, exit)) {

        winGame();
    }
}

// ============================================================
// DESENHO DO CHÃO
// ============================================================

function drawFloor() {

    ctx.fillStyle = "#0c0a10";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    const tileSize = 32;

    for (
        let y = 20;
        y < 540;
        y += tileSize
    ) {

        for (
            let x = 20;
            x < 880;
            x += tileSize
        ) {

            const checker =
                ((x / tileSize) +
                (y / tileSize)) % 2;

            if (checker === 0) {

                ctx.fillStyle =
                    "#17121d";

            } else {

                ctx.fillStyle =
                    "#1b1522";
            }

            ctx.fillRect(
                x,
                y,
                tileSize,
                tileSize
            );
        }
    }

    // Linhas decorativas

    ctx.fillStyle =
        "rgba(255,23,84,0.05)";

    for (
        let x = 0;
        x < 900;
        x += 64
    ) {

        ctx.fillRect(
            x,
            20,
            2,
            520
        );
    }
}

// ============================================================
// DESENHO DAS PAREDES
// ============================================================

function drawWalls() {

    for (const wall of walls) {

        // Parede

        ctx.fillStyle =
            "#302338";

        ctx.fillRect(
            wall.x,
            wall.y,
            wall.width,
            wall.height
        );

        // Linha rosa

        ctx.fillStyle =
            "#ff1754";

        ctx.fillRect(
            wall.x,
            wall.y,
            wall.width,
            4
        );

        // Sombra

        ctx.fillStyle =
            "#140e19";

        ctx.fillRect(
            wall.x + 7,
            wall.y + 8,
            wall.width - 7,
            wall.height - 8
        );

        // Detalhes

        ctx.fillStyle =
            "#563a59";

        for (
            let y = wall.y + 14;
            y < wall.y + wall.height;
            y += 20
        ) {

            ctx.fillRect(
                wall.x + 3,
                y,
                wall.width - 8,
                3
            );
        }
    }
}

// ============================================================
// ESCONDERIJOS
// ============================================================

function drawHidingSpots() {

    for (const spot of hidingSpots) {

        ctx.fillStyle =
            "rgba(0,0,0,0.5)";

        ctx.fillRect(
            spot.x + 5,
            spot.y + 5,
            spot.width,
            spot.height
        );

        ctx.fillStyle =
            "#164638";

        ctx.fillRect(
            spot.x,
            spot.y,
            spot.width,
            spot.height
        );

        ctx.strokeStyle =
            "#42e39a";

        ctx.lineWidth = 3;

        ctx.strokeRect(
            spot.x,
            spot.y,
            spot.width,
            spot.height
        );

        ctx.fillStyle =
            "#237c5b";

        for (
            let x = spot.x + 8;
            x < spot.x + spot.width - 5;
            x += 15
        ) {

            ctx.fillRect(
                x,
                spot.y + 10,
                5,
                spot.height - 20
            );
        }

        ctx.fillStyle =
            "#8affc6";

        ctx.font =
            "14px monospace";

        ctx.fillText(
            "!",
            spot.x + spot.width / 2 - 4,
            spot.y + spot.height / 2 + 5
        );
    }
}

// ============================================================
// SAÍDA
// ============================================================

function drawExit() {

    const pulse =
        Math.sin(frame * 0.08) * 4;

    // Aura

    ctx.fillStyle =
        "rgba(255,23,84,0.15)";

    ctx.fillRect(
        exit.x - 10 - pulse / 2,
        exit.y - 10 - pulse / 2,
        exit.width + 20 + pulse,
        exit.height + 20 + pulse
    );

    // Porta

    ctx.fillStyle =
        "#ff1754";

    ctx.fillRect(
        exit.x,
        exit.y,
        exit.width,
        exit.height
    );

    // Interior

    ctx.fillStyle =
        "#210a17";

    ctx.fillRect(
        exit.x + 7,
        exit.y + 7,
        exit.width - 14,
        exit.height - 14
    );

    // Coração

    ctx.fillStyle =
        "#ffffff";

    ctx.font =
        "20px Arial";

    ctx.fillText(
        "♥",
        exit.x + 9,
        exit.y + 28
    );

    // Texto

    ctx.fillStyle =
        "#ff527e";

    ctx.font =
        "7px monospace";

    ctx.fillText(
        "FINAL",
        exit.x - 1,
        exit.y - 8
    );
}

// ============================================================
// SOMBRAS
// ============================================================

function drawShadows() {

    for (const shadow of shadows) {

        const centerX =
            shadow.x + shadow.width / 2;

        const centerY =
            shadow.y + shadow.height / 2;

        // Área de percepção

        const gradient =
            ctx.createRadialGradient(
                centerX,
                centerY,
                5,
                centerX,
                centerY,
                105
            );

        gradient.addColorStop(
            0,
            "rgba(255,23,84,0.13)"
        );

        gradient.addColorStop(
            1,
            "rgba(255,23,84,0)"
        );

        ctx.fillStyle = gradient;

        ctx.beginPath();

        ctx.arc(
            centerX,
            centerY,
            105,
            0,
            Math.PI * 2
        );

        ctx.fill();

        // Corpo

        ctx.fillStyle =
            "#050407";

        ctx.fillRect(
            shadow.x,
            shadow.y + 7,
            shadow.width,
            shadow.height - 7
        );

        // Cabeça

        ctx.fillStyle =
            "#09070b";

        ctx.fillRect(
            shadow.x + 3,
            shadow.y,
            shadow.width - 6,
            shadow.height
        );

        // Olhos

        ctx.fillStyle =
            "#ff174f";

        ctx.fillRect(
            shadow.x + 6,
            shadow.y + 8,
            4,
            4
        );

        ctx.fillRect(
            shadow.x + 16,
            shadow.y + 8,
            4,
            4
        );

        // Boca

        ctx.fillStyle =
            "#8c0d32";

        ctx.fillRect(
            shadow.x + 9,
            shadow.y + 17,
            8,
            3
        );
    }
}

// ============================================================
// BIBBLE
// ============================================================

function drawBibble() {

    const bob =
        player.moving
            ? Math.sin(frame * 0.3) * 2
            : 0;

    const x =
        Math.round(player.x);

    const y =
        Math.round(player.y + bob);

    // Sombra

    ctx.fillStyle =
        "rgba(0,0,0,0.5)";

    ctx.fillRect(
        x - 3,
        y + 21,
        30,
        7
    );

    // Asas

    ctx.fillStyle =
        "#ff9ddf";

    ctx.fillRect(
        x - 7,
        y + 7,
        8,
        12
    );

    ctx.fillRect(
        x + 23,
        y + 7,
        8,
        12
    );

    // Detalhes das asas

    ctx.fillStyle =
        "#d957ad";

    ctx.fillRect(
        x - 4,
        y + 10,
        4,
        5
    );

    ctx.fillRect(
        x + 24,
        y + 10,
        4,
        5
    );

    // Corpo

    ctx.fillStyle =
        "#c979ff";

    ctx.fillRect(
        x + 3,
        y + 4,
        18,
        20
    );

    // Barriga

    ctx.fillStyle =
        "#e8b6ff";

    ctx.fillRect(
        x + 7,
        y + 12,
        10,
        8
    );

    // Cabeça

    ctx.fillStyle =
        "#d997ff";

    ctx.fillRect(
        x + 4,
        y,
        16,
        15
    );

    // Orelhas

    ctx.fillStyle =
        "#f0a9ff";

    ctx.fillRect(
        x + 1,
        y + 1,
        5,
        7
    );

    ctx.fillRect(
        x + 18,
        y + 1,
        5,
        7
    );

    // Olhos

    ctx.fillStyle =
        "#24132e";

    ctx.fillRect(
        x + 7,
        y + 6,
        3,
        4
    );

    ctx.fillRect(
        x + 14,
        y + 6,
        3,
        4
    );

    // Brilho dos olhos

    ctx.fillStyle =
        "#ffffff";

    ctx.fillRect(
        x + 8,
        y + 6,
        1,
        1
    );

    ctx.fillRect(
        x + 15,
        y + 6,
        1,
        1
    );

    // Lacinho

    ctx.fillStyle =
        "#ff1754";

    ctx.fillRect(
        x + 8,
        y - 6,
        5,
        6
    );

    ctx.fillRect(
        x + 13,
        y - 6,
        5,
        6
    );

    ctx.fillStyle =
        "#ff638d";

    ctx.fillRect(
        x + 11,
        y - 4,
        4,
        4
    );
}

// ============================================================
// TEXTOS DO MAPA
// ============================================================

function drawMapText() {

    ctx.font =
        "8px monospace";

    ctx.fillStyle =
        "#55465b";

    ctx.fillText(
        "PALACE OF MILENETE",
        38,
        43
    );

    ctx.fillStyle =
        "#806f87";

    ctx.fillText(
        "BIBBLE'S SECRET MISSION",
        690,
        525
    );
}

// ============================================================
// DESENHAR JOGO
// ============================================================

function draw() {

    drawFloor();

    drawWalls();

    drawHidingSpots();

    drawExit();

    drawShadows();

    drawBibble();

    drawMapText();
}

// ============================================================
// COMEÇAR
// ============================================================

function startGame() {

    startScreen.classList.remove("active");

    loseScreen.classList.remove("active");

    winScreen.classList.remove("active");

    playing = true;

    gameOver = false;

    victory = false;

    resetPlayer();

    // Limpa qualquer tecla que tenha ficado presa

    for (const key in keys) {
        keys[key] = false;
    }
}

// ============================================================
// RESET DO JOGADOR
// ============================================================

function resetPlayer() {

    player.x = 70;
    player.y = 475;

    player.direction = "up";

    player.moving = false;
}

// ============================================================
// DERROTA
// ============================================================

function loseGame() {

    if (gameOver || victory) {
        return;
    }

    gameOver = true;

    playing = false;

    loseScreen.classList.add("active");
}

// ============================================================
// VITÓRIA
// ============================================================

function winGame() {

    if (gameOver || victory) {
        return;
    }

    victory = true;

    playing = false;

    winScreen.classList.add("active");
}

// ============================================================
// RECOMEÇAR
// ============================================================

function restartGame() {

    startScreen.classList.remove("active");

    loseScreen.classList.remove("active");

    winScreen.classList.remove("active");

    gameOver = false;

    victory = false;

    playing = true;

    resetPlayer();

    for (const key in keys) {
        keys[key] = false;
    }
}

// ============================================================
// LOOP PRINCIPAL
// ============================================================

function gameLoop() {

    frame++;

    updatePlayer();

    updateShadows();

    checkDetection();

    checkVictory();

    draw();

    requestAnimationFrame(gameLoop);
}

// ============================================================
// INICIAR
// ============================================================

draw();

gameLoop();
