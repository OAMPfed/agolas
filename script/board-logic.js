//GLOBAL VARIABLES
let diceRolls = 0;

//PLAYER INFORMATION
const player = {
    house: '',
    img: '',
    words: '',
    region: '',
    steps: 0,
    lastRoll: '',
};
const computer = {
    house: '',
    img: '',
    words: '',
    region: '',
    steps: 0,
    lastRoll: '',
};

//This function renders the board. It takes two arguments, the amount of rows and amount of tiles.
function renderBoard(rows, tiles) {
    const board = document.getElementById('game');
    let tile_id = 1;
    for (let i = 1; i <= rows; i++) {
        const id = "row_" + i;
        const row = `<div class="row-${i % 2 == 0 ? "even" : "odd"}" id="${id}"></div>`;
        board.innerHTML += row;
        for (let j = 1; j <= tiles; j++) {
            const board_row = document.getElementById(id);
            const tile = `<div class="tile-${(i + j) % 2 == 0 ? "light" : "dark"}" id="tile_${tile_id}"><p>${tile_id}</p><div class="pieces-wrapper-flex"><div id="player_piece_wrapper_${tile_id}"></div><div id="computer_piece_wrapper_${tile_id}"></div><div></div>`;
            board_row.innerHTML += tile;
            tile_id++;
        }
    }
}
renderBoard(6, 5);

//This function fetches the data from Anapioficeandfire using a parameter.
function fetchApiData(param) {
    const houses = [
        7/*Arryn*/,
        16/*Baratheon*/,
        34/*Bolton*/,
        169/*Greyjoy*/,
        229/*Lannister*/,
        285/*Martell*/,
        362/*Stark*/,
        378/*Targaryen*/,
        395/*Tully*/,
        398/*Tyrell*/]

    fetch('https://www.anapioficeandfire.com/api/houses/' + houses[param])
        .then(response => {
            return response.json()
        })
        .then(data => {
            player.house = data.name;
            player.img = './img/shield_' + param + '.png';
            player.words = data.words === "" ? "Ours is The Fury" : data.words;
            player.region = data.region;
            initGame();
        })
        .catch(err => {
            alert('API is currently unavailable');
        })
    fetch('https://www.anapioficeandfire.com/api/houses/' + houses[Math.round(param % 2 + 3)])
        .then(response => {
            return response.json()
        })
        .then(data => {
            computer.house = data.name;
            computer.img = './img/shield_' + Math.round(param % 2 + 3) + '.png';
            computer.words = data.words;
            computer.region = data.region;
            initGame();
        })
        .catch(err => {
            alert('API is currently unavailable');
        })
};

//This function manipulates the DOM to render 10 options for the player to pick.
//The two functions below (renderHouseInfo + deleteHouseInfo) manipulates the DOM to show
//house name and house words.
function prepareGame() {
    const infoWrapper = document.getElementById("info-wrapper");
    infoWrapper.innerHTML = "";
    infoWrapper.innerHTML += `<p class="choose-house-title">The fight for the Iron Throne has begun. Do you have what it takes to navigate the horrors and politics of The Known World? It is time to swear your allegiance, Champion!</p>`;
    infoWrapper.innerHTML += `<div class="houses-choices" id="houses-wrapper"></div>`;
    for (let i = 0; i <= 9; i++) {
        const houseChoices = `<div class="tile-house" id="house_${i}" onclick="fetchApiData(${i})" onmouseover="renderHouseInfo(${i})" onmouseout="deleteHouseInfo()"><img class="house-choice-shield" src="../img/shield_${i}.png" alt="Logo of House"></img></div>`
        document.getElementById('houses-wrapper').innerHTML += houseChoices;
    }
    infoWrapper.innerHTML += `<div id="house-flavour-text"></div>`;
};
function renderHouseInfo(param) {
    const houseName = [
        "House Arryn of the Eyrie",
        "House Baratheon of King's Landing",
        "House Bolton of The Dreadfort",
        "House Greyjoy of Pyke",
        "House Lannister of Casterly Rock",
        "House Nymeros Martell of Sunspear",
        "House Stark of Winterfell",
        "House Targaryen of King's Landing",
        "House Tully of Riverrun",
        "House Tyrell of Highgarden"
    ];
    const houseWords = [
        "As High as Honor",
        "Ours is the Fury",
        "Our Blades are Sharp",
        "We Do Not Sow",
        "Hear Me Roar!",
        "Unbowed, Unbent, Unbroken",
        "Winter is Coming",
        "Fire and Blood",
        "Family, Duty, Honor",
        "Growing Strong"
    ];
    const flavourTextWrapper = document.getElementById("house-flavour-text");
    flavourTextWrapper.innerHTML += `<p class="house-name">${houseName[param]}</p>`;
    flavourTextWrapper.innerHTML += `<p class="house-words">"${houseWords[param]}"</p>`;
};

