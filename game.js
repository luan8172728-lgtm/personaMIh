// ======================================================
// MILENETE'S SHADOW HEIST
// ======================================================

// CANVAS
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

ctx.imageSmoothingEnabled = false;


// ======================================================
// TELAS
// ======================================================

const startScreen = document.getElementById("startScreen");
const loseScreen = document.getElementById("loseScreen");
const winScreen = document.getElementById("winScreen");

const gameContainer = document.getElementById("gameContainer");

const alertText = document.getElementById("alertText");


// ======================================================
// TECLAS
// ======================================================

const keys = {};

document.addEventListener("keydown", function (event) {

    keys[event.key.toLowerCase()] = true;

    if (
        event.key === "ArrowUp" ||
        event.key === "ArrowDown" ||
        event.key === "ArrowLeft" ||
        event.key === "ArrowRight" ||
        event.key === " "
    ) {
        event.preventDefault();
    }

    if (event.key === "Escape") {
        restartGame();
    }

});

document.addEventListener("keyup", function (event) {

    keys[event.key.toLowerCase()] = false;

});


// ======================================================
// JOGADOR — BIBBLE
// ======================================================

const player = {

    x: 70,
    y: 475,

    width: 24,
    height: 24,

    speed: 3.2,

    direction: "up",

    moving: false

};


// ======================================================
// SAÍDA
// ======================================================

const exit = {

    x: 830,
    y: 55,

    width: 40,
    height: 40

};


// ======================================================
// PAREDES
// ======================================================

const walls = [

    // bordas

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


    // parede 1

    {
        x: 150,
        y: 70,
        width: 35,
        height: 350
    },


    // parede 2

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


    // parede 3

    {
        x: 450,
        y: 80,
        width: 35,
        height: 350
    },


    // parede 4

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


    // parede 5

    {
        x: 745,
        y: 100,
        width: 35,
        height: 270
    }

];


// ======================================================
// ESCONDERIJOS
// ======================================================

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


// ======================================================
// SOMBRAS
// ======================================================

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


// ======================================================
// ESTADO
// ======================================================

let playing = false;

let gameOver = false;

let victory = false;

let frame = 0;


// ======================================================
// FUNÇÕES DE COLISÃO
// ======================================================

function rectanglesCollide(a, b) {

    return (

        a.x < b.x + b.width &&

        a.x + a.width > b.x &&

        a.y < b.y + b.height &&

        a.y + a.height > b.y

    );

}


function canMove(x, y) {

    const test = {

        x: x,

        y: y,

        width: player.width,

        height: player.height

    };


    for (const wall of walls) {

        if (rectanglesCollide(test, wall)) {

            return false;

        }

    }

    return true;

}


// ======================================================
// ESCONDER
// ======================================================

function isHidden() {

    for (const spot of hidingSpots) {

        if (

            player.x + player.width / 2 > spot.x &&

            player.x + player.width / 2 < spot.x + spot.width &&

            player.y + player.height / 2 > spot.y &&

            player.y + player.height / 2 < spot.y + spot.height

        ) {

            return true;

        }

    }

    return false;

}


// ======================================================
// MOVIMENTO
// ======================================================

function updatePlayer() {

    if (!playing || gameOver || victory) {

        return;

    }


    let dx = 0;
    let dy = 0;


    if (keys["w"] || keys["arrowup"]) {

        dy -= player.speed;

        player.direction = "up";

    }

    if (keys["s"] || keys["arrowdown"]) {

        dy += player.speed;

        player.direction = "down";

    }

    if (keys["a"] || keys["arrowleft"]) {

        dx -= player.speed;

        player.direction = "left";

    }

    if (keys["d"] || keys["arrowright"]) {

        dx += player.speed;

        player.direction = "right";

    }


    player.moving = dx !== 0 || dy !== 0;


    // movimento horizontal

    if (canMove(player.x + dx, player.y)) {

        player.x += dx;

    }


    // movimento vertical

    if (canMove(player.x, player.y + dy)) {

        player.y += dy;

    }

}


