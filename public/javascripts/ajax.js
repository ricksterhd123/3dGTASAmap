// XML HTTP request object
var http = null;
var playerInfo = null;
var timer = null;
var error = false;

function errMsg(){
    if (error) return;
    hideCanvas(true);
    clearPlayerList();
    let errMsg = document.createElement('p');
    errMsg.id = "errMsg";
    errMsg.innerHTML = "appears to be offline...";
    document.body.appendChild(errMsg);
    error = true;
}

function clearErrMsg(){
    if (!error) return;
    let msg = document.getElementById('errMsg');
    document.body.removeChild(msg);
}

function updatePlayerInfo(){
    if (http.readyState == XMLHttpRequest.DONE){
        if (http.status == 200){
            let response = http.responseText;
            // error
            if (response == "e") {
                errMsg();
                return false;
            }else {
                clearErrMsg();
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
