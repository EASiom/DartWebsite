let maxPoints = gameType;
let totalPoints = 0;
let totalThrows = 0;
let multiplier = 1; 
let throws = new Map();
let throwList = [];
var roundThrows = [];
var currentPlayerID = -1;
var winContinue = false;
var finishedPlayers = [];
var optionsMenu = false;

document.getElementById('doubleButton').addEventListener('click', function() {
    if (multiplier === 2) {
        multiplier = changeMultiplier(1);
    } else {
        multiplier = changeMultiplier(2);
    }
});

document.getElementById('tripleButton').addEventListener('click', function() {
    if (multiplier === 3) {
        multiplier = changeMultiplier(1);
    } else {
        multiplier = changeMultiplier(3);
    }
});

for (const player of playerX) {
    throws.set(player, []);
}

function playerSystem() {
    var player = [];

    // Check if it's the first round or a new player's turn
    if (roundThrows.length === 3 || currentPlayerID === -1 || finishedPlayers.includes(currentPlayerID)) {
        currentPlayerID = (currentPlayerID === -1) ? 1 : currentPlayerID % playerCount + 1;

        player.push(playerX[currentPlayerID - 1]);
        player.push(currentPlayerID);

        // Reset throws for a new round or player
        throwList = [];
        roundThrows = [];
        highlightPlayer(currentPlayerID);
    } else {
        player.push(playerX[currentPlayerID - 1]);
        player.push(currentPlayerID);

        // Triggered on each throw (except the first throw of each player in a round)
    }

    if (finishedPlayers.includes(currentPlayerID)) {
        return playerSystem();
    }

    if (roundThrows.length === 2) {
        if (currentPlayerID === playerCount) {
            highlightPlayer(1);
        } else {
            highlightPlayer(currentPlayerID + 1);
        }
    }

    return player;
}



function changeMultiplier(multiplier) {
    if (multiplier === 1) {
        document.getElementById('doubleButton').classList.remove('toggled');
        document.getElementById('tripleButton').classList.remove('toggled');
        document.getElementById('25').disabled = false;
    } else if (multiplier === 2) {
        document.getElementById('doubleButton').classList.add('toggled');
        document.getElementById('tripleButton').classList.remove('toggled');
        document.getElementById('25').disabled = false;
    } else if (multiplier === 3) {
        document.getElementById('doubleButton').classList.remove('toggled');
        document.getElementById('tripleButton').classList.add('toggled');
        document.getElementById('25').disabled = true;
    }

    multiplier = multiplier;
    return multiplier;
}

function addThrow(player, lastThrow) {
    if (throws.get(player) === undefined) {
        throwList.push(lastThrow);
        throws.set(player, throwList);
    } else {
        throwList = throws.get(player);
        throwList.push(lastThrow);
        throws.set(player, throwList);
    }
}

highlightPlayer(1);

function highlightPlayer(playerID) {
    // TODO: Fix highlight bug when player is finished, player is getting highlighted one time in the next round
    document.getElementById(`PlayerBG_${playerID}`).classList.add('toggled');
    
    for (var i = 1; i <= playerCount; i++) {
        if (i !== playerID) {
            document.getElementById(`PlayerBG_${i}`).classList.remove('toggled');
        }
    }
}

function changeMultiplier(multiplier) {
    if (multiplier === 1) {
        document.getElementById('doubleButton').classList.remove('toggled');
        document.getElementById('tripleButton').classList.remove('toggled');
        document.getElementById('25').disabled = false;
    }else if (multiplier === 2) {
        document.getElementById('doubleButton').classList.add('toggled');
        document.getElementById('tripleButton').classList.remove('toggled');
        document.getElementById('25').disabled = false;
    }else if (multiplier === 3) {
        document.getElementById('doubleButton').classList.remove('toggled');
        document.getElementById('tripleButton').classList.add('toggled');
        document.getElementById('25').disabled = true;
    }

    multiplier = multiplier;
    return multiplier;
}


function addThrow(player, lastThrow) { 
    if (throws.get(player) === undefined) {
        throwList.push(lastThrow);
        throws.set(player, throwList);
    } else {
        throwList = throws.get(player);
        throwList.push(lastThrow);
        throws.set(player, throwList);
    }
}


