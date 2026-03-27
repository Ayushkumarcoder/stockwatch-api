"use strict";

var WebSocket = require("ws");
var CATALOGUE = require('../common/config/stock-catalogue');

var currentPrice = {};

Object.keys(CATALOGUE).forEach(function (symbol) {
  currentPrice[symbol] = CATALOGUE[symbol].basePrice;
});

module.exports = function setupPriceBroadcaster(httpServer) {
  const wss = new WebSocket.Server({ server: httpServer });
  //as soon as a client connects, we will send the snapshot of current prices immidiently.
  wss.on("connection", function (ws) {
    console.log(
      "Websocket connection established, Client connected to price feed",
    );

    ws.send(JSON.stringify({ type: "snapshot", prices: currentPrice }));

    ws.on("close", function () {
      console.log("Client disconnected from price feed");
    });
  });

  // Tick every 2 seconds — update ALL prices and broadcast to ALL clients
  setInterval(function () {
    //make a small drift in the prices of all the currentPrice items
    Object.keys(currentPrice).forEach(function (symbol) {
      const drift = (Math.random() - 0.5) * 0.8; // small move each tick

      currentPrice[symbol] = parseFloat(
        Math.max(1, currentPrice[symbol] + drift).toFixed(2),
      );

      //now after changing the prices, create a message and send it

      const message = JSON.stringify({
        type: 'tick',
        prices: currentPrice,
        timestamp: Date.now()
      })

      wss.clients.forEach(function(client){
        if(client.readyState === WebSocket.OPEN){
            client.send(message);
        }
      })

    });
  }, 2000); //call this function every 2 seconds.

  return wss;
};
