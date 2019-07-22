// Server API-related functions

const fetch = require("node-fetch");

module.exports.json = url => fetch(url)
    .then(response => response.json());
