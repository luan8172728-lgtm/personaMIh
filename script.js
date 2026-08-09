const $ = (element) =>
    document.querySelector(element);


/* ========================= */
/* TELAS */
/* ========================= */

const titleScreen =
    $("#title-screen");

const gameScreen =
    $("#game-screen");

const endingScreen =
    $("#ending-screen");

const messageScreen =
    $("#message-screen");


/* ========================= */
/* ELEMENTOS */
/* ========================= */

const player =
    $("#player");

const dialogue =
    $("#dialogue");

const dialogueName =
    $("#dialogue-name");

const dialogueText =
    $("#dialogue-text");

const dialogueNext =
    $("#dialogue-next");

const battle =
    $("#battle");

const enemyName =
    $("#enemy-name");

const enemyHP =
    $("#enemy-hp");

const battleLog =
    $("#battle-log");

const treasure =
    $("#treasure");

const heartCounter =
    $("#heart-count");


/* ========================= */
/* VARIÁVEIS */
/* ========================= */

let playerX = 50;

let playerY = 70;

let hearts = 0;

let collectedHearts =
    new Set();

let locked = false;

let battleActive = false;

let encounterCooldown = false;


/* ========================= */
/* INTRODUÇÃO */
/* ========================= */

const intro = [

    [
        "NARRADOR",

        "Milenete possui um tesouro escondido no coração do seu Palace."
    ],

    [
        "VOCÊ",

        "E eu vou roubá-lo."
    ],

    [
        "NARRADOR",

        "Uma missão perigosa. Uma distância enorme. Um único objetivo."
    ],

    [
        "VOCÊ",

        "Roubar o coração dela. 😎"
    ],

    [
        "MISTÉRIO",

        "Então avance, ladrão de corações..."
    ]

];


let dialogueIndex = 0;


/* ========================= */
/* TROCAR TELA */
/* ========================= */

function showScreen(screen) {

    titleScreen
        .classList
        .remove("active");

    gameScreen
        .classList
        .remove("active");

    endingScreen
        .classList
        .remove("active");

    messageScreen
        .classList
        .remove("active");


    screen
        .classList
        .add("active");

}


/* ========================= */
/* COMEÇAR JOGO */
/* ========================= */

function startGame() {

    showScreen(gameScreen);


    playerX = 50;

    playerY = 70;

    hearts = 0;

    collectedHearts.clear();


    heartCounter.textContent =
        "0";


    document
        .querySelectorAll(".pickup")
        .forEach((heart) => {

            heart.style.display =
                "flex";

        });


    treasure.style.display =
        "none";


    player.style.left =
        playerX + "%";

    player.style.top =
        playerY + "%";


    locked = true;

    dialogueIndex = 0;


    dialogue
        .classList
        .remove("hidden");


    dialogueName.textContent =
        intro[0][0];

    dialogueText.textContent =
        intro[0][1];

}


/* ========================= */
/* DIÁLOGOS */
/* ========================= */

function nextDialogue() {

    dialogueIndex++;


    if (
        dialogueIndex >=
        intro.length
    ) {

        dialogue
            .classList
            .add("hidden");

        locked = false;

        dialogueNext.onclick =
            nextDialogue;

        return;

    }


    dialogueName.textContent =
        intro[dialogueIndex][0];

    dialogueText.textContent =
        intro[dialogueIndex][1];

}


dialogueNext.onclick =
    nextDialogue;


/* ========================= */
/* MOVIMENTO */
/* ========================= */

function move(dx, dy) {

    if (
        locked ||
        battleActive
    ) {

        return;

    }


    playerX += dx;

    playerY += dy;


    playerX =
        Math.max(
            4,
            Math.min(
                96,
                playerX
            )
        );


    playerY =
        Math.max(
            10,
            Math.min(
                92,
                playerY
            )
        );


    player.style.left =
        playerX + "%";

    player.style.top =
        playerY + "%";


    checkHeartPickups();

    checkTreasure();

    randomEncounter();

}


/* ========================= */
/* PEGAR CORAÇÕES */
/* ========================= */

function checkHeartPickups() {

    document
        .querySelectorAll(".pickup")
        .forEach((heart) => {

            const id =
                heart.dataset.heart;


            if (
                collectedHearts
                    .has(id)
            ) {

                return;

            }


            const heartX =
                parseFloat(
                    heart.style.left
                );


            const heartY =
                parseFloat(
                    heart.style.top
                );


            const distance =
                Math.hypot(
                    playerX - heartX,
                    playerY - heartY
                );


            if (
                distance < 6.5
            ) {

                collectedHearts
                    .add(id);


                heart.style.display =
                    "none";


                hearts++;


                heartCounter.textContent =
                    hearts;


                if (hearts === 1) {

                    miniDialogue(
                        "VOCÊ",
                        "Um pedacinho do coração dela... ❤️"
                    );

                }


                else if (hearts === 2) {

                    miniDialogue(
                        "VOCÊ",
                        "Estou chegando, Milenete..."
                    );

                }


                else if (hearts === 3) {

                    miniDialogue(
                        "VOCÊ",
                        "A distância não vai me parar!"
                    );

                }


                else if (hearts === 4) {

                    miniDialogue(
                        "MISTÉRIO",
                        "O tesouro está muito próximo..."
                    );

                }


                else if (hearts === 5) {

                    treasure.style.display =
                        "flex";


                    miniDialogue(
                        "MISTÉRIO",
                        "Todos os corações foram encontrados. O tesouro apareceu."
                    );

                }

            }

        });

}