function removeThrow(player) {
    if (throws.get(player) !== undefined) {
        throws.set(player, (throws.get(player).slice(0, -1)));
    }
}


function updateScore(points) {
    var textPoints;

    if (multiplier === 1) {
        textPoints = points;
    }else if (multiplier === 2) {
        textPoints = "D" + points;
    }else if (multiplier === 3) {
        textPoints = "T" + points;
    }

    points = parseThrow(textPoints);

    var playerSys = playerSystem();

    var player = playerSys[0];
    var playerID = playerSys[1];

    if (roundThrows.length === 0) {
        document.getElementById(`lastThrow_${playerID}`).textContent = "";
        document.getElementById(`lastThrow2_${playerID}`).textContent = "";
        document.getElementById(`lastThrow3_${playerID}`).textContent = "";
    }


    if (throws.get(player) !== undefined) {
        currentScore = maxPoints;
        for (const element of throws.get(player)) {
            currentScore -= parseThrow(element);
        }
    }else {
        currentScore = maxPoints;
    }

    //Check if throw is higher than current score
    if ((currentScore - points) < 0) {
        points = 0;
        
        //Calculate left throws for current round
        var i = 0;
        if (roundThrows.length === 0) {
            while (i < 3) {
                addThrow(player, points);
                roundThrows.push(points);
                i++;
            }
            document.getElementById(`lastThrow_${playerID}`).textContent = "0";
            document.getElementById(`lastThrow2_${playerID}`).textContent = "0";
            document.getElementById(`lastThrow3_${playerID}`).textContent = "0";
        }else if (roundThrows.length === 1) {
            while (i < 2) {
                addThrow(player, points);
                roundThrows.push(points);
                i++;
            }
            document.getElementById(`lastThrow2_${playerID}`).textContent = "0";
            document.getElementById(`lastThrow3_${playerID}`).textContent = "0";
        }else if (roundThrows.length === 2) {
            while (i < 1) {
                addThrow(player, points);
                roundThrows.push(points);
                i++;
            }
            document.getElementById(`lastThrow3_${playerID}`).textContent = "0";
        }

        calcAverage(player, playerID);
        multiplier = changeMultiplier(1);

        return;
    }

    addThrow(player, textPoints);

    currentScore -= points;

    multiplier = changeMultiplier(1);

    roundThrows.push(textPoints);

    //Set displays for current score
    document.getElementById(`score_${playerID}`).textContent = currentScore;

    calcAverage(player, playerID);

    //Set displays for last three throws of current round
    if (roundThrows.length === 0) {
        document.getElementById(`lastThrow_${playerID}`).textContent = "";
        document.getElementById(`lastThrow2_${playerID}`).textContent = "";
        document.getElementById(`lastThrow3_${playerID}`).textContent = "";
    }else if (roundThrows.length === 1) {
        document.getElementById(`lastThrow_${playerID}`).textContent = roundThrows[0];
    }else if (roundThrows.length === 2) {
        document.getElementById(`lastThrow_${playerID}`).textContent = roundThrows[0];
        document.getElementById(`lastThrow2_${playerID}`).textContent = roundThrows[1];
    }else if (roundThrows.length >= 3) {
        document.getElementById(`lastThrow_${playerID}`).textContent = roundThrows[0];
        document.getElementById(`lastThrow2_${playerID}`).textContent = roundThrows[1];
        document.getElementById(`lastThrow3_${playerID}`).textContent = roundThrows[2];
    }

    //Check if player won
    if (currentScore === 0) {
        gameEnd("win");
    }

    return roundThrows;
}

function parseThrow(textPoints) {
    var points;
    textPoints = textPoints.toString();
    if (textPoints.startsWith("T")) {
        points = parseInt(textPoints.slice(1)) * 3;
    } else if (textPoints.startsWith("D")) {
        points = parseInt(textPoints.slice(1)) * 2;
    } else {
        points = parseInt(textPoints);
    }
    return points;
}



