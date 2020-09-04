const { exec } = require('child_process');

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
  dbs.forEach(({ name: dbName, test }) => {
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

module.exports = {
  startDb,
  stopDb,
  restartDb,
  setupDb,
  resetDb,
};
