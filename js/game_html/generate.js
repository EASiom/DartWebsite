const urlParams = new URLSearchParams(window.location.search);
const gameType = urlParams.get('game');
const players = urlParams.get('playerIDs').split(',');
const playerCount = players.length;
const shuffle = urlParams.get('shuffle');

const playerMap = new Map();
var playerNames = [];

fetch("http://localhost:8080/user/")
    .then((response) => response.json())
    .then((json) => {
        var jsonString = JSON.stringify(json);
        jsonString = jsonString.split('{')[2]
        jsonString = jsonString.split('}')[0]
        jsonString = jsonString.replace(/"/g, '')
        var players = jsonString.split(',');

        for (let i = 0; i < players.length; i++) {
            const player = players[i].split(':');
            const id = player[0];
            const name = player[1];

            playerMap.set(id, name);
        }

        playerNames = Array.from(playerMap.keys());

        setPlayerNames(playerMap);
    })
    .catch((error) => console.error(error));


function setPlayerNames(playerMap) {
    var i = 1;
    while (document.getElementById('player_' + i) != null) {
        var id = document.getElementById('player_' + (i)).textContent;
        document.getElementById('player_' + (i)).textContent = playerMap.get(id);
        document.getElementById('player_' + (i)).classList.remove("animate-pulse");
        i++;
    }
}

// Generate Buttons
function createButton(points) {
    const button = document.createElement('button');
    button.textContent = `${points}`;
    button.className = "PointsButton" + " h-pointButton w-pointButton text-5xl text-text bg-third m-2 rounded-2xl hover:bg-third-hover transition duration-300 ease-in-out disabled:bg-fourth";
    button.addEventListener('click', function() {
        updateScore(points);
    });
    document.getElementById('buttons').appendChild(button);

    if (points === 10) {
        const lineBreak = document.createElement('br');
        document.getElementById('buttons').appendChild(lineBreak);
    }
}

for (let points = 1; points <= 20; points++) {
    createButton(points);
}


// Generate player fields

const shuffledPlayers = players.slice();
shuffledPlayers.sort(() => Math.random() - 0.5);

for (let i = 0; i < playerCount; i++) {

    if (shuffle === "true") {
        var playerX = shuffledPlayers;
    }else {
        var playerX = players;
    }

    if (playerX[i].length > 11) {
        playerX[i] = playerX[i].substring(0,10) + "…";
    }

    generatePlayer(playerX[i], i + 1);
}

function generatePlayer(playerName, id) {
    const player = document.createElement('div');
    player.className = "PlayerBG" + " h-32 flex border-8 border-second border-solid box-border p-1.5 m-15/5 bg-second rounded-xl";
    player.id = "PlayerBG_" + id;

    const playerNameElement = document.createElement('p');
    playerNameElement.className = "PlayerName" + " text-6xl text-center w-80 text-text m-auto/50/auto/15 font-mono animate-pulse";
    playerNameElement.id = "player_" + id;
    playerNameElement.textContent = playerName;

    const playerPoints = document.createElement('p');
    playerPoints.className = "PlayerPoints" + " w-40 text-center text-7xl text-text m-auto/50/auto/15";
    playerPoints.id = "score_" + id;
    playerPoints.textContent = gameType;

    const lastThrow = document.createElement('div');
    lastThrow.className = "PointFieldsBG" + " w-24 h-24 bg-third rounded-full m-auto/15";

    const lastThrowText = document.createElement('p');
    lastThrowText.className = "PointFieldsText" + " text-5xl text-center font-normal text-text my-5";
    lastThrowText.id = "lastThrow_" + id;
    lastThrowText.textContent = "";

    const lastThrow2 = document.createElement('div');
    lastThrow2.className = "PointFieldsBG" + " w-24 h-24 bg-third rounded-full m-auto/15";

    const lastThrowText2 = document.createElement('p');
    lastThrowText2.className = "PointFieldsText" + " text-5xl text-center font-normal text-text my-5";
    lastThrowText2.id = "lastThrow2_" + id;
    lastThrowText2.textContent = "";

    const lastThrow3 = document.createElement('div');
    lastThrow3.className = "PointFieldsBG" + " w-24 h-24 bg-third rounded-full m-auto/15";

    const lastThrowText3 = document.createElement('p');
    lastThrowText3.className = "PointFieldsText" + " text-5xl text-center font-normal text-text my-5";
    lastThrowText3.id = "lastThrow3_" + id;
    lastThrowText3.textContent = "";

    const dartsStats = document.createElement('div');
    dartsStats.className = "DartsStatsBG" + " ml-12";

    const throws = document.createElement('p');
    throws.className = "ThrownDarts" + " h-10 text-3xl text-text m-5/10/0";
    throws.id = "throws_" + id;
    throws.textContent = "🎯: 0";

    const average = document.createElement('p');
    average.className = "AverageDarts" + " h-12 text-3xl text-text m-0/10/10/11 first-letter:text-5xl";
    average.id = "average_" + id;
    average.textContent = "⌀: 0";

    lastThrow.appendChild(lastThrowText);
    lastThrow2.appendChild(lastThrowText2);
    lastThrow3.appendChild(lastThrowText3);
    dartsStats.appendChild(throws);
    dartsStats.appendChild(average);
    player.appendChild(playerNameElement);
    player.appendChild(playerPoints);
    player.appendChild(lastThrow);
    player.appendChild(lastThrow2);
    player.appendChild(lastThrow3);
    player.appendChild(dartsStats);

    document.getElementById('players').appendChild(player);
}