module.exports = {
  // "development": {
  //   "username": process.env.DB_USERNAME,
  //   "password": process.env.DB_PASSWORD,
  //   "database": process.env.DB_NAME,
  //   "host": process.env.DB_HOST,
  //   "dialect": "postgres",
  //   "port": process.env.DB_PORT,
  //    "dialectOptions": {
  //     "ssl": { 
  //       "require": true,
  //       "rejectUnauthorized": false
  //     }
  //   }
  // },
  "development": {
    "username": 'doadmin',
    "password": 'AVNS_d2C-jKCYNawehoDwn5C',
    "database": 'defaultdb',
    "host": 'db-postgresql-fra1-22717-do-user-13608356-0.b.db.ondigitalocean.com',
    "dialect": "postgres",
    "port": 25060,
     "dialectOptions": {
      "ssl": { 
        "require": true,
        "rejectUnauthorized": false
      }
    }
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME,
    "host": process.env.DB_HOST,
    "dialect": "postgres",
    "port": process.env.DB_PORT,
     "dialectOptions": {
      "ssl": { 
        "require": true,
        "rejectUnauthorized": false
      }
    }
  }
}

