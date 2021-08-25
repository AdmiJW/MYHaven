const header = document.querySelector('nav');
header.classList.add('bg-visible');

const form = document.querySelector('.form');
const type_field = document.querySelector('.form__type');
const name_field = document.querySelector('.form__name');
const number_field = document.querySelector('.form__number');
const email_field = document.querySelector('.form__email');
const address_field = document.querySelector('.form__address');
const search_btn = document.querySelector('.form__button');

// Google Map
let map = null;
let marker = null;
let latlng = null;


function clearMarker() {
    if (!marker) return;
    marker.setMap(null);
}

//========================================
// Pinpoint location by searching address
//========================================
search_btn.addEventListener('click', async (e)=> {
    const addr = address_field.value;

    let response = await (await fetch(`/api/geocode?addr=${addr}`) ).json();
    if (response.error) 
        return window.alert("Unable to find provided address");
    
    const loc = response.location;

    response = await (await fetch(`/api/rev_geocode?latlng=${loc.lat},${loc.lng}`)).json();
    if (response.error) 
        return window.alert("Unable to fetch human readable address of current location.");
    else
        address_field.value = response.addr;

    clearMarker();
    map.setCenter(loc);
    map.setZoom(15);
    marker = new google.maps.Marker({
        position: loc,
        map: map
    });
    latlng = loc;
});


function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 3.1390, lng: 101.6869 },
        zoom: 8,
    });

    //=============================================
    // Locate Current Location using the button
    //=============================================
    const locationButton = document.createElement('button');
    locationButton.setAttribute('type', 'button');
    locationButton.textContent = "Current Location";
    locationButton.classList.add("custom-map-control-button", "btn", "btn-primary");
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
    
    locationButton.addEventListener('click', ()=> {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition( async (position)=> {
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                map.setCenter(pos);
                map.setZoom(15);

                // Fetch Human Readable Address
                const response = await (await fetch(`/api/rev_geocode?latlng=${pos.lat},${pos.lng}`)).json();
                if (response.error) 
                    return window.alert("Unable to fetch human readable address of current location.");
                else
                    address_field.value = response.addr;

                clearMarker();
                marker = new google.maps.Marker({
                    position: pos,
                    map: map
                });
                latlng = pos;
            });
        } else {
            window.alert("Browser doesn't support Geolocation. Try typing in your address and search instead!")
        }
    });

    //=============================================
    // Locate Current Location by clicking
    //=============================================
    map.addListener('click', async (e)=> {
        const loc = e.latLng;


        const response = await (await fetch(`/api/rev_geocode?latlng=${loc.lat()},${loc.lng()}`) ).json();
        if (response.error) 
            return window.alert("Unable to fetch human readable address of pinpointed location.");
        else
            address_field.value = response.addr;

        clearMarker();
        map.setCenter(loc);
        map.setZoom(15);
        marker = new google.maps.Marker({
            position: loc,
            map: map
        });
        latlng = { lat: loc.lat(), lng: loc.lng() };
    });
}


//=================================
// Form Submit
//=================================
form.addEventListener('submit', async (e)=> {
    e.preventDefault();

    if (!latlng)
        return window.alert("No location pinned on map! If you typed in the address, make sure you click the 'Search' button!")

    const post_body = {
        name: name_field.value,
        number: number_field.value,
        email: email_field.value,
        address: address_field.value,
        loc: latlng
    }
    
    let response = await fetch('/api/add_hotel', {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(post_body)
    });
    response = await response.json();

    if (response.error)
        return window.alert("Failed to submit application\n" + response.error);

    window.alert("Application submitted");
});