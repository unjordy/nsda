#!/usr/bin/env node
const { createLogger, format, transports } = require("winston");
const fs = require("fs");
const util = require("util");
const api = require("../api");
const data = require("../data");

const ENDPOINT_URL = "https://data-endpoint.herokuapp.com/data";

const logger = createLogger({
    level: "info",
    format: format.combine(
        format.timestamp({
            format: "YYYY-MM-DD HH:mm:ss"
        }),
        format.errors({
            stack: true
        }),
        format.splat(),
        format.json()),
    defaultMeta: {
        service: "nsda"
    },
    transports: [
        new transports.Console({
            format: format.simple()
        })
    ]
});

const main = () => {
    logger.info(`Fetching data from ${ENDPOINT_URL}`);
    api.json(ENDPOINT_URL)
        .then(json => json.map(el => data.sanitize(el)))
        .then(json => {
            const filename = `nsda-${new Date().getTime()}.json`;
            logger.info(`Writing ${json.length} records to ${filename}`);

            return new Promise((resolve, reject) => {
                fs.writeFile(`./${filename}`,
                             JSON.stringify(json, null, 4),
                             "utf8", err => {
                                 if(err) {
                                     reject(err)
                                 }
                                 else {
                                     resolve(json)
                                 }
                             })
            });
        })
        .catch(error => logger.error(util.inspect(error)));
};

main();
