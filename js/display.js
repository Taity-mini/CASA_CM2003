/**
 * Created by Andrew on 16/04/2016.
 * Display Map Javascript file
 * CASA - Pub Crawl Web app
 */

//get parameters from URl

//Global variables
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
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: +Latitude , lng: +Longitiud},
        zoom: 20,
        styles: [{
            featureType: 'poi',
            stylers: [{ visibility: 'off' }]  // Turn off points of interest.
        }, {
            featureType: 'transit.station',
            stylers: [{ visibility: 'off' }]  // Turn off bus stations, train stations, etc.
        }],
        disableDoubleClickZoom: true
    });
}