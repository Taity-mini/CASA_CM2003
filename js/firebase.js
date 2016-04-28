/**
 * Created by Craig Robertson on 19/04/2016.
 */

var casaDataRef = new Firebase('https://casa-pubcrawl.firebaseio.com/routes'); //Live site
//var casaDataRef = new Firebase('https://pub-crawl.firebaseio.com/routes'); //Local Dev

function push(){
    var crawlName = $('.crawlname').val();
    var crawlLocation = $('#location-search').val();
    var mapCenter = markers[0].location;

    var newPush = casaDataRef.push({ crawlName: crawlName, crawlLocation: crawlLocation});
    var newKey = newPush.key();
    
    //Get waypoints and store in firebase
    for (i = 0; i < waypoints.length; i++) {

        casaDataRef.child(newKey).child('waypoints').child(i).set({lat: waypoints[i].location.lat(),lng:waypoints[i].location.lng(), stopover: waypoints[i].stopover, PubName: placeNames[i].pubName});
    }

    return newKey;
}

function update(){

}

function pull(){

}

/*
* Gets locations to fill the location combo box
* */
function pullLocations() {

    var locations = [];

    casaDataRef.once("value", function(snapshot) {

        snapshot.forEach(function (childSnapshot) {

            var routeData = childSnapshot.val();
            var routeKey = childSnapshot.key();

            var loc = locations.indexOf(routeData.crawlLocation);

            if(locations[loc] !== routeData.crawlLocation){
                locations.push(routeData.crawlLocation);
                $('#pub-locations').append('<option value="' + routeData.crawlLocation + '">' + routeData.crawlLocation + '</option>');
            }

        });
        pullRoutes();
        console.log("done");
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

}

function pullRoutes() {

    var routes = [];
    var location =  $('#pub-locations option:selected').text();

    casaDataRef.once("value", function(snapshot) {

        snapshot.forEach(function (childSnapshot) {

            var routeData = childSnapshot.val();
            var routeKey = childSnapshot.key();

            if(location == routeData.crawlLocation){
                $('#pub-routes').append('<option value="' + routeKey + '">' + routeData.crawlName + '</option>');
            }

        });
        pullRoutes();
        console.log("done");
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
}
