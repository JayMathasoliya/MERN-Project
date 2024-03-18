const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dbConnect = require('./database/conn');
const router = require('./routes/route');

const app = express();

/** Load environment variables from .env file */
require('dotenv').config();

/** middleware */
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));
app.disable('x-powered-by');

const PORT = process.env.PORT || 8081;

/** HTTP GET Request */
app.get('/',(req,res)=>{
    res.status(201).json('Hello World');
})

/** api routes */
app.use('/api',router);

/** start server only we have valid connection */
dbConnect().then(()=>{
    try{
        app.listen(PORT, ()=>{
            console.log(`Server connected to http://localhost:${PORT}`);
        })
    }
    catch(err){
        console.log("Can't connect to the server")
    }
}).catch((err)=>{
    console.log("Invalid database connection");
})

