const WebSocket = require('ws');
const fs = require("fs");
const path = require("path");
const dataCallback = require('../GetCoinbaseExchangeData');

function readSetupInfo() {
    const filepath = path.join(__dirname, "SetupInfo.json");
    const fileContent = fs.readFileSync(filepath, 'utf-8');
    const jsonData = JSON.parse(fileContent);
    return jsonData;
}

function ws_connect() {
    let thread_ws_keep_alive = null;
    let ws = null;
    const jsonData = readSetupInfo();
    ws = new WebSocket(jsonData['ws_addr']);
    ws.onopen = function(event) {
        console.log("Connection opened..");
        ws.send(JSON.stringify(jsonData['subscribe_message']));
    }
    ws.onerror = function(event) {
        console.error("Connection Error: ", event)
    }
    ws.onclose = function(event) {
        console.log("Connection closed");
        clearInterval(thread_ws_keep_alive);
    }
    ws.onmessage = handleMessage;
}

function handleMessage(event, ws) {
    const jsonData = JSON.parse(event.data);
    if("type" in jsonData && jsonData["type"] == 'subscriptions')
    {
        console.log("Subscription Successful: ", event.data);
        thread_ws_keep_alive = setInterval(() => ws_keepalive(ws), 30000);
        // ws.onmessage = dataCallback;
    }
    else if("type" in jsonData && jsonData["type"] == 'error')
    {
        console.log("Subscription ERROR: ", event.data)
    }
    else
    {
        dataCallback(jsonData);
    }
}

function ws_keepalive(ws) {
    if( ws && ws.readyState == WebSocket.OPEN) {
        ws.ping('keepalive');
    }
}

module.exports = ws_connect;

if (require.main == module) {
    ws_connect();
}