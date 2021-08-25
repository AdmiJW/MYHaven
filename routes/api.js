const express = require('express');
const fetch = require('node-fetch');
const router = new express.Router();
const path = require('path');

const MemoryDB = require( path.join(__dirname, '..', 'memory_db', 'memoryDB.js') );

require('dotenv').config();


//=================================
// Hotels Operation API
//=================================
router.get('/get_hotels', (req,res)=> {
    res.json( MemoryDB.get_hotels() );
});


router.post('/add_hotel', express.json(), (req,res)=> {
    const { name, number, email, address, loc } = req.body;

    // Simple validation
    if (!name || !number || !email || !address || !loc) 
        return res.json({ error: "Invalid POST body" });

    MemoryDB.add_hotel( req.body );
    return res.json( Object.assign( { success: true }, req.body ) );
});


//===================================
// Geocoding API
//===================================
router.use('/geocode', (req,res)=> {
    const { addr } = req.query;

    if (addr === undefined)
        return res.json({ error: "Address not defined" });

    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${addr}&key=${process.env.GEOCODING_KEY}`)
    .then((res)=> res.json())
    .then((json)=> {
        if (json.results[0].geometry.location === undefined) throw Error();
        return res.json({ location: json.results[0].geometry.location});
    })
    .catch((err)=> {
        return res.json({ error: `Error while geocoding ${addr}`});
    });
});


router.use('/rev_geocode',(req,res)=> {
    const { latlng } = req.query;

    if (latlng === undefined)
        return res.json({ error: "Latitude and Longitude not defined" });

    fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latlng}&key=${process.env.GEOCODING_KEY}`)
    .then((res)=> res.json())
    .then((json)=> {
        if (json.results[0].formatted_address === undefined) throw Error();
        return res.json({ addr: json.results[0].formatted_address});
    })
    .catch((err)=> {
        return res.json({ error: `Error while reverse-geocoding ${latlng}`});
    });
})

module.exports = router;