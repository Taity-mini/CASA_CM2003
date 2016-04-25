/**
 * Created by Craig Robertson on 19/04/2016.
 */

var casaDataRef = new Firebase('https://casa-pubcrawl.firebaseio.com/routes'); //Live site
//var casaDataRef = new Firebase('https://pub-crawl.firebaseio.com/routes'); //Local Dev
var crawlName = "";
var crawlLocation = "";
var crawlURL = "";
var crawlRating = '*';
var newKey;
var mapCenter;

console.log("Name: "+ crawlName + "location: " + crawlLocation +"crawlURL");

$(document).ready(function(){
    $('#start-route').on("click", function()
    {
        push();
        //$(location).attr('href', './display/?id=' + newKey)
         window.location.replace ('../display/?id=' + newKey);
        //console.log("Name: "+ crawlName + "location: " + crawlLocation +"crawlURL: " + crawlURL + "Key: " + newKey);
    });
});


function push(){
    crawlName = $('.crawlname').val();
    crawlLocation = $('#location-search').val();
    mapCenter = markers[0].location;
    var newPush = casaDataRef.push({ crawlName: crawlName, crawlLocation: crawlLocation});
    newKey = newPush.key();
    //Get waypoints and store in firebase
    for (i = 0; i < waypoints.length; i++) {

        casaDataRef.child(newKey).child('waypoints').child(i).set({lat: waypoints[i].location.lat(),lng:waypoints[i].location.lng(), stopover: waypoints[i].stopover});
    }

    console.log(newPush);
    console.log(newKey);
}

function update(){

}

function pull(){

}