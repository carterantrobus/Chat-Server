let ws;
let currCode;
// let currRoom = null;
// let currWS = "ws://localhost:8080/WSChatServer-1.0-SNAPSHOT/ws/" + currCode;

function newRoom(){
    // calling the ChatServlet to retrieve a new room ID
    let callURL= "http://localhost:8080/WSChatServer-1.0-SNAPSHOT/chat-servlet";
    document.getElementById("log").value = "";
    document.getElementById("log").value = "[" + timestamp() + "] " + "(Server): Welcome to the chat room. Please state your username to begin." + "\n";


    fetch(callURL, {
        method: 'GET',
        headers: {
            'Accept': 'text/plain',
        },
    })
        .then(response => response.text())
        .then(response => currCode = response)
        .then(response => enterRoom(response)); // enter the room with the code

    function timestamp() {
        var d = new Date(), minutes = d.getMinutes();
        if (minutes < 10) minutes = '0' + minutes;
        return d.getHours() + ':' + minutes;
    }
}

function enterRoom(code) {
    //makes new server
    ws = new WebSocket("ws://localhost:8080/WSChatServer-1.0-SNAPSHOT/ws/"+code);

    // adds tag to list of rooms
    let listOfRooms = document.getElementById("listOfRooms");
    let aTag = document.createElement('a');
    aTag.innerHTML=code;
    aTag.onclick = function() {
        let roomCodeName = document.getElementById("chatRoomHeader");
        roomCodeName.replaceChildren();
        let text = document.createTextNode('You are chatting in room ' + code);
        roomCodeName.appendChild(text);
        document.getElementById("log").value = "";
        document.getElementById("log").value = "[" + timestamp() + "] " + "(Server): Welcome to the chat room. Please state your username to begin." + "\n";
        ws = new WebSocket("ws://localhost:8080/WSChatServer-1.0-SNAPSHOT/ws/"+code);
        // ws.onopen = function (event) {
        //     console.log(event.data);
        //     let message = JSON.parse(event.data)
        //     document.getElementById("log").value += "[" + timestamp() + "] " + message.message + "\n";
        // };
    };
    aTag.title="chatroom";
    let d = document.createElement('div')
    d.appendChild(aTag)
    listOfRooms.appendChild(d);

    // changes room header
    let roomCodeName = document.getElementById("chatRoomHeader");
    roomCodeName.replaceChildren();
    let text = document.createTextNode('You are chatting in room ' + code);
    roomCodeName.appendChild(text);

    // first half of message/server messages
    ws.onmessage = function (event) {
        console.log(event.data);
        let message = JSON.parse(event.data)
        document.getElementById("log").value += "[" + timestamp() + "] " + message.message + "\n";
    }

    // ws.onclose = function (event) {
    //     console.log(event.data);
    //     let message = JSON.parse(event.data)
    //     document.getElementById("log").value += "[" + timestamp() + "] " + message.message + "\n";
    // }

    // user inputted part of messages
    document.getElementById("input").addEventListener("keyup", function (event) {
        if (event.key === 'Enter' && event.target.value !== "") {
            let request = {"type": "chat", "msg": event.target.value};
            ws.send(JSON.stringify(request));
            event.target.value = "";
        }
    });

    sendMessage.onclick = function (event) {
        if (event.target.value !== "") {
            let request = {"type": "chat", "msg": event.target.value};
            ws.send(JSON.stringify(request));
            event.target.value = "";
        }
    };

    function timestamp() {
        var d = new Date(), minutes = d.getMinutes();
        if (minutes < 10) minutes = '0' + minutes;
        return d.getHours() + ':' + minutes;
    }
}

window.onload = function() {
    let list = document.getElementById("listOfRooms");
    let storedList = localStorage.getItem("listOfRooms");
    if (storedList) {
        list.innerHTML = storedList;
    }
}

let sendMessage = document.getElementById("sendButton");

// function leaveRoom(room) {
//     if (currRoom !== null) {
//         const leaveMessage = {
//             type: "leave",
//             room: currRoom
//         };
//         currWS.send(JSON.stringify(leaveMessage));
//     }
//
//     currRoom = room;
// }

// function joinRoom(room) {
//     if (currRoom !== null) {
//         const leaveMessage = {
//             type: "leave",
//             room: currRoom
//         };
//         ws.send(JSON.stringify(leaveMessage));
//     }
//
//     const joinMessage = {
//         type: "join",
//         room: room
//     };
//     ws.send(JSON.stringify(joinMessage));
//
//     currRoom = room;
// }