/* ========================= */
/* DIÁLOGO PEQUENO */
/* ========================= */

function miniDialogue(
    name,
    text
) {

    locked = true;


    dialogue
        .classList
        .remove("hidden");


    dialogueName.textContent =
        name;


    dialogueText.textContent =
        text;


    dialogueNext.onclick =
        function () {

            dialogue
                .classList
                .add("hidden");


            locked = false;


            dialogueNext.onclick =
                nextDialogue;

        };

}


/* ========================= */
/* ENCONTROS ALEATÓRIOS */
/* ========================= */

function randomEncounter() {

    if (
        encounterCooldown
    ) {

        return;

    }


    if (
        Math.random() > 0.018
    ) {

        return;

    }


    encounterCooldown =
        true;


    setTimeout(
        () => {

            encounterCooldown =
                false;

        },
        3000
    );


    startBattle();

}


/* ========================= */
/* COMEÇAR BATALHA */
/* ========================= */

function startBattle() {

    battleActive =
        true;


    battle
        .classList
        .remove("hidden");


    const enemies = [

        "SAUDADE",

        "DISTÂNCIA",

        "MEDO DE TE PERDER"

    ];


    const enemy =
        enemies[
            Math.floor(
                Math.random() *
                enemies.length
            )
        ];


    enemyName.textContent =
        enemy;


    enemyHP.style.width =
        "100%";


    battleLog.textContent =
        "Uma sombra apareceu!";

}


/* ========================= */
/* AÇÕES DE BATALHA */
/* ========================= */

function battleAction(
    action
) {

    if (
        !battleActive
    ) {

        return;

    }


    let currentHP =
        parseFloat(
            enemyHP.style.width
        );


    if (
        action === "attack"
    ) {

        currentHP -= 45;


        battleLog.textContent =
            "Você atacou com todo o seu amor! ♥";

    }


    else if (
        action === "love"
    ) {

        currentHP -= 65;


        battleLog.textContent =
            "AMOR CRÍTICO! A sombra não sabe lidar com isso.";

    }


    else if (
        action === "talk"
    ) {

        currentHP = 0;


        battleLog.textContent =
            "Você explicou que a distância não muda o que sente. A sombra desistiu.";

    }


    currentHP =
        Math.max(
            0,
            currentHP
        );


    enemyHP.style.width =
        currentHP + "%";


    if (
        currentHP <= 0
    ) {

        setTimeout(
            () => {

                battle
                    .classList
                    .add("hidden");


                battleActive =
                    false;

            },
            700
        );

    }

}


/* ========================= */
/* BOTÕES DE BATALHA */
/* ========================= */

document
    .querySelectorAll(
        ".battle-actions button"
    )
    .forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    battleAction(
                        button.dataset.action
                    );

                }
            );

        }
    );


/* ========================= */
/* TESOURO */
/* ========================= */

function checkTreasure() {

    if (
        hearts < 5
    ) {

        return;

    }


    if (
        treasure.style.display ===
        "none"
    ) {

        return;

    }


    const treasureX =
        93;

    const treasureY =
        88;


    const distance =
        Math.hypot(
            playerX - treasureX,
            playerY - treasureY
        );


    if (
        distance < 9
    ) {

        showEnding();

    }

}


/* ========================= */
/* FINAL */
/* ========================= */

function showEnding() {

    locked = true;

    showScreen(
        endingScreen
    );

}


/* ========================= */
/* BOTÕES */
/* ========================= */

$("#start-btn").onclick =
    startGame;


$("#reveal-btn").onclick =
    function () {

        showScreen(
            messageScreen
        );

    };


$("#restart-btn").onclick =
    startGame;


/* ========================= */
/* CONTROLES */
/* ========================= */

document.addEventListener(
    "keydown",
    function (event) {


        /* ENTER */

        if (
            event.key === "Enter" &&
            !dialogue
                .classList
                .contains("hidden")
        ) {

            dialogueNext.click();

            return;

        }


        const speed =
            event.shiftKey
                ? 3.5
                : 2.2;


        /* CIMA */

        if (
            event.key === "ArrowUp" ||
            event.key === "w" ||
            event.key === "W"
        ) {

            move(
                0,
                -speed
            );

        }


        /* BAIXO */

        if (
            event.key === "ArrowDown" ||
            event.key === "s" ||
            event.key === "S"
        ) {

            move(
                0,
                speed
            );

        }


        /* ESQUERDA */

        if (
            event.key === "ArrowLeft" ||
            event.key === "a" ||
            event.key === "A"
        ) {

            move(
                -speed,
                0
            );

        }


        /* DIREITA */

        if (
            event.key === "ArrowRight" ||
            event.key === "d" ||
            event.key === "D"
        ) {

            move(
                speed,
                0
            );

        }

    }
);
