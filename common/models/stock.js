"use strict";
var CATALOGUE = require("../config/stock-catalogue");

module.exports = function (Stock) {
  Stock.getInfo = function (symbol, callback) {
    var entry = CATALOGUE[symbol.toUpperCase()];

    if (!entry) {
      let error = new Error("Symbol" + symbol + "Not Found");
      error.statusCode = 404;
      return callback(error);
    }

    callback(null, { symbol: symbol.toUpperCase(), ...entry });
  };

  Stock.getPrice = function (symbol, callback) {
    //creating some static data
    // const basePrices = { AAPL: 175, GOOGL: 140, MSFT: 380, TSLA: 245, INFY: 18 };
    // const base = basePrices[symbol.toUpperCase()] || 100;

    var entry = CATALOGUE[symbol.toUpperCase()];
    if (!entry) {
      var err = new Error("Symbol " + symbol + " not found");
      err.statusCode = 404;
      return cb(err);
    }

    const base = entry || 100;
    const price = (base + (Math.random() - 0.5) * 4).toFixed(2);
    const change = ((Math.random() - 0.5) * 2).toFixed(2);

    callback(null, {
      symbol: symbol.toUpperCase(),
      price: parseFloat(price),
      change: parseFloat(change),
      changePercent: ((change / price) * 100).toFixed(2),
      timestamp: new Date(),
    });
  };

  //now calling that function in a remote method

  Stock.remoteMethod("getPrice", {
    description: "Get current price for a stock symbol",
    accept: [
      {
        arg: "symbol",
        type: "string",
        required: true,
        http: { source: "path" },
      },
    ],
    return: { arg: "data", type: "object", root: true },
    http: { path: "/price/:symbol", verb: "get" },
  });
};
