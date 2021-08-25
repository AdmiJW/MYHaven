const express = require('express');
const path = require('path');
const app = express();

const api_route = require( path.join(__dirname, 'routes', 'api.js'));

//===============================
// Config
//===============================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views') );

app.use('/public', express.static( path.join(__dirname, 'public')));


//==========================
// API
//==========================
app.use('/api', api_route );


//===============================
// Routes
//===============================
app.get('/', (req,res)=> {
    res.status(200).render('home');
});

app.get('/partner', (req,res)=> {
    res.status(200).render('partner');
});

app.get('/hotels', (req,res)=> {
    res.status(200).render('hotels');
});

app.get('/jobs', (req,res)=> {
    res.status(200).render('jobs');
});

app.listen( process.env.PORT || 3000, ()=> {
    console.log("Web application started on port " + (process.env.PORT || 3000));
    console.log("Mode: " + process.env.NODE_ENV);
});