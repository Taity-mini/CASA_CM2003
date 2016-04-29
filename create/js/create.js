/*
 * Create Route script
 * This takes in the location, number of pubs, and the name of the route (for use in FireBase)
 * this well then generate a random crawl based on this information
 */
var map;
var infowindow;
var markers = []; // used for route waypoints
var findMarkers = []; // used for markers displayed when finding pubs
var directionsService;
var directionsDisplay;

$(document).ready(function(){

    $('#route').hide();
    
    $('#route-find').on("click",function(){
        var place = map.getCenter();
        searchRadius(place,20,2000,true);
    });
    
    $('#route-clear').on("click",function(){
        clearRoute();
    });

    $('#start-form').on('submit',function()
    {
        window.location.replace('../display/?id=' + push());
        return false;
    });
});

/*
 * Google maps
 * */
function initMap() {

    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 0, lng: 0},
        zoom: 2,
        fullscreenControl: true
    });

    // Create the location search box
    var searchBox = new google.maps.places.SearchBox(document.getElementById('location-search'));

    // Add custom map controls to the map
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(document.getElementById('location-search'));
    map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(document.getElementById('controls-buttons-container'));

    /*
     * LISTENERS
     */

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
    });

    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }

        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });
}