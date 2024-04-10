const urlParams = new URLSearchParams(window.location.search);
const placement = urlParams.get('placement');

var placementMap = new Map();

var first = [];
var second = [];
var third = [];
var other = [];

generateView();

function generateView() {
    // Decode from base64
    const decoded = atob(placement);

    // Rebuild Map
    var decodedSplit = decoded.split(';');

    for (let i = 0; i < decodedSplit.length; i++) {
        var decodedSplit2 = decodedSplit[i].split(':');
        var player = decodedSplit2[0];
        var place = decodedSplit2[1];

        placementMap.set(player, place);
    }

    //Remove empty entries
    placementMap.delete('');

    for (let [key, value] of placementMap) {
        if (value == 1) {
            first.push(key);
        } else if (value == 2) {
            second.push(key);
        } else if (value == 3) {
            third.push(key);
        }
    }

    showScores();
}

function showScores() {
    if (first.length >= 1 && (!second.length >= 1 && !third.length >= 1 && !other.length >= 1)) {
        // Only Gold medal needed
        createField('gold');
    }else if(second.length >= 1 && (!third.length >= 1 && !other.length >= 1)){
        // Gold and Silver needed
        createField('gold');
        createField('silver');
    }else if(third.length >= 1 && (!other.length >= 1)){
        // Gold, Silver and Bronze needed
        createField('gold');
        createField('silver');
        createField('bronze');
    }
}

function createField(medal) {
    var goldName = document.getElementById('gold_nameBox');
    var silverName = document.getElementById('silver_nameBox');
    var bronzeName = document.getElementById('bronce_nameBox');

    var name = document.createElement('p');
    name.className = 'playerName' + ' text-text text-6xl font-bold';

    if (medal == 'gold') {
        name.textContent = first;
        goldName.appendChild(name);
    } else if (medal == 'silver') {
        name.textContent = second;
        silverName.appendChild(name);
    } else if (medal == 'bronze') {
        name.textContent = third;
        bronzeName.appendChild(name);
    }
}