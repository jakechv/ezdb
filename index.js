#!/usr/bin/env node

// const { exec } = require('child_process');

/* eslint no-unused-expressions: 1 */
const DEFAULT_DB = 'postgres';
const DEFAULT_DB_USER = 'username';
const DEFAULT_DB_PASS = 'password';
const DEFAULT_DB_NAME = 'db';
const DEFAULT_DB_TEST = `${DEFAULT_DB_NAME}_test`;

const yargs = require('yargs');

yargs
  .scriptName('ezdb')
  .usage('Usage: $0 <cmd> [options]')

  .command('start', 'start the database')
  .command('stop', 'stop the database')
  .command('restart', 'restart the database')
  .command('init', 'initialize the database')
  .command('reset', 'reset the database')

  .option('u', {
    alias: 'username',
    describe: 'The username for the user of the database.',
    default: DEFAULT_DB_USER,
    type: 'string',
    nargs: 1,
  })

  .option('p', {
    alias: 'password',
    describe: 'The password for the user of the database.',
    default: DEFAULT_DB_PASS,
    type: 'string',
    nargs: 1,
  })

  .option('dbname', {
    alias: 'database-name',
    describe: 'The name of the database to be created.',
    default: DEFAULT_DB_NAME,
    type: 'string',
    nargs: 1,
  })

  .option('testdbname', {
    alias: 'test-database-name',
    describe: 'The name of the test database to be created.',
    default: DEFAULT_DB_TEST,
    type: 'string',
    nargs: 1,
  })

  .option('db', {
    alias: 'database',
    describe: 'The database to be used',
    default: DEFAULT_DB,
    type: 'string',
    nargs: 1,
  })

  .help('help')
  .alias('h', 'help')
  .alias('v', 'version')
  .demandCommand()
  .showHelpOnFail(true).argv;
