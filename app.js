L.mapbox.accessToken = 'pk.eyJ1Ijoic3RyaWJib24iLCJhIjoiYmI3NzlmMWIzMTdhNDQyYTk2YTAzNjdiZDViYTIxZjQifQ.CG-W6rQhNckoNW7t3G8nYw';
var map = L.mapbox.map('map', 'stribbon.ma114cc6');

var myLayer = L.mapbox.featureLayer().addTo(map);
var geolocate = document.getElementById('geolocate');
var filters = document.getElementById('filters');
var checkboxes = document.getElementsByClassName('filter');

function change() {
    // Find all checkboxes that are checked and build a list of their values
    var on = [];
    for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) on.push(checkboxes[i].value);
    }
    // The filter function takes a GeoJSON feature object
    // and returns true to show it or false to hide it.
    map.featureLayer.setFilter(function (f) {
        // check each marker's symbol to see if its value is in the list
        // of symbols that should be on, stored in the 'on' array
        return on.indexOf(f.properties['marker-symbol']) !== -1;
    });
    return false;
}

// When the form is touched, re-filter markers
filters.onchange = change;
// Initially filter the markers
change();

// This uses the HTML5 geolocation API, which is available on
// most mobile browsers and modern browsers, but not in Internet Explorer
//
// See this chart of compatibility for details:
// http://caniuse.com/#feat=geolocation
if (!navigator.geolocation) {
    geolocate.innerHTML = 'Geolocation is not available';
} else {
    geolocate.onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();
        map.locate();
    };
}

// Once we've got a position, zoom and center the map
// on it, and add a single marker.
map.on('locationfound', function(e) {
    map.fitBounds(e.bounds);

    myLayer.setGeoJSON({
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [e.latlng.lng, e.latlng.lat]
        },
        properties: {
            'title': 'Here I am!',
            'marker-color': '#ff8888',
            'marker-symbol': 'star'
        }
    });

    // And hide the geolocation button
    geolocate.parentNode.removeChild(geolocate);
});

// If the user chooses not to allow their location
// to be shared, display an error message.
map.on('locationerror', function() {
    geolocate.innerHTML = 'Position could not be found';
});