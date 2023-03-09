const fs = require('fs');
const path = require('path');

module.exports = {
  "development": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME,
    "host": process.env.DB_HOST,
    "dialect": "postgres",
    "port": process.env.DB_PORT,
    "define": {
			timestamps: false,
		},
    "dialectOptions": {
      "ssl": { 
        "require": true,
        "rejectUnauthorized": false,
        // 'ca': process.env.CACERT
        // "ca": fs.readFileSync('./ca-certificate.crt').toString()
        "ca": fs.readFileSync(path.join(__dirname, "..", "..", './ca-certificate.crt'))
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
    // "ssl":true,
    "dialectOptions": {
      "ssl": { 
        "require": true,
        "rejectUnauthorized": false,
        // 'ca': process.env.CACERT
        // 'ca': fs.readFileSync('./ca-certificate.crt').toString()
        "ca": fs.readFileSync(path.join(__dirname, "..", "..", './ca-certificate.crt'))
      }
    }
  }
}

