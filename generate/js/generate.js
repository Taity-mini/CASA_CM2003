/*
* Generate Route script
* This takes in the location, number of pubs, and the name of the route (for use in FireBase)
* this well then generate a random crawl based on this information
*/
var map;
var infowindow;
var markers = [];

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


function callback(results, status) {
   if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
         createMarker(results[i]);
      }
   }
}

function createMarker(place) {
   var placeLoc = place.geometry.location;
   var marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location
   });

   markers.push(marker);

   google.maps.event.addListener(marker, 'click', function() {
      infowindow.setContent(place.name);
      infowindow.open(map, this);
   });
}

function searchRadius(){
   infowindow = new google.maps.InfoWindow();
   var service = new google.maps.places.PlacesService(map);
   service.nearbySearch({
      location: place,
      radius: 1000,
      type: ['store']
      //rankBy: google.maps.places.RankBy.DISTANCE
   }, callback);
}



/*
* Google maps settings
* */
function initMap() {

   var place = {lat: 51.5074, lng: 0.1278};

   map = new google.maps.Map(document.getElementById('map'), {
      center: place,
      zoom: 13
      //mapTypeId: google.maps.MapTypeId.ROADMAP
   });

   // Create the search box
   var input = document.getElementById('location-search');
   var searchBox = new google.maps.places.SearchBox(input);

   infowindow = new google.maps.InfoWindow();
   var service = new google.maps.places.PlacesService(map);
   service.nearbySearch({
      location: place,
      radius: 1000,
      type: ['store']
      //rankBy: google.maps.places.RankBy.DISTANCE
   }, callback);

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

      // Clear out the old markers.
      markers.forEach(function(marker) {
         marker.setMap(null);
      });
      markers = [];

      // For each place, get the icon, name and location.
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