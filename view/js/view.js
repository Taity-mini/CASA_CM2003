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

    $('#pub-locations').on("change",function(){
        pullRoutes($('#pub-locations option:selected').text());
    });

});


/*
 * Gets locations to fill the location combo box
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
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
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

    /*
     * LISTENERS
     */
}