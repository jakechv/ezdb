#!/usr/bin/env node

const yargs = require('yargs');
const { cosmiconfigSync } = require('cosmiconfig');
/* eslint no-unused-vars: 1 */

// index.js
const path = require('path');

global.appRoot = path.resolve(__dirname);

/* eslint no-unused-vars: 1 */
const explorer = cosmiconfigSync('ezdb');

const {
  startDb, stopDb, setupDb, resetDb, restartDb,
} = require('./db');

const { config, filepath, isEmpty } = explorer.search();

const start = () => {
  startDb(global.appRoot, config.dbDir);
};
const stop = () => {
  stopDb();
};
const restart = () => {
  restartDb(global.appRoot, config.dbDir);
};
const init = () => {
  setupDb(
    global.appRoot,
    config.dbDir,
    config.users,
    config.databases,
    config.testDbPostfix,
  );
};
const reset = () => {
  resetDb(
    global.appRoot,
    config.dbDir,
    config.users,
    config.databases,
    config.testDbPostfix,
  );
};

/* eslint no-unused-expressions: 1 */
yargs
  .scriptName('ezdb')
  .usage('Usage: $0 <cmd> [options]')
  .command('start', 'start the database', () => {}, start)
  .command('stop', 'stop the database', () => {}, stop)
  .command('restart', 'restart the database', () => {}, restart)
  .command('init', 'initialize the database', () => {}, init)
  .command('reset', 'reset the database', () => {}, reset)
  .help('help')
  .alias('h', 'help')
  .alias('v', 'version')
  .demandCommand()
  .showHelpOnFail(true).argv;
