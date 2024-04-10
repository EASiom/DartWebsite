const urlParams = new URLSearchParams(window.location.search);
const player = urlParams.get('player');

function loadPreDefinedPlayer() {
    if (player != null) {
        if ($('.player_select_menu').find("option[value='" + playerMap.get(player) + "']").length) {
            $('.player_select_menu').val(playerMap.get(player)).trigger('change');
        } else { 
            var newOption = new Option(playerMap.get(player), playerMap.get(player), true, true);
            $('.player_select_menu').append(newOption).trigger('change');
        }
    
        loadStats(player);
    }
}

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

        for (let i = 0; i < playerNames.length; i++) {
            makePlayerList(playerMap.get(playerNames[i]));
        }
    })
    .catch((error) => console.error(error));


function makePlayerList(player) {
    const option = document.createElement('option');
    option.textContent = `${player}`;

    document.getElementById('select_field').appendChild(option);
}

$('.player_select_menu').on('select2:select', function (e) {
    var data = e.params.data;
    var playerID = playerNames.find(key => playerMap.get(key) === data.text);

    if (data.text === "Select player") {
        document.getElementById('wonGames').textContent = "-";
        document.getElementById('playedGames').textContent = "-";
        document.getElementById('bestAverage').textContent = "-";
        document.getElementById('timesOverthrown').textContent = "-";
        document.getElementById('dartsThrown').textContent = "-";
        document.getElementById('shortestGame').textContent = "-";
        document.getElementById('winRate').textContent = "-";

        document.getElementById('wonGames').classList.add("animate-pulse");
        document.getElementById('playedGames').classList.add("animate-pulse");
        document.getElementById('bestAverage').classList.add("animate-pulse");
        document.getElementById('timesOverthrown').classList.add("animate-pulse");
        document.getElementById('dartsThrown').classList.add("animate-pulse");
        document.getElementById('shortestGame').classList.add("animate-pulse");
        document.getElementById('winRate').classList.add("animate-pulse");
    }else {
        loadStats(playerID);
    }
});

function loadStats(playerID) {
    fetch(`http://localhost:8080/stats/${playerID}`)
        .then((response) => response.json())
        .then((json) => {
            var jsonString = JSON.stringify(json);
            jsonString = jsonString.split('{')[2]
            jsonString = jsonString.split('}')[0]
            jsonString = jsonString.replace(/"/g, '')
            var stats = jsonString.split(',');

            var wonGames = stats[7].split(':')[1];
            var playedGames = stats[3].split(':')[1];
            var bestAverage = stats[0].split(':')[1];
            var overthrows = stats[2].split(':')[1];
            var dartsThrown = stats[1].split(':')[1];
            var shortestGame = stats[5].split(':')[1];
            var winRate = stats[6].split(':')[1];

            document.getElementById('wonGames').textContent = wonGames;
            document.getElementById('playedGames').textContent = playedGames;
            document.getElementById('bestAverage').textContent = bestAverage;
            document.getElementById('timesOverthrown').textContent = overthrows;
            document.getElementById('dartsThrown').textContent = dartsThrown;
            document.getElementById('shortestGame').textContent = shortestGame;
            document.getElementById('winRate').textContent = winRate;
        })
        .catch((error) => console.error(error));
    
    document.getElementById('wonGames').classList.remove("animate-pulse");
    document.getElementById('playedGames').classList.remove("animate-pulse");
    document.getElementById('bestAverage').classList.remove("animate-pulse");
    document.getElementById('timesOverthrown').classList.remove("animate-pulse");
    document.getElementById('dartsThrown').classList.remove("animate-pulse");
    document.getElementById('shortestGame').classList.remove("animate-pulse");
    document.getElementById('winRate').classList.remove("animate-pulse");
}