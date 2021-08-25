
// I know, storing data that is supposed to be in database inside memory is very bad.

// Store each location in the form:
// {
//      name
//      number
//      email
//      address 
//      loc: (lat, lng)   
// }
const data = {
    hotels: [],
    medicals: [],
    food_beverages: []
};

// Return all hotel
function get_hotels() {
    return data.hotels;
}

function get_medicals() {
    return data.medicals;
}

function get_food_beverages() {
    return data.food_beverages;
}

function add_hotel( hotel ) {
    data.hotels.push(hotel);
}

function add_medical( medical) {
    data.medicals.push( medical );
}

function add_food_beverages( f_and_b ) {
    data.food_beverages.push(f_and_b);
}



module.exports = {
    get_hotels, get_medicals, get_food_beverages,
    add_hotel, add_medical, add_food_beverages
};