/**
 * Created by Craig Robertson on 19/04/2016.
 */

var casaDataRef = new Firebase('https://casa-pubcrawl.firebaseio.com/routes');
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
    crawlURL = encodeString;
    var latitude =   mapCenter.lat();
    var longitude =  mapCenter.lng();
    console.log("Lat "+ latitude + "lng: " + longitude +"map center " + mapCenter);
    var newPush = casaDataRef.push({ crawlName: crawlName, crawlLocation: crawlLocation, crawlURL: crawlURL, crawlLat: latitude, crawlLng: longitude});
    newKey = newPush.key();
    console.log(newPush);
    console.log(newKey);
}

function update(){

}

function pull(){

}