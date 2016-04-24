/**
 * Created by Andrew on 16/04/2016.
 * Display Map Javascript file
 * CASA - Pub Crawl Web app
 */


//Global variables
var map;
var crawlName;
var crawlLocation;
var fireBaseID; //Firebase push ID
//var casaDataRef = new Firebase('https://casa-pubcrawl.firebaseio.com/routes'); //Live site
var casaDataRef = new Firebase('https://pub-crawl.firebaseio.com/routes'); //Local Dev
var markers = [];
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
setup();

function setup()
{
    fireBaseID = GetURLParameter("id");
    getFireBaseDB(fireBaseID);
}



//Get unique ID from URL to access firebase DB
function getFireBaseDB(ID)
{
    casaDataRef.child(ID).once("value", function(snapshot) {
        //Crawl Info stuff STARTS
        var nameSnapshot = snapshot.child("crawlName");
        crawlName  = nameSnapshot.val();
        var locationSnapShot = snapshot.child("crawlLocation");
        crawlLocation = locationSnapShot.val();


        $(".crawlname").html(crawlName);
        $(".crawlLocation").html(crawlLocation);
        //Crawl Info stuff ENDS



        //Now get all markers/waypoints
        casaDataRef.child(ID).child('waypoints').on('value', function (snapshot) {
            snapshot.forEach(function(childSnapshot) {
                var data = childSnapshot.exportVal();
                //rebuild location
                var lat = data.lat;
                var lng =  data.lng;
                var location = new google.maps.LatLng(+lat, +lng); //convert lat + lng into location
                var stopover = data.stopover;
                //console.log("Data:" + data +"Lat: " + lat + "lng" + lat + "Location:" + location);
                //add marker details to marker array
                markers.push({
                    location: location,
                    stopover: stopover
                });

            });
            //Now draw route again..
            calculateAndDisplayRoute(directionsDisplay, directionsService, markers);
        });
    });

    console.log("Route Complete");
}


    function initMap() {
        console.log(markers);
        //var myLatlng = new google.maps.LatLng(+Latitude, +Longitude);
        var myCenter;
        var myOptions = {
            center: {lat: 0, lng: 0},
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


        map = new google.maps.Map(document.getElementById('map'), myOptions);
        directionsService = new google.maps.DirectionsService;
        directionsDisplay = new google.maps.DirectionsRenderer({map: map});

        //console.log(path);

        //Markers
        //Marker Icon
        var icon = {
            url: "../img/bar.png", // url
            size: new google.maps.Size(32, 37), // size
            origin: new google.maps.Point(0, 0), // origin
            anchor: new google.maps.Point(0, 0) // anchor
        };


        map.controls[google.maps.ControlPosition.TOP_LEFT].push(document.getElementById('pubArrived'));
        map.controls[google.maps.ControlPosition.TOP_RIGHT].push(document.getElementById('pubNext'));
    }


function calculateAndDisplayRoute(directionsDisplay, directionsService, markers) {

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
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
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

