#!/usr/bin/env node

const start = (argv) => {
  console.log(argv);
};
const stop = (argv) => {
  console.log(argv);
};
const restart = (argv) => {
  console.log(argv);
};
const init = (argv) => {
  console.log(argv);
};
const reset = (argv) => {
  console.log(argv);
};

const yargs = require('yargs');
const { cosmiconfig } = require('cosmiconfig');
/* eslint no-unused-vars: 1 */
const { exec } = require('child_process');

/* eslint no-unused-vars: 1 */
const explorer = cosmiconfig('ezdb');

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
