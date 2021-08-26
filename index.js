const express = require('express');
const path = require('path');
const app = express();
const helmet = require('helmet');
const rateLimiter = require('express-rate-limit');

const api_route = require( path.join(__dirname, 'routes', 'api.js'));

//===============================
// Config
//===============================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views') );

app.use('/public', rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000 // limit each IP to 100 requests per windowMs
}), express.static( path.join(__dirname, 'public')));

//=============================
// HelmetJS for Header Security
//=============================
app.use(helmet({
    contentSecurityPolicy: {
        useDefaults: true,
        directives: {
            "scriptSrc": ["'self'", "https://maps.googleapis.com"],
            "imgSrc": ["'self'", "data:", "https://maps.gstatic.com/", "https://maps.googleapis.com"]
        }
    }
}));


//==========================
// API
//==========================
app.use('/api', api_route );


//===============================
// Routes
//===============================
const routeLimiter = rateLimiter({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 200 // limit each IP to 200 requests per windowMs
});

app.get('/', routeLimiter, (req,res)=> {
    res.status(200).render('home');
});

app.get('/partner', routeLimiter, (req,res)=> {
    res.status(200).render('partner');
});

app.get('/hotels', routeLimiter, (req,res)=> {
    res.status(200).render('hotels');
});

app.get('/jobs', routeLimiter, (req,res)=> {
    res.status(200).render('jobs');
});

app.listen( process.env.PORT || 3000, ()=> {
    console.log("Web application started on port " + (process.env.PORT || 3000));
    console.log("Mode: " + process.env.NODE_ENV);
});