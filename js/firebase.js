/**
 * Created by Craig Robertson on 19/04/2016.
 */

var casaDataRef = new Firebase('https://pub-crawl.firebaseio.com/');
var crawlName;
var crawlLocation;
var crawlURL = "";
var crawlRating = '*';
var newKey;

console.log("Name "+crawlName + "location" + crawlLocation +"crawlURL");

$(document).ready(function(){
    $('#start-route').on("click", function()
    {
        push();
        //$(location).attr('href', './display/?id=' + newKey)
        window.location.replace ('../display/?id=' + newKey);
    });
});


function push(){
    crawlName = $('.crawlname').val();
    crawlLocation = $('#location-search').val();

    var newPush = casaDataRef.child('routes').push({crawlName: crawlName, crawlLocation: crawlLocation, crawlURL: crawlURL});
    newKey = newPush.key();
    console.log(newPush);
    console.log(newKey);
}

function update(){

}

function pull(){

}