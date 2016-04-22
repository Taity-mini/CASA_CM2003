/**
 * Created by Craig Robertson on 19/04/2016.
 */

var casaDataRef = new Firebase('https://casa-pubcrawl.firebaseio.com/');
var crawlName = $('.crawlname').val();
var crawlLocation = $('#location-search').val();
var crawlURL = "";
var crawlRating = '*';
$(document).ready(function(){
$('#start-route').on("click", function(){push()})});

function push(){
    var newPush = casaDataRef.push({crawlName: crawlName, crawlLocation: crawlLocation, crawlURL: crawlURL});
    var newKey = newPush.key();
    window.location = '/display/?id=' + newKey;

}

function update(){

}

function pull(){

}