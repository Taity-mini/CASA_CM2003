/**
 * Created by Andrew on 16/04/2016.
 * Display Map Javascript file
 * CASA - Pub Crawl Web app
 */


//Global variables
var markers = [];
var map;
var Latitude = 0; //Latitude
var Longitiude = 0; //Longitiude

/*
* Current URL Structure:
* index.html?lat=57.149717&lng=-2.094278- gives you aberdeen..
*
* */

function GetURLParameter(sParam)
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');

    for (var i = 0; i < sURLVariables.length; i++)
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam)

        {
            return sParameterName[1];
        }
    }
}

Latitude = GetURLParameter("lat");
Longitiud = GetURLParameter("lng");

console.log("argument name=" +Latitude+" and value =" + lng);
function initMap() {
    var myLatlng = new google.maps.LatLng(+Latitude, +Longitiude);
    var myOptions = {
        center: {lat: +Latitude , lng: +Longitiud},
        zoom: 15,
        styles: [{
            featureType: 'poi',
            stylers: [{ visibility: 'off' }]  // Turn off points of interest.
        }, {
            featureType: 'transit.station',
            stylers: [{ visibility: 'off' }]  // Turn off bus stations, train stations, etc.
        }],
        disableDoubleClickZoom: true
    }
    map = new google.maps.Map(document.getElementById('map'), myOptions);
}