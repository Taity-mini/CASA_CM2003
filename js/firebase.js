/**
 * Created by Craig Robertson on 19/04/2016.
 */

var casaDataRef = new Firebase('https://casa-pubcrawl.firebaseio.com/routes'); //Live site
//var casaDataRef = new Firebase('https://pub-crawl.firebaseio.com/routes'); //Local Dev

$(document).ready(function(){
    $('#start-form').on('submit',function()
    {
        window.location.replace('../display/?id=' + push());
        return false;
    });
});


function push(){
    var crawlName = $('.crawlname').val();
    var crawlLocation = $('#location-search').val();
    var mapCenter = markers[0].location;
    var newPush = casaDataRef.push({ crawlName: crawlName, crawlLocation: crawlLocation});
    var newKey = newPush.key();
    
    //Get waypoints and store in firebase
    for (i = 0; i < waypoints.length; i++) {

        casaDataRef.child(newKey).child('waypoints').child(i).set({lat: waypoints[i].location.lat(),lng:waypoints[i].location.lng(), stopover: waypoints[i].stopover});
    }

    return newKey;
}

function update(){

}

function pull(){

}