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
var casaDataRef = new Firebase('https://casa-pubcrawl.firebaseio.com/routes'); //Live site
var markers = [];
var directionsService;
var directionsDisplay;
var route;
var placesNames = [];
var defaultCenter;
/*
* Current URL Structure:
*
* ./Display/?id=UNIQUE_FIREBASE_ID - gives you firebase id for route and waypoint info
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
    /*Crawl Information Fetch from firebase STARTS*/
    casaDataRef.child(ID).on("value", function(snapshot) {

        var nameSnapshot = snapshot.child("crawlName");
        crawlName  = nameSnapshot.val();
        var locationSnapShot = snapshot.child("crawlLocation");
        crawlLocation = locationSnapShot.val();

        //Set crawl name and location to info and ratings boxes
        $(".crawlname").html(crawlName);
        $(".crawlLocation").html(crawlLocation);

    });

    /*Crawl Information Fetch from firebase ENDS*/

    /*Crawl Waypoints Fetch from firebase STARTS*/
    casaDataRef.child(ID).child('waypoints').on('value', function (snapshot) {
        snapshot.forEach(function(childSnapshot) {

            var data = childSnapshot.exportVal();
            //rebuild location
            var lat = data.lat;
            var lng =  data.lng;
            var location = new google.maps.LatLng(+lat, +lng); //convert lat + lng into location
            var stopover = data.stopover;
            var name = data.PubName;

            //add marker details to marker array
            markers.push({
                location: location,
                stopover: stopover
            });
            placesNames.push({
                pubName: name
            })
        });
        /*Crawl Waypoints Fetch from firebase ENDS*/
        calculateAndDisplayRoute(directionsDisplay, directionsService);
        google.maps.event.trigger(map, 'resize');

        //Display first pub's tweets
        $("#TweetName").html("Current Pub: "+ placesNames[0].pubName);
        displayTweets(placesNames[0].pubName);

    });
}


function initMap() {
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
        fullscreenControl: true
    };


    map = new google.maps.Map(document.getElementById('map'), myOptions);
    directionsService = new google.maps.DirectionsService;
    directionsDisplay = new google.maps.DirectionsRenderer({map: map});
    geocoder = new google.maps.Geocoder;



    //Markers
    //Marker Icon
    var icon = {
        url: "../img/bar.png", // url
        size: new google.maps.Size(32, 37), // size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
    };


    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(document.getElementById('pubNext'));

    /*Listeners*/

    /*Next pub event */
    var count = 0;
    google.maps.event.addDomListener(document.getElementById("pubNext"), "click", function(ev) {
        $('#pubNext').val("Next Pub");
        var max  = markers.length+ 1;

        if(count <= markers.length)
        {
            if(count == 0)
            {
                defaultCenter =map.getCenter();
            }

            $("#TweetName").html("Current Pub: "+ placesNames[count].pubName);

            displayTweets(placesNames[count].pubName);
            var nextPub = new google.maps.LatLng(+route.legs[count].start_location.lat(), +route.legs[count].start_location.lng());


            map.setCenter(nextPub);
            map.setZoom(16);
            count++;
        }
        else if(count == max)
        {

            map.controls[google.maps.ControlPosition.TOP_RIGHT].pop(document.getElementById('pubNext'));
            toggle_visibility('ratings');
            map.controls[google.maps.ControlPosition.TOP_RIGHT].push(document.getElementById('ratings'));

            $("#TweetName").html("Current Pub: "+ placesNames[count].pubName);

            displayTweets(placesNames[count].pubName)

            var nextPub = new google.maps.LatLng(route.legs[count-1].end_location.lat(), +route.legs[count-1].end_location.lng());
            map.setCenter(nextPub);
            map.setZoom(16);
            count++;
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
}


/*Twitter Display tweets based on place name as keyword*/
function displayTweets(placeName)
{
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            var tweets = JSON.parse(xhttp.responseText);
            var tweetstring = "";
            //Limit tweets by 5 and display in list
            if(tweets.length > 0)
            {
                for (var i = 0; i < 5; i++) {
                    tweetstring += "<blockquote class='tweet'><p>" + tweets[i].name + "</p>";


                    var words = tweets[i].text.split(/\s+/);
                    for (var i=0; i<words.length; i++) {
                        var word = words[i];
                        if (word.substr(0, 7) == 'http://' || word.substr(0, 8) == 'https://') {
                            words[i] = '<a href="'+word+'">'+word+'</a> ';
                        }
                    }
                    var text = words.join(' ');


                    tweetstring += "<p>" + text + "</p></blockquote>";



                }
                document.getElementById("twitter").innerHTML = tweetstring;
            }
            else
            {
                document.getElementById("twitter").innerHTML = "No tweets found for this pub";
            }

        }
    };
    xhttp.open("GET", "http://rgunodeapp.azurewebsites.net/?q="+placeName, true);
    xhttp.send();
}

// Add rating to route on fire base
$(document).ready(function(){
    $('#RatingSubmit').on("click", function()
    {
        addRating();
        window.location.replace('../');
    });
});

function addRating() {
    var rating = $('#Rating').val();

    var ratingRef = casaDataRef.child(fireBaseID);
    casaDataRef.child(fireBaseID).child('ratings').push({crawlRating: rating});

    toggle_visibility('popupBoxTwoPosition');
}