function recreateThrows(player) {
    roundThrows = [];

    if (throws.get(player) === undefined) {
        return;
    }

    var reversedThrows = throws.get(player).slice();

    for (const element of reversedThrows.reverse()) {
        roundThrows.push(element);
        if (roundThrows.length === 3) {
            break;
        }
    }

    return roundThrows.reverse();
}

function calcAverage(player, playerID) {
    //Get total throws from length of array
    totalThrows = throws.get(player).length;

    //Get total points from elements of array
    totalPoints = 0;
    for (const element of throws.get(player)) {
        totalPoints += parseThrow(element);
    }

    //Calculate average and set displays
    const average = totalThrows > 0 ? (totalPoints / totalThrows).toFixed(2) : 0;
    document.getElementById(`average_${playerID}`).textContent = `⌀: ${average}`;
    document.getElementById(`throws_${playerID}`).textContent = `🎯: ${totalThrows}`;
}

function backButton() {
    var player = buildPlayerByID(currentPlayerID);
    var playerID = currentPlayerID;

    if (throws.get(player) === undefined) {
        return;
    }

    // TODO: Fix back button bug when player is finished

    var emptyThrows = 0;

    for (const player of throws.keys()) {
        if (throws.get(player).length <= 0) {
            emptyThrows += 1; 
        }

        if (emptyThrows === playerCount) {
            return;
        }
    }

    if (throws.get(player).length === 3) {
        highlightPlayer(currentPlayerID);
    }



    if (roundThrows.length === 0) {
        currentPlayerID -= 1;

        if (currentPlayerID === 0) {
            currentPlayerID = playerCount;
        }

        player = buildPlayerByID(currentPlayerID);
        playerID = currentPlayerID;

        highlightPlayer(currentPlayerID);

        roundThrows = recreateThrows(player);
    }

    removeThrow(player);

    calcAverage(player, playerID);

    if (throws.get(player) !== undefined) {
        currentScore = maxPoints;
        for (const element of throws.get(player)) {
            currentScore -= parseThrow(element);
        }
    }else {
        currentScore = maxPoints;
    }

    //Set displays for current score
    document.getElementById(`score_${playerID}`).textContent = currentScore;

    roundThrows = roundThrows.slice(0, -1);

    if (roundThrows.length === 0) {
        roundThrows = recreateThrows(player);        
    }

    if (roundThrows.length === 0) {
        document.getElementById(`lastThrow_${playerID}`).textContent = "";
        document.getElementById(`lastThrow2_${playerID}`).textContent = "";
        document.getElementById(`lastThrow3_${playerID}`).textContent = "";
    }else if (roundThrows.length === 1) {
        document.getElementById(`lastThrow_${playerID}`).textContent = roundThrows[0];
        document.getElementById(`lastThrow2_${playerID}`).textContent = "";
        document.getElementById(`lastThrow3_${playerID}`).textContent = "";
    }else if (roundThrows.length === 2) {
        document.getElementById(`lastThrow_${playerID}`).textContent = roundThrows[0];
        document.getElementById(`lastThrow2_${playerID}`).textContent = roundThrows[1];
        document.getElementById(`lastThrow3_${playerID}`).textContent = "";
    }else if (roundThrows.length >= 3) {
        document.getElementById(`lastThrow_${playerID}`).textContent = roundThrows[0];
        document.getElementById(`lastThrow2_${playerID}`).textContent = roundThrows[1];
        document.getElementById(`lastThrow3_${playerID}`).textContent = roundThrows[2];
    }

    if (roundThrows.length === 3) {
        currentPlayerID -= 1;

        if (currentPlayerID === 0) {
            currentPlayerID = playerCount;
        }

        player = buildPlayerByID(currentPlayerID);
        playerID = currentPlayerID;
        highlightPlayer(currentPlayerID);

        roundThrows = recreateThrows(player);
    }
}

function buildPlayerByID(playerID) {
    return playerX[playerID-1];
}

function gameEnd(cause) {
    if (cause === "win") {
        finishedPlayers += currentPlayerID;

        if (finishedPlayers.length >= playerCount - 1) {
            playerWins();
        }else if (winContinue === false) {
            winPopUp();
        }
    }
}

