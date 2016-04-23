/**
 * Created by Andrew on 16/04/2016.
 * Display Map Javascript file
 * CASA - Pub Crawl Web app
 */


//Global variables
var map;
var Latitude = 0; //Latitude
var Longitude = 0; //Longitiude
var crawlName;
var crawlLocation;
var fireBaseID; //Firebase push ID
var casaDataRef = new Firebase('https://casa-pubcrawl.firebaseio.com/routes');

/*
* Current URL Structure:
* index.html?lat=57.149717&lng=-2.094278&name=pub- gives you aberdeen + crawl name
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



fireBaseID = GetURLParameter("id");
Latitude = GetURLParameter("lat");
Longitude = GetURLParameter("lng");
crawlName =  GetURLParameter("name");
//Set crawl name to span and ratings box
getFireBaseDB(fireBaseID);
$(document).ready(function(){


    console.log("argument name=" +crawlName+" and location =" + crawlLocation + "url:" + fireBaseID);
});



//Get unique ID from URL to access firebase DB
function getFireBaseDB(ID)
{
    casaDataRef.child(ID).once("value", function(snapshot) {
        var nameSnapshot = snapshot.child("crawlName");
        crawlName  = nameSnapshot.val();
        // name === { first: "Fred", last: "Flintstone"}
        var locationSnapShot = snapshot.child("crawlLocation");
        crawlLocation = locationSnapShot.val();
        // firstName === "Fred"
        $(".crawlname").html(crawlName);
        $(".crawlLocation").html(crawlLocation);
    });
}

function getLocationDetails(location)
{

}


//Decoding URL poly url string
var decodedPath = google.maps.geometry.encoding.decodePath(encodedPolyline);
var decodedLevels = decodeLevels(encodedLevels);

// Decode an encoded levels string into an array of levels.
function decodeLevels(encodedLevelsString) {
    var decodedLevels = [];

    for (var i = 0; i < encodedLevelsString.length; ++i) {
        var level = encodedLevelsString.charCodeAt(i) - 63;
        decodedLevels.push(level);
    }
    return decodedLevels;
}

console.log("argument name=" +Latitude+" and value =" + Longitude);
function initMap() {
    var myLatlng = new google.maps.LatLng(+Latitude, +Longitude);
    console.log("Center=" + myLatlng);
    var myOptions = {
        center: myLatlng,
        zoom: 14,
        styles: [{
            featureType: 'poi',
            stylers: [{visibility: 'off'}]  // Turn off points of interest.
        }, {
            featureType: 'transit.station',
            stylers: [{visibility: 'off'}]  // Turn off bus stations, train stations, etc.
        }],
        disableDoubleClickZoom: true
    }

    //set radius around route
    var myRoute = new google.maps.Circle({
        center: myLatlng,
        radius: 500,
        strokeColor: "#0000FF",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#0000FF",
        fillOpacity: 0.4
    });

    //Markers
    //Marker Icon
    var icon = {
        url: "../img/bar.png", // url
        size: new google.maps.Size(32, 37), // size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
    };

    //Markers (will eventually be an array of them
    var marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        icon: icon,
        title: "Some pub"
    });
    //Finally create map and add everything together:+
    map = new google.maps.Map(document.getElementById('map'), myOptions);
    myRoute.setMap(map);
    marker.setMap(map);
}



//Ratings Box Popup
function toggle_visibility(id) {
    var e = document.getElementById(id);
   // $("#crawlrating").html(crawlName);

    if(e.style.display == 'block')
        e.style.display = 'none';
    else
        e.style.display = 'block';
        //$(e).children.("span").innerHTML(crawlName);
        $(".crawlname").html(crawlName);
}