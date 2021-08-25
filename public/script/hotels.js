const header = document.querySelector('nav');
header.classList.add('bg-visible');

const address_field = document.querySelector('.header__addr');
const search_btn = document.querySelector('.header__btn');



// Google Map
let map;


//===========================================
// When map is clicked, focus on the location
//===========================================
search_btn.addEventListener('click', async (e)=> {
    const addr = address_field.value;

    let response = await (await fetch(`/api/geocode?addr=${addr}`) ).json();
    if (response.error) 
        return window.alert("Unable to find provided address");
    
    const loc = response.location;

    map.setCenter(loc);
    map.setZoom(15);
});


function getInfoWindow( hotel ) {
    const info_window = document.createElement('div');
    info_window.classList.add('info_window');
    
    const name = document.createElement('h4');
    name.innerText = hotel.name;
    const number = document.createElement('p');
    number.innerText = hotel.number;
    const email = document.createElement('p');
    email.innerText = hotel.email;
    const address = document.createElement('p');
    address.innerText = hotel.address;
    const button = document.createElement('a');
    button.classList.add('btn', 'btn-primary');
    button.setAttribute('href', '#');
    button.innerText = 'Book now'

    info_window.append(name, number, email, address, button);
    return new google.maps.InfoWindow({
        content: info_window,
    });;
}


async function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 3.1390, lng: 101.6869 },
        zoom: 8,
    });

    const locationButton = document.createElement('button');
    locationButton.textContent = "Current Location";
    locationButton.classList.add("custom-map-control-button", "btn", "btn-primary");
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);

    //===================================
    // Button to move to current location
    //===================================
    locationButton.addEventListener('click', ()=> {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition( (position)=> {
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                map.setCenter(pos);
                map.setZoom(15);
            });
        } else {
            window.alert("Browser doesn't support Geolocation. Type in your address instead!")
        }
    });


    //==========================
    // Fetch the list of hotels
    //==========================
    let hotels = await fetch('/api/get_hotels');
    hotels = await hotels.json();

    if (hotels.error)
        window.alert("Failed to fetch list of hotels\n" + hotels.error);

    hotels.forEach((hotel)=> {
        const infoWindow = getInfoWindow(hotel);
        const loc = hotel.loc;

        const marker = new google.maps.Marker({
            position: loc,
            map,
            title: hotel.name,
        });
        marker.addListener('click', ()=> {
            infoWindow.open({
                anchor: marker,
                map
            });
        });
    }); 
}
