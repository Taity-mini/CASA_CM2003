/*
 * View Previous Route script
 *
 *
 */
var map;
var infowindow;
var markers = [];
var directionsService;
var directionsDisplay;

var casaDataRef = new Firebase('https://casa-pubcrawl.firebaseio.com/routes'); //Live site

$(document).ready(function(){

    $('#route').hide();

    pullLocations();

    $('#pub-locations').change(function(){
        clearRoute();
        pullRoutes($('#pub-locations option:selected').text());
    });

    $('#pub-routes').change(function(){
        clearRoute();
        pullRouteInfo();
    });

});


/*
 * Gets locations from firebase to fill the location combo box
 * */
function pullLocations() {

    var locations = [];

    casaDataRef.once("value", function(snapshot) {

        snapshot.forEach(function (childSnapshot) {

            var routeData = childSnapshot.val();
            var routeKey = childSnapshot.key();

            var loc = locations.indexOf(routeData.crawlLocation);

            if(locations[loc] !== routeData.crawlLocation){
                locations.push(routeData.crawlLocation);
                $('#pub-locations').append('<option value="' + routeData.crawlLocation + '">' + routeData.crawlLocation + '</option>');
            }

        });
        pullRoutes();
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

}

/*
 * Gets routes from firebase to fill the routes combo box
 * */
function pullRoutes() {

    $('#pub-routes').empty();

    var location =  $('#pub-locations option:selected').text();

    casaDataRef.once("value", function(snapshot) {

        snapshot.forEach(function (childSnapshot) {

            var routeData = childSnapshot.val();
            var routeKey = childSnapshot.key();

            if(location == routeData.crawlLocation){
                $('#pub-routes').append('<option value="' + routeKey + '">' + routeData.crawlName + '</option>');
            }

        });
        pullRouteInfo();
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
}

/*
* Get the crawl information for displaying below the map
* */
function pullRouteInfo(){

    directionsService = new google.maps.DirectionsService;
    directionsDisplay = new google.maps.DirectionsRenderer({map: map});

    casaDataRef.once("value", function(snapshot) {
        var crawl = snapshot.child($('#pub-routes').val()).val();

        $('#crawl-name').html(crawl.crawlName);

        if(crawl.rating){
            $('#crawl-rating').html();
        }
        else{
            $('#crawl-rating').html("No Rating");
        }
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

    casaDataRef.child($('#pub-routes').val()).child('waypoints').on('value', function (snapshot) {
        snapshot.forEach(function(childSnapshot) {

            var data = childSnapshot.exportVal();
            //rebuild location
            var lat = data.lat;
            var lng =  data.lng;
            var location = new google.maps.LatLng(+lat, +lng); //convert lat + lng into location
            var stopover = data.stopover;
            var name = data.PubName;
            //console.log("Data:" + data +"Lat: " + lat + "lng" + lat + "Location:" + location);
            //add marker details to marker array
            markers.push({
                location: location,
                stopover: stopover
            });
            // placesNames.push({
            //     pubName: name
            // })
            console.log("Inside snapshot: " +markers);
        });
        /*Crawl Waypoints Fetch from firebase ENDS*/
        console.log("outside snapshot: " +markers);

        calculateAndDisplayRoute(directionsDisplay, directionsService);
        google.maps.event.trigger(map, 'resize');

    });
}

/*
 * Google maps
 * */
function initMap() {

    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 0, lng: 0},
        zoom: 2,
        fullscreenControl: true
    });

    // Add custom map controls to the map
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(document.getElementById('controls-select-container'));
}