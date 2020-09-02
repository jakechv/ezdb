#!/usr/bin/env node

const yargs = require('yargs');
// const { exec } = require('child_process');

const options = yargs.usage('Usage: -n <name>').option('n', {
  alias: 'name',
  describe: 'Your name',
  type: 'string',
  demandOption: true,
}).argv;

console.log(`Hello ${options.name}!`);
