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
var bounds;
var encodeString;
$(document).ready(function(){

    $('#route').hide();

    //Add number of pubs to the dropdown
    populateNumPubs(20);

    $('.pub-list').sortable();
    $('.pub-list').disableSelection();

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


/*
 *  Populate the select tag "num-pubs" with the number of pubs specified
 */
function populateNumPubs(pubs) {
    for (i = 1; i <= pubs; i++) {
        //set the default select option to 5
        if(i == 5){
            $('#num-pubs').append('<option value="' + i + '" selected="selected">' + i + '</option>')
        }
        else{
            $('#num-pubs').append('<option value="' + i + '">' + i + '</option>')
        }

    }
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
        radius: 1000,
        types: ['bar']//night_club
    }, function(response, status){
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < numPubs; i++) {
                //createMarker(response[i]);
                var m = markers.push({
                    location: response[i].geometry.location,
                    stopover: true
                });
                

                $('#route-list').append('<li>' + response[i].name + '</li>');
                $('#route').show();
            }
            map.setCenter(place);
            map.setZoom(13);
            calculateAndDisplayRoute(directionsDisplay, directionsService);
        }
        else{
            console.log("Nearby search failed");
            $('#route').hide();
        }
    });
}

function calculateAndDisplayRoute(directionsDisplay, directionsService) {

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
            //Encode all routes in poly line

            var polyline = new google.maps.Polyline({
                path: [],
                strokeColor: '#FF0000',
                strokeWeight: 3
            });
            polyline == null;
            polyline.setMap(null);




            bounds = new google.maps.LatLngBounds();

            var legs = response.routes[0].legs;
            for (i=0;i<legs.length;i++) {
                var steps = legs[i].steps;
                for (j=0;j<steps.length;j++) {
                    var nextSegment = steps[j].path;
                    for (k=0;k<nextSegment.length;k++) {
                        polyline.getPath().push(nextSegment[k]);
                        bounds.extend(nextSegment[k]);
                    }
                }
            }

            directionsDisplay.setDirections(response);
            polyline.setMap(map);

            var path = polyline.getPath();
            // Because path is an MVCArray, we can simply append a new coordinate
            // and it will automatically appear

            // Update the text field to display the polyline encodings
            encodeString = google.maps.geometry.encoding.encodePath(polyline.getPath() ).replace(/\\/g,'\\\\');
            //encodeString = google.maps.geometry.encoding.encodePath(path).replace(/\\/g,"\\\\");
            console.log(polyline);
            console.log("Encoded Polyline" + encodeString);
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}


/*
 * Google maps
 * */
function initMap() {

    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 0, lng: 0},
        zoom: 2

    });

    // Create the location search box
    var searchBox = new google.maps.places.SearchBox(document.getElementById('location-search'));

    // Add custom map controls to the map
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(document.getElementById('location-search'));
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(document.getElementById('num-pubs-container'));
    map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(document.getElementById('route-reset'));
    map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(document.getElementById('route-submit'));

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

        bounds = new google.maps.LatLngBounds();
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