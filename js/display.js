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
var crawlURL;

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

//Set crawl name to span and ratings box
getFireBaseDB(fireBaseID);
$(document).ready(function(){


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
        var latSnapShot = snapshot.child("crawlLat");
        Latitude = latSnapShot.val();
        var lngSnapShot = snapshot.child("crawlLng");
        Longitude= lngSnapShot.val();
        var urlSnapShot = snapshot.child("crawlURL");
        crawlURL = urlSnapShot.val();
        $(".crawlname").html(crawlName);
        $(".crawlLocation").html(crawlLocation);
        console.log("argument name=" +crawlName+" and lat =" + Latitude + "lng" +  Longitude);
    });
}

function getLocationDetails(location)
{

}


function initMap() {
    var myLatlng = new google.maps.LatLng(+Latitude, +Longitude);
    var myCenter;
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


    var bermudaTriangle;

    map = new google.maps.Map(document.getElementById('map'), myOptions);
    //var path = google.maps.geometry.encoding.decodePath(+crawlURL).replace(/\\/g,"\\\\");
    //console.log(path);
    // Construct the polygon
    var poly = (google.maps.geometry.encoding.decodePath(crawlURL));
    var bounds = new google.maps.LatLngBounds();
    var path = poly.getPath();
    path.forEach(function( latlng ) {
        bounds.extend( latlng );
    });
    _map.fitBounds( bounds );

    Console.log(poly + path)

    bermudaTriangle = new google.maps.Polygon({
        paths: google.maps.geometry.encoding.decodePath(crawlURL),
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35
    });

    myCenter= bermudaTriangle.getPath().getAt(Math.round(bermudaTriangle.getPath().getLength() / 2));
    //set radius around route
    var myRoute = new google.maps.Circle({
        center: myCenter,
        radius: 1000,
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

    myRoute.setMap(map);
    marker.setMap(map);

    bermudaTriangle.setMap(map);
    map.setCenter(myCenter);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(document.getElementById('pubArrived'));
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(document.getElementById('pubNext'));
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