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

$(document).ready(function(){

    $('#route').hide();

    pullLocations();

    $('#pub-locations').on("change",function(){
        pullRoutes($('#pub-locations:selected').text());
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

    // Add custom map controls to the map
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(document.getElementById('controls-select-container'));

    /*
     * LISTENERS
     */
}