/*
 * Generate Route script
 * This takes in the location, number of pubs, and the name of the route (for use in FireBase)
 * this well then generate a random crawl based on this information
 */
var map;
var infowindow;
var markers = [];
var directionsService;
var directionsDisplay;
var waypoints;

$(document).ready(function(){

    $('#route').hide();

    //Add number of pubs to the dropdown
    populateNumPubs(10);// max can only be 10 due to the directions request maximum waypoints being 8
    
    // $('.pub-list').sortable();
    // $('.pub-list').disableSelection();

    //when the route is clicked show the route area(the area with the map and list of pubs)
    $('#route-submit').on("click",function(){

        //Need to resize the map again otherwise when #route is shown it is blank
        google.maps.event.trigger(map, 'resize');

        var numPubs = $('#num-pubs').val();
        var place = map.getCenter();
        //var place = {lat: 57.146904, lng:-2.097521};
        //var place = map.position;
        searchRadius(place,numPubs,2000,false);

    });

    $('#route-reset').on("click",function(){
        clearRoute();
        $('#route').hide();
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
    map.controls[google.maps.ControlPosition.LEFT_TOP].push(document.getElementById('num-pubs-container'));
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