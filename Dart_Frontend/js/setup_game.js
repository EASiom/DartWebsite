var shuffle = true;

document.getElementById('start_game_btn').addEventListener('click', function () {
    const playersSelect = $('#select_field');
    const players = playersSelect.select2().val();
    
    var playerIds = [];
    for (let i = 0; i < players.length; i++) {
        var player = players[i].split(' ');
        playerIds.push(player[1].replace('(', '').replace(')', ''));
        players[i] = player[0];
    }

    var checkbox = document.querySelector('.switch input[type="checkbox"]');
    var gametype;

    if (checkbox.checked) {
        gametype = '501';
    } else {
        gametype = '301';
    }

    if (players == null || players.length < 1) {
        alert('Bitte wähle mindestens einen Spieler aus!');
        return;
    }else if(players.length > 4){
        alert('Bitte wähle maximal vier Spieler aus!');
        return;
    }

    window.location.href = `game.html?game=${gametype}&playerIDs=${playerIds}&shuffle=${shuffle}`;
});

const playerMap = new Map();
var playerNames = [];

fetch("http://localhost:8080/user/")
    .then((response) => response.json())
    .then((json) => {
        console.log(json)
        console.log(JSON.stringify(json))

        var jsonString = JSON.stringify(json);
        jsonString = jsonString.split('{')[2]
        jsonString = jsonString.split('}')[0]
        jsonString = jsonString.replace(/"/g, '')

        console.log(jsonString)

        var players = jsonString.split(',');

        console.log(players)

        for (let i = 0; i < players.length; i++) {
            var player = players[i].split(':');
            var id = player[0];
            var name = player[1];

            playerMap.set(id, name);
            playerNames.push(id);
            makePlayerList(name, id);
        }        
    })
    .catch((error) => console.error(error));

function makePlayerList(player, id) {
    const option = document.createElement('option');
    option.textContent = `${player} (${id})`;

    document.getElementById('select_field').appendChild(option);
}

function shuffleToggle() {
    shuffle = !shuffle;

    if (!shuffle) {
        document.getElementById("shuffle").classList.add("inactive");
    }else {
        document.getElementById("shuffle").classList.remove("inactive");
    }
}