function playerWins() {
    var placement = "";

    var placementMap = generatePlacement();

    for (const [key, value] of placementMap) {
        placement += key + ":" + value + ";";
    }

    placement = btoa(placement);

    window.location.href = `win.html?placement=${placement}`;
}

function generatePlacement() {
    var tempPlacementMap = new Map();

    var playerStats_points = new Map();
    var playerStats_throws = new Map();
    var playerStats_average = new Map();

    for (const player of playerX) {
        var restPoints = maxPoints;
        totalPoints = 0;
        for (const element of throws.get(player)) {
            totalPoints += parseThrow(element);
            restPoints -= parseThrow(element);
        }

        var average = throws.get(player).length > 0 ? (totalPoints / throws.get(player).length).toFixed(2) : 0;

        playerStats_points.set(player, restPoints);
        playerStats_throws.set(player, throws.get(player).length);
        playerStats_average.set(player, average);
    }

    var placement = 1;

    for (const [key, value] of playerStats_points) {
        placement = 1;
        for (const [key2, value2] of playerStats_points) {
            if (key !== key2) {
                if (value < value2) {
                    //Player has more points then other player
                    placement += 0;
                }else if (value > value2) {
                    //Player has less points then other player
                    placement += 1;
                }else if (value === value2) {
                    //Player has same points as other player
                    //Check throws
                    if (playerStats_throws.get(key) < playerStats_throws.get(key2)) {
                        //Player has more throws then other player
                        placement += 0;
                    }else if (playerStats_throws.get(key) > playerStats_throws.get(key2)) {
                        //Player has less throws then other player
                        placement += 1;
                    } else if (playerStats_throws.get(key) === playerStats_throws.get(key2)) {
                        //Player has same throws as other player
                        //Check average
                        if (playerStats_average.get(key) > playerStats_average.get(key2)) {
                            //Player has better average then other player
                            placement += 0;
                        }else if (playerStats_average.get(key) < playerStats_average.get(key2)) {
                            //Player has worse average then other player
                            placement += 1;
                        }else if (playerStats_average.get(key) === playerStats_average.get(key2)) {
                            //Player has same average as other player
                            placement += 0;
                        }
                    }
                }
            }
        }
        tempPlacementMap.set(key, placement);
    }

    var placementMap = new Map();

    for (const [key, value] of tempPlacementMap) {
        var playerName = playerMap_.get(key);
        placementMap.set(playerName, value);
    }

    return placementMap;
}

const playerMap_ = new Map();
var playerNames_ = [];

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

            playerMap_.set(id, name);
        }

        playerNames_ = Array.from(playerMap_.keys());
    })
    .catch((error) => console.error(error));

function winPopUp() {
    document.getElementById("popupFront").classList.toggle("show");
    document.getElementById("background").classList.toggle("blur");

    pointsButtonToggle(true);

    document.getElementById("winText").textContent = playerMap_.get(playerX[currentPlayerID - 1]) + " wins!";
}

function continueGame() {
    document.getElementById("popupFront").classList.remove("show");
    document.getElementById("background").classList.remove("blur");

    pointsButtonToggle(false);

    winContinue = true;
}

function optionMenu() {
    document.getElementById("optionsPopup").classList.toggle("show");
    document.getElementById("background").classList.toggle("blur");

    if (optionsMenu === false) {
        pointsButtonToggle(true);
        
        window.setTimeout ( function() { optionsMenu = true; }, 1);
    } else {
        pointsButtonToggle(false);
        optionsMenu = false;
    }
}

function closeOptions() {
    if (optionsMenu === true) {
        document.getElementById("optionsPopup").classList.remove("show");
        document.getElementById("background").classList.remove("blur");
    
        pointsButtonToggle(false);
        optionsMenu = false;
    }
}

function pointsButtonToggle(state) {
    for (var i = 0; i <= document.getElementsByClassName("PointsButton").length - 1; i++) {
        document.getElementsByClassName("PointsButton")[i].disabled = state;
    }

    document.getElementById('doubleButton').disabled = state;
    document.getElementById('tripleButton').disabled = state;
    document.getElementById('backButton').disabled = state;
}