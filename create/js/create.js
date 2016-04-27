/*
 * Create Route script
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

    //when the route is clicked show the route area(the area with the map and list of pubs)
    $('#route-submit').on("click",function(){

        //Need to resize the map again otherwise when #route is shown it is blank
        google.maps.event.trigger(map, 'resize');

        var numPubs = $('#num-pubs').val();
        var place = map.getCenter();
        //var place = {lat: 57.146904, lng:-2.097521};
        //var place = map.position;
        searchRadius(place,numPubs);

    });

    $('#route-reset').on("click",function(){
        clearRoute();
        $('#route').hide();
    });
});


/*
 * Clear all of the markers of the map and clear the pub list
 * */
function clearRoute(){
    if(typeof directionsDisplay !== 'undefined'){
        directionsDisplay.setMap(null);
    }
    markers = [];
    $('#route-list').empty();
}

function calculateAndDisplayRoute(directionsDisplay, directionsService) {
    //first copy markers to waypoints array
    waypoints = [];
    waypoints = jQuery.extend([], markers);
    //set the start and end location of the route based on the markers
    var start = markers[0].location;
    var end = markers[markers.length-1].location;

    //remove the first and last locations for using the rest as waypoints
    markers.shift();
    markers.pop();

    // Retrieve the start and end locations and create a DirectionsRequest using
    // WALKING directions.
    directionsService.route({
        origin: start,
        destination: end,
        waypoints: markers,
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.WALKING
    }, function(response, status) {
        // Route the directions and pass the response to a function to create
        // markers for each step.
        if (status === google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
            window.location.hash = 'route';
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}




/*
 * Search for pubs around a specific area
 * takes in the place you'd like to search and the number of pubs that you would like
 * */
function searchRadius(place,numPubs){
    clearRoute();
    infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);

    directionsService = new google.maps.DirectionsService;
    directionsDisplay = new google.maps.DirectionsRenderer({map: map});

    service.nearbySearch({
        location: place,
        radius: 5000,
        types: ['bar']//night_club
    }, function(response, status){
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < numPubs; i++) {

                // markers.push({
                //     location: response[i].geometry.location,
                //     stopover: true
                // });

                addMarker(response[i].geometry.location, map);

                $('#route-list').append('<li>' + response[i].name + '</li>');
                $('#route').show();
            }
            map.setCenter(place);
            map.setZoom(13);
            calculateAndDisplayRoute(directionsDisplay, directionsService);
        }
        else{
            window.alert("Nearby search failed");
            $('#route').hide();
        }
    });
}



// Adds a marker to the map.
function addMarker(location, map) {
    // Add the marker at the clicked location, and add the next-available label
    // from the array of alphabetical characters.
    var marker = new google.maps.Marker({
        position: location,
        // label: labels[labelIndex++ % labels.length],
        map: map
    });
}


/*
 * Google maps
 * */
function initMap() {

    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 0, lng: 0},
        zoom: 2,
        // mapTypeControl: false,
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

    // This event listener calls addMarker() when the map is clicked.
    // map.addListener('click', function(event) {
    //     addMarker(event.latLng, map);
    // });

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