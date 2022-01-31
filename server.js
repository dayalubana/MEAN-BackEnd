var express = require('express')
var bodyParser = require('body-parser')
var app = express();
var db = require('./database/db')
var env = require('dotenv').config();
var auth = require('./routes/auth')
var main = require('./routes/main')
var path = require('path')
var cors = require('cors');
const multer = require('multer');
const PORT = process.env.PORT || 3000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
app.use(express.static('public')); 
app.use('/images', express.static('images'));
var corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions));

//routes
app.use('/',auth);
app.use('/',main);

app.listen(PORT,()=>{
    console.log('app is ruuning...');
})