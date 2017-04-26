/**
 * Created by IMC017 on 2017-04-26.
 */
var express = require('express');
var app = require('express')();

// app.use(express.static);
// console.log(express.static);



app.use(function(req, res, next) {
    console.log('\n\nALLWAYS');
    next();
});

app.get('/a', function(req, res) {
    console.log('/a: route terminated');
    res.send('a');
});

app.get('/a', function(req, res) {
    console.log('never called');
});

app.get('/b', function(req, res, next){
    console.log('/b: route not terminated');
    next();
});

app.use(function (req, res, next) {
    console.log('SOMETIMES');
    next();
});

app.get('/b', function(req, res, next) {
    console.log('/b (part 2): error thrown');
    throw new Error('b failed');
});

app.use('/b', function(err, req, res, next) {
    console.log('/b error detected and passed on');
    next(err);
});

app.get('/c', function(err, req) {
    console.log('/c: error thrown');
    throw new Error('c failed');
});

app.get('/c', function(err, req, res, next) {
    console.log('/c: error detected but not passed on');
    next();
});





app.use(function(err, req, res, next) {
    console.log('unhandled error detected : ' + err.message);
    res.send('500 - server error');
});

app.use(function(req, res) {
    console.log('route not handled');
    res.send('404 - not found');
});
app.listen(80, function(){
    console.log('listening on 80');
})