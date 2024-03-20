var playerCreateMenu = false;
var playerManageMenu = false;

function generatePlayers() {
    for (let i = 1; i <= 10; i++) {
        let name = "Player" + i;
        createPlayer(name);
    }
}

function createPlayer(name) {
    if (name.length <= 0) {
        alert("Please enter a name!");
        return;
    } else if (name.length >= 20) {
        alert("This name is too long! (Max 20 characters)");
        return;
    }

    fetch('http://localhost:8080/user/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `name=${encodeURIComponent(name)}`,
    })
    .then(response => response.json())
    .then(json => {
        var jsonString = JSON.stringify(json);

        console.log(jsonString);
        
        jsonString = jsonString.replace('{', '');
        jsonString = jsonString.replace('}', '');
        jsonString = jsonString.replace(/"/g, '');
        
        console.log(jsonString);

        var player = jsonString.split(',');
        
        generatePlayerList(name, player[0].split(':')[1]);
    });
    
    document.getElementById("newPlayerPopup").classList.toggle("show");
    document.getElementById("background").classList.toggle("blur");

    playerCreateMenu = false;
}

function managePlayer(playerID) { 
    document.getElementById("managePlayerPopup").classList.toggle("show");
    document.getElementById("background").classList.toggle("blur");

    if (playerManageMenu === false) {
        window.setTimeout ( function() { playerManageMenu = true; }, 1);

        document.getElementById("playerNameManage").value = document.getElementById("name_" + playerID).textContent;
        document.getElementById("playerIDManage").value = playerID;
    }else {
        playerManageMenu = false;
    }
}

function deletePlayer() {
    var playerID = document.getElementById("playerIDManage").value;
    var table = document.getElementById("playerTable");
    var tr = table.getElementsByTagName("tr");
    var row;
    for (var i = 0; i < tr.length; i++) {
        var td = tr[i].getElementsByTagName("th")[1];
        if (td) {
            var txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase() === playerID.toUpperCase()) {
                row = i;
            }
        }       
    }

    document.getElementById('playerTable').deleteRow(row);

    fetch(`http://localhost:8080/user/${playerID}/`, {
        method: 'DELETE',
    })

    closeOptions();
}

function saveChanges2Player() {
    var playerID = document.getElementById("playerIDManage").value;
    var table = document.getElementById("playerTable");
    var tr = table.getElementsByTagName("tr");
    var row;
    for (var i = 0; i < tr.length; i++) {
        var td = tr[i].getElementsByTagName("th")[1];
        if (td) {
            var txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase() === playerID.toUpperCase()) {
                row = i;
            }
        }       
    }

    var newName = document.getElementById("playerNameManage").value;

    if (newName.length <= 0) {
        alert("Please enter a name!");
        return;
    } else if (newName.length >= 20) {
        alert("This name is too long! (Max 20 characters)");
        return;
    }

    document.getElementById("name_" + playerID).textContent = newName;

    fetch(`http://localhost:8080/user/${playerID}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `name=${encodeURIComponent(newName)}`,
    })

    closeOptions();
}

function closeOptions() {
    if (playerCreateMenu && document.getElementById("newPlayerPopup").classList.contains("show")) {
        document.getElementById("newPlayerPopup").classList.toggle("show");
        document.getElementById("background").classList.toggle("blur");

        playerCreateMenu = false;
    }else if (playerManageMenu && document.getElementById("managePlayerPopup").classList.contains("show")) {
        document.getElementById("managePlayerPopup").classList.toggle("show");
        document.getElementById("background").classList.toggle("blur");

        playerManageMenu = false;
    }
}

var playerNames = [];

fetch("http://localhost:8080/user/")
    .then((response) => response.json())
    .then((json) => {
        var jsonString = JSON.stringify(json);
        jsonString = jsonString.split('{')[2]
        jsonString = jsonString.split('}')[0]
        jsonString = jsonString.replace(/"/g, '')
        var players = jsonString.split(',');

        const playerMap = new Map();

        for (let i = 0; i < players.length; i++) {
            const player = players[i].split(':');
            const id = player[0];
            const name = player[1];

            if (id === "") {
                continue;
            }

            playerMap.set(id, name);
        }

        playerNames = Array.from(playerMap.keys());

        if (playerNames.length <= 0) {
            const element = document.createElement('p');
            element.className = "ml-4 font-mono text-3xl font-semibold cursor-pointer text-text m-5/10/0";
            element.textContent = "No players found";

            document.getElementById('playerTable').appendChild(element);
        }
        
        for (let i = 0; i < playerNames.length; i++) {
            generatePlayerList(playerMap.get(playerNames[i]), playerNames[i]);
        }
    })
    .catch((error) => console.error(error));

function generatePlayerList(player, id) {   
    const tr = document.createElement('tr');
    tr.className = "PlayerBG" + " h-16 bg-second cursor-pointer hover:bg-third-hover transition duration-300 ease-in-out text-text text-3xl border-8 border-background border-solid";
    tr.id = "player_" + id;
    tr.onclick = function () {
        managePlayer(id)
    }

    const playerElement = document.createElement('th');
    playerElement.className = "font-mono rounded-s-3xl";
    playerElement.id = "name_" + id;
    playerElement.textContent = player;

    const idElement = document.createElement('th');
    idElement.className = "";
    idElement.id = "id_" + id;
    idElement.textContent = id;

    const statsFieldElement = document.createElement('th');
    statsFieldElement.className = "rounded-e-3xl";
    statsFieldElement.id = "statsField_" + id;

    const statsElement = document.createElement('button');
    statsElement.className = "text-3xl font-semibold transition duration-300 ease-in-out cursor-pointer w-2/10 rounded-xl text-text bg-accent hover:bg-accent-hover";
    statsElement.id = "stats_" + id;
    statsElement.textContent = "Stats";
    statsElement.onclick = function () { window.location.href = `../stats/stats.html?player=${id}`};

    tr.appendChild(playerElement);
    tr.appendChild(idElement);
    statsFieldElement.appendChild(statsElement);
    tr.appendChild(statsFieldElement);
    

    document.getElementById('playerTable').appendChild(tr);
}

function searchPlayer() {
    var input, filter, table, tr, td, txtValue;
    input = document.getElementById("search");
    filter = input.value.toUpperCase();
    table = document.getElementById("playerTable");
    tr = table.getElementsByTagName("tr");
    for (var i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("th")[0];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().startsWith(filter)) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }       
    }
}