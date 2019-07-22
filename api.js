// Server API-related functions

const fetch = require("node-fetch");
const util = require("util");

module.exports.json = url => fetch(url)
    .then(response => response.json());