// ======================================================
// SOMBRAS
// ======================================================

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


// ======================================================
// DETECÇÃO
// ======================================================

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

        const playerCenterX =
            player.x + player.width / 2;

        const playerCenterY =
            player.y + player.height / 2;


        const shadowCenterX =
            shadow.x + shadow.width / 2;

        const shadowCenterY =
            shadow.y + shadow.height / 2;


        const distance = Math.hypot(

            playerCenterX - shadowCenterX,

            playerCenterY - shadowCenterY

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
            "▲ ALERTA! UMA SOMBRA ESTÁ PERTO!";

        alertText.style.color =
            "#ff334f";

    } else {

        alertText.innerHTML =
            "● ESCORREGANDO PELAS SOMBRAS...";

        alertText.style.color =
            "#ffd21c";

    }

}


// ======================================================
// VITÓRIA
// ======================================================

function checkVictory() {

    if (!playing || gameOver || victory) {

        return;

    }


    if (rectanglesCollide(player, exit)) {

        winGame();

    }

}


// ======================================================
// DESENHO DO MAPA
// ======================================================

function drawFloor() {

    // fundo

    ctx.fillStyle = "#0c0a10";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // ladrilhos

    const tileSize = 32;


    for (let y = 20; y < 540; y += tileSize) {

        for (let x = 20; x < 880; x += tileSize) {

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


    // detalhes vermelhos

    ctx.fillStyle =
        "rgba(255, 23, 84, 0.06)";

    for (let x = 0; x < 900; x += 64) {

        ctx.fillRect(
            x,
            0,
            2,
            560
        );

    }

}


// ======================================================
// DESENHO DAS PAREDES
// ======================================================

function drawWalls() {

    for (const wall of walls) {

        // corpo

        ctx.fillStyle =
            "#302338";

        ctx.fillRect(

            wall.x,
            wall.y,
            wall.width,
            wall.height

        );


        // topo

        ctx.fillStyle =
            "#ff1754";

        ctx.fillRect(

            wall.x,
            wall.y,
            wall.width,
            4

        );


        // sombra

        ctx.fillStyle =
            "#140e19";

        ctx.fillRect(

            wall.x + 7,
            wall.y + 8,
            wall.width - 7,
            wall.height - 8

        );


        // detalhes

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


// ======================================================
// ESCONDERIJOS
// ======================================================

function drawHidingSpots() {

    for (const spot of hidingSpots) {

        // sombra

        ctx.fillStyle =
            "rgba(0,0,0,0.5)";

        ctx.fillRect(

            spot.x + 5,
            spot.y + 5,
            spot.width,
            spot.height

        );


        // caixa

        ctx.fillStyle =
            "#164638";

        ctx.fillRect(

            spot.x,
            spot.y,
            spot.width,
            spot.height

        );


        // borda

        ctx.strokeStyle =
            "#42e39a";

        ctx.lineWidth = 3;

        ctx.strokeRect(

            spot.x,
            spot.y,
            spot.width,
            spot.height

        );


        // linhas

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


        // símbolo

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


// ======================================================
// SAÍDA
// ======================================================

function drawExit() {

    const pulse =
        Math.sin(frame * 0.08) * 4;


    // aura

    ctx.fillStyle =
        "rgba(255, 23, 84, 0.15)";

    ctx.fillRect(

        exit.x - 10 - pulse / 2,
        exit.y - 10 - pulse / 2,
        exit.width + 20 + pulse,
        exit.height + 20 + pulse

    );


    // porta

    ctx.fillStyle =
        "#ff1754";

    ctx.fillRect(

        exit.x,
        exit.y,
        exit.width,
        exit.height

    );


    ctx.fillStyle =
        "#210a17";

    ctx.fillRect(

        exit.x + 7,
        exit.y + 7,
        exit.width - 14,
        exit.height - 14

    );


    // coração

    ctx.fillStyle =
        "#ffffff";

    ctx.font =
        "20px Arial";

    ctx.fillText(
        "♥",
        exit.x + 9,
        exit.y + 28
    );


    // texto

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


// ======================================================
// SOMBRAS
// ======================================================

function drawShadows() {

    for (const shadow of shadows) {

        const centerX =
            shadow.x + shadow.width / 2;

        const centerY =
            shadow.y + shadow.height / 2;


        // área de percepção

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


        // sombra

        ctx.fillStyle =
            "#050407";

        ctx.fillRect(

            shadow.x,
            shadow.y + 7,
            shadow.width,
            shadow.height - 7

        );


        // cabeça

        ctx.fillStyle =
            "#09070b";

        ctx.fillRect(

            shadow.x + 3,
            shadow.y,
            shadow.width - 6,
            shadow.height

        );


        // olhos

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


        // boca

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


// ======================================================
// BIBBLE
// ======================================================

function drawBibble() {

    const bob =
        player.moving
            ? Math.sin(frame * 0.3) * 2
            : 0;


    const x =
        Math.round(player.x);

    const y =
        Math.round(player.y + bob);


    // sombra no chão

    ctx.fillStyle =
        "rgba(0,0,0,0.5)";

    ctx.fillRect(

        x - 3,
        y + 21,
        30,
        7

    );


    // asas

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


    // detalhes asas

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


    // corpo

    ctx.fillStyle =
        "#c979ff";

    ctx.fillRect(

        x + 3,
        y + 4,
        18,
        20

    );


    // barriga

    ctx.fillStyle =
        "#e8b6ff";

    ctx.fillRect(

        x + 7,
        y + 12,
        10,
        8

    );


    // cabeça

    ctx.fillStyle =
        "#d997ff";

    ctx.fillRect(

        x + 4,
        y,
        16,
        15

    );


    // orelhas

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


    // olhos

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


    // brilho

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


    // lacinho

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


// ======================================================
// TEXTO NO MAPA
// ======================================================

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


// ======================================================
// DESENHAR TUDO
// ======================================================

function draw() {

    drawFloor();

    drawWalls();

    drawHidingSpots();

    drawExit();

    drawShadows();

    drawBibble();

    drawMapText();

}


// ======================================================
// LOOP
// ======================================================

function gameLoop() {

    frame++;


    updatePlayer();

    updateShadows();

    checkDetection();

    checkVictory();

    draw();


    requestAnimationFrame(gameLoop);

}


// ======================================================
// INICIAR
// ======================================================

function startGame() {

    startScreen.classList.remove("active");

    loseScreen.classList.remove("active");

    winScreen.classList.remove("active");

    gameContainer.style.opacity = "1";

    playing = true;

    gameOver = false;

    victory = false;


    resetPlayer();

}


// ======================================================
// RESET
// ======================================================

function resetPlayer() {

    player.x = 70;

    player.y = 475;

    player.direction = "up";

}


// ======================================================
// DERROTA
// ======================================================

function loseGame() {

    if (gameOver || victory) {

        return;

    }


    gameOver = true;

    playing = false;


    loseScreen.classList.add("active");

}


// ======================================================
// VITÓRIA
// ======================================================

function winGame() {

    if (gameOver || victory) {

        return;

    }


    victory = true;

    playing = false;


    winScreen.classList.add("active");

}


// ======================================================
// RECOMEÇAR
// ======================================================

function restartGame() {

    startScreen.classList.remove("active");

    loseScreen.classList.remove("active");

    winScreen.classList.remove("active");


    gameOver = false;

    victory = false;

    playing = true;


    resetPlayer();

}


// ======================================================
// COMEÇA O LOOP
// ======================================================

draw();

gameLoop();
