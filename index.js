#!/usr/bin/env node

const yargs = require('yargs');
const { cosmiconfigSync } = require('cosmiconfig');
/* eslint no-unused-vars: 1 */
const { exec } = require('child_process');

// index.js
const path = require('path');

global.appRoot = path.resolve(__dirname);

/* eslint no-unused-vars: 1 */
const explorer = cosmiconfigSync('ezdb');

/* Initialize the database engine. */
const initDb = (appRoot, dbDir) => {
  const dbLoc = `${appRoot}/${dbDir}`;
  exec(`mkdir -p ${dbLoc}`);
  exec(`initdb ${dbLoc} --auth=trust > /dev/null`, (e) => {
    if (e) {
      console.log('Could not create the database directory :(');
    }
  });
};

/* Add users to the database engine. */
const createUsers = (users) => {
  users.forEach(({ username, password }) => {
    exec(
      `echo "${password} ${password}" | createuser -d -l ${username}`,
      (err) => {
        if (err) {
          console.log(`Could not create user ${username} :(`);
        }
      },
    );
  });
};

/* Create databases. */
const createDbs = (dbs, testDbPostfix) => {
  dbs.forEach(({ name: dbName, users: dbUsers, test }) => {
    exec(`createdb ${dbName}`, (e) => {
      if (e) {
        console.log(`Could not create database ${dbName} :(`);
      }
    });

    if (test) {
      exec(`createdb ${dbName}${testDbPostfix}`, (e) => {
        if (e) {
          console.log(`Could not create database ${dbName}${testDbPostfix} :(`);
        }
      });
    }
  });
};

/* Start the database server. */
const startDb = (logPath, dbDir) => {
  exec(
    `pg_ctl -l ${logPath} -o "-c unix_socket_directories=${dbDir}" start`,
    (e) => {
      if (e) {
        console.log(
          `Could not start the database :( check the log file at ${logPath} for more information.`,
        );
      }
    },
  );
};

/* Stop the database server. */
const stopDb = (logPath) => {
  exec('pg_ctl stop', (e) => {
    if (e) {
      console.log(
        `Could not stop the database :( check the log file at ${logPath} for more information.`,
      );
    }
  });
};

/* Restart the database server. */
const restartDb = (logPath, dbDir) => {
  stopDb();
  startDb(logPath, dbDir);
};

/* Set up the database. */
const setupDb = (appRoot, dbDir, users, dbs, testDbPostfix) => {
  initDb(appRoot, dbDir);
  createUsers(users);
  createDbs(dbs, testDbPostfix);
};

/* Reset the database. */
const resetDb = (appRoot, dbDir, users, dbs, testDbPostfix) => {
  exec(`rm -rf ${appRoot}/${dbDir}`);
  exec('killall postgres');
  setupDb(appRoot, dbDir, users, dbs, testDbPostfix);
};

const { config, filepath, isEmpty } = explorer.search();

const start = () => {
  startDb(global.appRoot, config.dbDir);
};
const stop = () => {
  stopDb();
};
const restart = () => {
  startDb(global.appRoot, config.dbDir);
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
