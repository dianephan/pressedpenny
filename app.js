// const Joi = require('joi'); 
const express = require('express'); 
const mountRoutes = require('./routes');
const env = require('dotenv').config(); 

const app = express(); 
mountRoutes(app)


const port = process.env.PORT || 5000;
const server = app.listen(port, () => console.log('Listening on port ...'));       

module.export = server 