function deleteHouseInfo() {
    const flavourTextWrapper = document.getElementById("house-flavour-text");
    flavourTextWrapper.innerHTML = "";
};

function initGame() {
    const infoWrapper = document.getElementById("info-wrapper");
    infoWrapper.innerHTML = "";
    const playerWrapper =
        `<div class="player-wrapper">
        <div class="player-information">
            <div class="player-house-img-wrapper">
                <img class="player-house-img" src="${player.img}" alt="The weaponshield of the player's house"></img>
            </div>
            <p class="player-information-p">${player.house}</p>
            <p class="player-information-p">Region: <span  class="player-information-p-content">${player.region}</span></p>
            <p class="player-information-p">House Words: <span  class="player-information-p-content">"${player.words}"</span></p>
            <p class="player-information-p">Current Position: <span id="player-steps" class="player-information-p-content">${player.steps}</span></p>
            <p class="player-information-p">Last roll: <span id="player-lastRoll" class="player-information-p-content"> - </span></p>
        </div>
        <div class="player-information">
            <div class="player-house-img-wrapper">
                <img class="player-house-img" src="${computer.img}" alt="The weaponshield of the computer's house"></img>
            </div>
            <p class="player-information-p">${computer.house}</p>
            <p class="player-information-p">Region: <span class="player-information-p-content">${computer.region}</span></p>
            <p class="player-information-p">House Words: <span class="player-information-p-content">"${computer.words}"</span></p>
            <p class="player-information-p">Current Position: <span id="computer-steps" class="player-information-p-content">${computer.steps}</span></p>
            <p class="player-information-p">Last Roll: <span id="computer-lastRoll" class="player-information-p-content"> - </span></p>
        </div>
    </div>`;
    const diceButton = `<button id="dice" onclick="playGame()">ROLL PLAYER</button>`
    infoWrapper.innerHTML = playerWrapper;
    infoWrapper.innerHTML += diceButton;
    player.steps = 1;
    computer.steps = 1;
    renderPieces();
};

