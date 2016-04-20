/*
* Generate Route script
* This takes in the location, number of pubs, and the name of the route (for use in FireBase)
* this well then generate a random crawl based on this information
*/
var map;
var infowindow;
var markers = [];
var start = "";
var end = "" ;

$(document).ready(function(){

   $('#route-list').hide();

   //Add number of pubs maximum to be 20
   PopulateNumPubs(20);

   //when the route is clicked show the route area(the area with the map and list of pubs)
   $('#route-submit').on("click",function(){
      $('#route-list').show();
      //Need to resize the map again otherwise when #route is shown it is blank
      google.maps.event.trigger(map, 'resize');
   });
});

/*
*  Populate the select tag "num-pubs" with the number of pubs specified
*/
function PopulateNumPubs(numPubs){
   for(i = 1;i<=numPubs;i++){
      $('#num-pubs').append('<option value="' + i + '">' + i +'</option>')
   }
}




function createMarker(place) {
   var marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location,
      stopover: true
   });

   google.maps.event.addListener(marker, 'click', function() {
      infowindow.setContent("<p>" + place.name + "<br/>Place ID: " + place.place_id + "<br/>Rating: " + place.rating + "<br/>" + marker.position +"</p>");
      infowindow.open(map, this);
   });
   markers.push(marker);
}

function searchRadius(place){
   infowindow = new google.maps.InfoWindow();
   var service = new google.maps.places.PlacesService(map);
   service.nearbySearch({
      location: place,
      radius: 1000,
      type: ['bar']
   }, function(response, status){
      if (status === google.maps.places.PlacesServiceStatus.OK) {
         for (var i = 0; i < response.length; i++) {
            createMarker(response[i]);
         }
         //TODO need to set the location of the start and end of the route, can't figure this out
         //start = {lat: response[0].geometry.location.lat(),
         //         lng: response[0].geometry.location.lng()};
         //end = {lat: response[response.length-1].geometry.location.lat(),
         //      lng: response[response.length-1].geometry.location.lng()};
         //start = response[0].place_id;
         //end = response[19].place_id;
         console.log(start);
         console.log(end);
      }
      else{
         console.log("Nearby search failed");
      }
   });
}


function calculateAndDisplayRoute(directionsService, directionsDisplay, place) {

   searchRadius(place);

   start = {lat:57.1468584, lng:-2.0958835000000136};
   end = {lat:57.1445429, lng:-2.1090999000000465};



   directionsService.route({
      origin: start,
      destination: end,
      //waypoints: markers,
      //optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.DRIVING
   }, function(response, status) {
      if (status === google.maps.DirectionsStatus.OK) {
         directionsDisplay.setDirections(response);

      } else {
         console.log('Directions request failed due to ' + status);
      }
      console.log(start);
   });
}




/*
* Google maps settings
* */
function initMap() {

   var place = {lat: 57.146904, lng:-2.097521};

   map = new google.maps.Map(document.getElementById('map'), {
      center: place,
      zoom: 13
      //mapTypeId: google.maps.MapTypeId.ROADMAP
   });

   // Create the search box
   var input = document.getElementById('location-search');
   var searchBox = new google.maps.places.SearchBox(input);


   var directionsService = new google.maps.DirectionsService;
   var directionsDisplay = new google.maps.DirectionsRenderer;

   directionsDisplay.setMap(map);

   calculateAndDisplayRoute(directionsService,directionsDisplay,place);

   /*
   * LISTENERS
   */
   // Bias the SearchBox results towards current map's viewport.
   map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.getBounds());
   });

   // Listen for the event fired when the user selects a prediction and retrieve
   // more details for that place.
   searchBox.addListener('places_changed', function() {
      var places = searchBox.getPlaces();

      if (places.length == 0) {
         return;
      }

      var bounds = new google.maps.LatLngBounds();
      places.forEach(function(place) {
         if (place.geometry.viewport) {
            // Only geocodes have viewport.
            bounds.union(place.geometry.viewport);
         } else {
            bounds.extend(place.geometry.location);
         }
      });
      map.fitBounds(bounds);

   });
}