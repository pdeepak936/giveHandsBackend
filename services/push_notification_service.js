const { json } = require("express");
var https = require("https");

const { ONE_SIGNAL_CONFIG } = require("../config/app.config");

async function SendNotification(data, callback) { 
    var headers = {
        "Content-Type": "application/json; charset=utf-8", 
        Authorization: "Basic " + ONE_SIGNAL_CONFIG.API_KEY,
    };

    var options ={
        host: "onesignal.com",
        port: 443, 
        path: "/api/v1/notifications", // Corrected API version
        method: "POST",
        headers: headers,
    };
    var req = https.request(options, function (res) {
        var responseData = '';

        res.on("data", function (chunk) {
            responseData += chunk;
        });

        res.on("end", function () {
            console.log(JSON.parse(responseData));
            return callback(null, JSON.parse(responseData));
        });
    });

    req.on("error", function(e) {
        return callback({
            message: e
        });
    });

    req.write(JSON.stringify(data));
    req.end();
}

module.exports = {
    SendNotification
}