function playGame() {
    const trapText = [
        "You encounter the Brotherhood Without Banners. You defeat them but your most trusted advisor is killed by bow and arrow.",
        "An opposing vassal has successfully courted a lady from an allied House your House was expected to court and strengthen your alliance with.",
        "A rebellion amongst lower House Lords in your region has risen up.",
        "Your region has been ravaged by bands of mercenaries paid for by an opposing House to loot and plunder.",
        "You face an opposing House in open battle. You win, but take strong casualties.",
        "House secrets have been learnt by spies. You pay the Master of Spies to have these silenced.",
        "An incestuous relationship between brother and sister has been discovered in your House. Your House loses face amongst the lords.",
        "Winter has come and your region has become a frozen tundra. You struggle to feed your armies.",
        "The Night King has tainted your lands and turned your citizens. You retreat to deal with the undead.",
        "An important caravan of supplies has been attacked and raided.",
        "You encounter a hostile Dothraki war-party lead by a rogue Khal.",
        "An important ally House has been promised great amounts of coin and renown to turn against you.",
        "Your map navigator has been lying about his ability to navigate The Known World. You have become lost.",
        "Pirates have plundered your cargo ships filled with riches.",
        "An important Lord to your House has been assassinated by a faceless shadow.",
        "A faceless man attempts to assassinate you. He mistakenly took the identity of a desertor you planned to execute.",
        "A careless lower Lord of your House has been kidnapped. You are forced to negotiate his release to save face."
    ];
    const playerCurrentSteps = document.getElementById('player-steps');
    const computerCurrentSteps = document.getElementById('computer-steps');
    let penaltySteps = 0;
    let trapPenalty = Math.floor(Math.random() * 5) + 1;
    let savedDiceRoll = diceRoll();
    const loseModal = `<div id="lose-modal-wrapper" class="win-modal-wrapper-class"><div id="lose-modal" class="win-modal-class"><img src="${computer.img}" alt="The shield of the computer's House"></img><p>The Iron Throne was within your reach, but now it belongs to your opponent, ${computer.house}. Beg for mercy. </p><a href="https://www.oamp.dev/game.html"> PLAY AGAIN </a></div></div>`
    const winModal = `<div id="win-modal-wrapper" class="win-modal-wrapper-class"><div id="win-modal" class="win-modal-class"><img src="${player.img}" alt="The shield of the player's House"></img><p>The Iron Throne is yours. You have successfully championed your house, ${player.house}. Now begins your reign. </p><a href="https://www.oamp.dev/game.html"> PLAY AGAIN </a></div></div>`
    const trapModal = `<div id="trap-modal-wrapper"><div id="trap-modal"><p>${trapText[Math.floor(Math.random() * 16)]} Move back ${trapPenalty} tiles.</p><button id="trap-modal-button" onClick="deleteTrapModal();"> OK </button></div></div>`
    if (diceRolls % 2 === 0) {
        if (computer.steps + savedDiceRoll === 30) {
            computer.steps = computer.steps + savedDiceRoll;
            computerCurrentSteps.innerHTML = computer.steps;
            renderPieces();
            document.body.innerHTML += loseModal;
        } else if (computer.steps + savedDiceRoll > 30) {
            penaltySteps = computer.steps + savedDiceRoll - 30;
            computer.steps = 30 - penaltySteps;
            computerCurrentSteps.innerHTML = computer.steps;
            renderPieces();
        } else {
            computer.steps = computer.steps + savedDiceRoll;
            computerCurrentSteps.innerHTML = computer.steps;
            renderPieces();
            if (Math.floor(Math.random() * 10000) < 1666) {
                document.body.innerHTML += trapModal;
                computer.steps = computer.steps - trapPenalty;
                computerCurrentSteps.innerHTML = computer.steps;
                if (computer.steps <= 0) {
                    computer.steps = 1;
                    computerCurrentSteps.innerHTML = computer.steps;
                    renderPieces();
                } else {
                    renderPieces();
                }
            }
        }
    } else {
        if (player.steps + savedDiceRoll === 30) {
            player.steps = player.steps + savedDiceRoll;
            playerCurrentSteps.innerHTML = player.steps;
            renderPieces();
            document.body.innerHTML += winModal;
        } else if (player.steps + savedDiceRoll > 30) {
            penaltySteps = player.steps + savedDiceRoll - 30;
            player.steps = 30 - penaltySteps;
            playerCurrentSteps.innerHTML = player.steps;
            renderPieces();
        } else {
            player.steps = player.steps + savedDiceRoll;
            playerCurrentSteps.innerHTML = player.steps;
            renderPieces();
            if (Math.floor(Math.random() * 10000) < 1666) {
                document.body.innerHTML += trapModal;
                player.steps = player.steps - trapPenalty;
                playerCurrentSteps.innerHTML = player.steps;
                if (player.steps <= 0) {
                    player.steps = 1;
                    playerCurrentSteps.innerHTML = player.steps;
                    renderPieces();
                } else {
                    renderPieces();
                }
            }
        }
    }
};

//This function returns a dice roll and DOM manipulates the dice button as well as last roll text.
function diceRoll() {
    const dice = document.getElementById('dice');
    const diceRoll = Math.floor(Math.random() * 6 + 1);
    const playerLastRoll = document.getElementById('player-lastRoll');
    const computerLastRoll = document.getElementById('computer-lastRoll');
    let result = diceRoll === 6 ? diceRoll + Math.floor(Math.random() * 6 + 1) : diceRoll;
    if (diceRolls % 2 === 0) {
        dice.innerHTML = 'ROLL OPPONENT';
        if (result > 6) {
            playerLastRoll.innerHTML = `6 + ${result - 6}`;
        } else {
            playerLastRoll.innerHTML = `${result}`
        }
    } else {
        dice.innerHTML = 'ROLL PLAYER'
        if (result > 6) {
            computerLastRoll.innerHTML = `6 + ${result - 6}`;
        } else {
            computerLastRoll.innerHTML = `${result}`
        }
    }
    diceRolls++;
    return result;
};

//This function renders the player and computer pieces on the board.
function renderPieces() {
    const playerPiecesWrapper = document.getElementById(`player_piece_wrapper_${player.steps}`);
    const computerPiecesWrapper = document.getElementById(`computer_piece_wrapper_${computer.steps}`);
    const playerPiece = `<img id="player-board-piece" src="${player.img}" alt="The player's board piece"></img>`;
    const computerPiece = `<img id="computer-board-piece" src="${computer.img}" alt="The computer's board piece"></img>`;
    const playerPieceID = document.getElementById('player-board-piece');
    const computerPieceID = document.getElementById('computer-board-piece');
    if (playerPieceID) {
        playerPieceID.remove();
        computerPieceID.remove();
        playerPiecesWrapper.innerHTML = playerPiece;
        computerPiecesWrapper.innerHTML = computerPiece;
    } else {
        playerPiecesWrapper.innerHTML = playerPiece;
        computerPiecesWrapper.innerHTML = computerPiece;
    }
};

function deleteTrapModal() {
    const modal = document.getElementById('trap-modal-wrapper');
    modal.remove();
}