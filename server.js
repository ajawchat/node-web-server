const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

console.log('Starting server...');

var app = express();

app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));
app.use((request, response, next) => {
    var now = new Date().toString();
    var logStr = `${now}: ${request.method} ${request.url}\n`;

    console.log(logStr);
    fs.appendFile('access.log', logStr, (err) => {
        if(err) {
            console.log('Unable to log access data to the local system');
        }
    });
    next();
});

app.use((request, response, next) => {
    response.render('maintenance.hbs');    
});

// configure the handlebars helper
hbs.registerPartials(__dirname + '/views/partials');
hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

app.get('/', (request, response) => {
    response.render('home.hbs', {
        pageTitle: 'Home page!!',
        year: new Date().getFullYear(),
    });
});

// support for partial
app.get('/about', (request, response) => {
    response.render('about.hbs', {
        pageTitle: 'About Page updated!!!',
    });
});

app.get('/bad', (request, response) => {
    response.send({
        message: 'This request was not fulfilled due to database timeout',
    });
});

app.listen(3000);