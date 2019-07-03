// const Joi = require('joi'); 
const express = require('express'); 
const env = require('dotenv').config(); 
const app = express(); 

app.get('/', (req, res) => {
    res.send('Hello World');
}); 


const port = process.env.PORT || 5000;
const server = app.listen(port, () => console.log('Listening on port ...'));       

module.export = server 
