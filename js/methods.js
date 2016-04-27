var waypoints;
/*
 * Clear all of the markers of the map and clear the pub list
 * */
function clearRoute(){
    if(typeof directionsDisplay !== 'undefined'){
        directionsDisplay.setMap(null);
    }
    if(typeof findMarkers != 'undefined'){
        for(i = 0;i<findMarkers.length;i++){
            findMarkers[i].setMap(null);
        }
        findMarkers = [];
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
function searchRadius(place,numPubs,radius,mapMarkers){
    clearRoute();
    infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);

    directionsService = new google.maps.DirectionsService;
    directionsDisplay = new google.maps.DirectionsRenderer({map: map});

    service.nearbySearch({
        location: place,
        radius: radius,
        types: ['bar']//night_club
    }, function(response, status){
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < numPubs; i++) {

                if(mapMarkers == true) {
                    addMarker(response[i].geometry.location, map, response[i]);
                    // markers.push({
                    //     location: response[i].geometry.location,
                    //     stopover: true,
                    //     name: response[i].name
                    // });
                }
                else{
                    markers.push({
                        location: response[i].geometry.location,
                        stopover: true
                    });

                    $('#route-list').append('<li>' + response[i].name + '</li>');
                    $('#route').show();
                }

            }
            map.setCenter(place);
            map.setZoom(13);
            if(mapMarkers == false) {
                calculateAndDisplayRoute(directionsDisplay, directionsService);
            }
        }
        else{
            window.alert("Nearby search failed");
            $('#route').hide();
        }
    });
}

/*
* 
* */
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

// Adds a marker to the map.
function addMarker(location, map, pub) {

    var marker = new google.maps.Marker({
        position: location,
        map: map,
        title: pub.name
    });

    findMarkers.push(marker);

    // This event listener opens an info window
    marker.addListener('click', function() {
        infowindow.setContent(
            '<b>' + pub.name + '</b></br>'
            +'Rating: ' + pub.rating + '</br>'
            // +'Open Hours: ' + pub.opening_hours[0] + '</br>'
            +'<input class="button button-blackboard" type="button" value="Add Pub" onclick="addPub()">'
        );
        infowindow.open(map, marker);
    });
}

function addPub(){
    markers.push({
        location: response[i].geometry.location,
        stopover: true
    });

    $('#route-list').append('<li>' + response[i].name + '</li>');
    $('#route').show();
}