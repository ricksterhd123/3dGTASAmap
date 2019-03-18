// XML HTTP request object
var http = null;
var playerInfo = null;
var timer = null;
var error = false;

function updatePlayerInfo(){
    if (http.readyState == XMLHttpRequest.DONE){
        if (http.status == 200){
            let response = http.responseText;
            // error
            if (response == "e") {
                console.log("Error: Server timeout.")
                return false;
            }
            // parse response into json
            let newPlayerInfo = JSON.parse(response);
            if (playerInfo == newPlayerInfo) return false;

            // render player list and draw canvas
            playerInfo = newPlayerInfo;

        } else{
            console.log(`Something went wrong, status code: ${http.status}`);
        }
    }

    return true;
}

/**
 * GET /players and retrieve data from the mtasa server.
 */
function getPlayersOnline(){
    http = new XMLHttpRequest();
    if (!http){
        console.log("Giving up :(");
        return false;
    }

    http.onreadystatechange = updatePlayerInfo;
    http.open('GET', '/players');
    http.send();
}

getPlayersOnline();
timer = setInterval(getPlayersOnline, 5000);
