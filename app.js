const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const dotenv = require('dotenv').config();


const app = express();
const candidateRoute = require('./api/routes/candidates');

//-------------- Database Connection ----------------------------------------

const DATABASEURL = process.env.MONGO_ATLAS_URL + process.env.MONGO_ATLAS_UN + ":"+process.env.MONGO_ATLAS_PW  + process.env.MONGO_ATLAS_CLUSTER;

mongoose.connect(DATABASEURL, { useNewUrlParser: true ,useUnifiedTopology: true,} ).then(result => {
    console.log("Successfully Connected :"+result);
}).catch(err => {
    console.log("Unable to Connect :"+err);
});
mongoose.set('useCreateIndex', true);


mongoose.Promise = global.Promise;
//-----------------// 

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//------------ Adding HEADER ----------------------------------//

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});

//---------------------------------------//


app.use('/candidates', candidateRoute);



app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;