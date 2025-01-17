'use strict';

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const apiRoutes = require('./routes/api.js');
const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner');
const mongoose = require('mongoose');
const app = express();

//connection to mongodb

let dbUrl = process.env.DB;

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
});
// mongoose.set('toJSON', { virtuals: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
    console.log("Successfully connected to MONGODB");
});

app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({ origin: '*' })); //USED FOR FCC TESTING PURPOSES ONLY!

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Index page (static HTML)
app.route('/')
    .get(function(req, res) {
        res.sendFile(process.cwd() + '/views/index.html');
    });

//For FCC testing purposes
fccTestingRoutes(app);

//Routing for API 
apiRoutes(app);

//404 Not Found Middleware
app.use(function(req, res, next) {
    res.status(404)
        .type('text')
        .send('Not Found');
});

//Start our server and tests!
app.listen(process.env.PORT, function() {
    console.log("Listening on port " + process.env.PORT);
    if (process.env.NODE_ENV) {
        console.log('Running Tests...');
        setTimeout(function() {
            try {
                runner.run();
            } catch (e) {
                let error = e;
                console.log('Tests are not valid:');
                console.log(error);
            }
        }, 1500);
    }
});

module.exports = app; //for unit/functional testing