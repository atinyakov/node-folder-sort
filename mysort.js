#!/usr/bin/env node
const argv = require('yargs')
    .usage('Usage: $0 [option]')
    .help('help')
    .alias('help', 'h')
    .version('0.0.1')
    .alias('version', 'v')
    .example('$0 --src "src" --dest dist rmsrc')
    .option('src', {
        alias: 's',
        describe: 'source',
        demandOption: true,
        type: 'string'
    })
    .option('dest', {
        alias: 'd',
        describe: 'target folder',
        demandOption: true,
        type: 'string'
    })
    .option('rmsrc', {
        alias: 'rm',
        default: false,
        describe: 'remove src folder',
        demandOption: false,
        type: 'boolean'
    }).argv
