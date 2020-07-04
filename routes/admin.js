var express = require('express')
var app = express()
const Router = require('express-promise-router')
const db = require('../db')
const router = new Router()
var session = require('express-session')

router.get('/', (req, res) => {
    if(req.session.email) {
        res.write(`<h1>Hello ${req.session.email} </h1><br>`);
        res.end('<a href='+'/logout'+'>Logout</a>');
    }
    else {
        res.write('<h1>Please login first.</h1>');
        res.end('<a href='+'/login'+'>Login</a>');
    }
})

module.exports = router
