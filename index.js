const express = require("express");
const bodyParser = require('body-parser')
const cors = require("cors");
require("dotenv").config();
const router = require("./routes");
const path = require("path")
const fileUpload = require("express-fileupload");
const { sequelize } = require("./db/models/index")
var cors_proxy = require('cors-anywhere');


const app = express();
const PORT = process.env.PORT || 5000;


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(path.resolve(__dirname, "static")))
app.use(fileUpload({}))
app.use(cors({
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH'],
    origin: [process.env.SITE_URL, 'http://localhost:3000'],
    credentials: false
}))

app.use("/api", router)

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()

        app.listen(PORT, () => {
            console.log(`Server started at port ${PORT}`);
        })
    } catch(e) {
        console.log(e);
    }
}

start()

//   "development": {
//     "username": "igddrqxhgjqppd",
//     "password": "a7e23e53c1bffccd9f8f0addff63efb0729f31dadf1e9c63016ab14906f653af",
//     "database": "d9mnvac06utonn",
//     "host": "ec2-52-48-159-67.eu-west-1.compute.amazonaws.com",
//     "dialect": "postgres",
//     "port": 5432,
//      "dialectOptions": {
//       "ssl": { 
//         "require": true,
//         "rejectUnauthorized": false
//       }
//     }
//   },

// username = doadmin
// password = AVNS_d2C-jKCYNawehoDwn5C
// host = db-postgresql-fra1-22717-do-user-13608356-0.b.db.ondigitalocean.com
// port = 25060
// database = defaultdb
// sslmode = require

// PGPASSWORD=AVNS_d2C-jKCYNawehoDwn5C pg_restore -U doadmin -h db-postgresql-fra1-22717-do-user-13608356-0.b.db.ondigitalocean.com -p 25060 -d defaultdb 