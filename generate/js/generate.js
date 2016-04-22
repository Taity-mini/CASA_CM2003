/*
 * Generate Route script
 * This takes in the location, number of pubs, and the name of the route (for use in FireBase)
 * this well then generate a random crawl based on this information
 */
var map;
var infowindow;
var waypoints = [];
//var place;

$(document).ready(function(){

    $('#route').hide();

    //Add number of pubs to the dropdown
    populateNumPubs(20);

    $('.pub-list').sortable();
    $('.pub-list').disableSelection();

    //when the route is clicked show the route area(the area with the map and list of pubs)
    $('#route-submit').on("click",function(){
        $('#route').show();

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
* Clear all of the waypoints of the map and clear the pub list
* */
function clearRoute(){
    for (var i = 0; i < waypoints.length; i++) {
        waypoints[i].setMap(null);
    }
    waypoints = [];
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

function createMarker(place) {
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
        //stopover: true
    });

    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent("<p>" + place.name + "<br/>Place ID: " + place.place_id + "<br/>Rating: " + place.rating + "<br/>" + marker.position +"</p>");
        infowindow.open(map, this);
    });

    waypoints.push(marker);
}

/*
* Search for pubs around a specific area
* takes in the place you'd like to search and the number of pubs that you would like
* */
function searchRadius(place,numPubs){
    clearRoute();
    infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
        location: place,
        radius: 1000,
        types: ['bar']//night_club
    }, function(response, status){
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < numPubs; i++) {
                createMarker(response[i]);
                $('#route-list').append('<li>' + response[i].name + '</li>');
            }
            map.setCenter(place);
            map.setZoom(14);
        }
        else{
            console.log("Nearby search failed");
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
    var input = document.getElementById('location-search');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);


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