// latitude
var lat;
// longitude
var lng;

let latTrunc;
let lngTrunc;
// prevents CORS errors
const proxyurl = "https://cors-anywhere.herokuapp.com/";



$(document).ready(function () {
  // checks if they are on a modern-enough system to pull their location (probably)
  if (navigator.geolocation) {
    // pulls location
    navigator.geolocation.getCurrentPosition(function (position) {
      // console.log(position)
      lat = position.coords.latitude;
      lng = position.coords.longitude;

      latTrunc = parseFloat(lat.toFixed(5))
      lngTrunc = parseFloat(lng.toFixed(5))


    },
      // if they refuse permission
      function (error) {
        if (error.code == error.PERMISSION_DENIED)
          console.log("No automatic location provided");
      });
  }
});



function zipSearch() {
  const zipCode = $(".zipCode").val();
  $.ajax({
    url: proxyurl + `http://api.zip-codes.com/ZipCodesAPI.svc/1.0/QuickGetZipCodeDetails/${zipCode}?key=OLFMPABGVZQOZN3XNPZ4`,
    method: "GET"
  }).then(function (response) {
    console.log(response)
    lat = response.Latitude;
    lng = response.Longitude;
    // latTrunc = parseFloat(lat.toFixed(5))
    // lngTrunc = parseFloat(lng.toFixed(5))
    mapRestaraunts();
    displayRestaraunts();

  })

}

const mapRestaraunts = () => {
  let searchWord = $('.searchField').val().trim()
  $('#googleMaps').empty()
  $('#googleMaps').addClass("mapScreen")
  $.ajax({
    url: proxyurl + `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=4500&type=restaurant&keyword=${searchWord}&key=AIzaSyCZf9WYU3syTaCtYpejBUknJB-3Z3htO6s`,
    method: 'GET'
  }).then(function (response) {
    var results = response.results
    for (let i = 0; i < results.length; i++) {
      lat = parseFloat(lat)
      lng = parseFloat(lng)
      initMap(results[i].name)
    }
  })
}




// This function creates the list section using Places API

const displayRestaraunts = () => {
  let searchWord = $('.searchField').val().trim()
  searchWord = searchWord.toLowerCase();
  $('#map').empty()
  $.ajax({
    url: proxyurl + `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5200&type=restaurant&keyword=${searchWord}&key=AIzaSyCZf9WYU3syTaCtYpejBUknJB-3Z3htO6s`,
    method: 'GET'
  }).then(function (response) {
    var results = response.results
    for (let i = 0; i < results.length; i++) {
      var name = results[i].name
      var address = results[i].vicinity
      var price_level = results[i].price_level
      var rating = results[i].rating
      $infoDiv = $('<div>')
      $infoDiv.addClass("card card-text text-center bordered border-2 border-dark mb-3 pt-2 pb-2")
      $infoDiv.attr({
        id: 'infoDiv'
      })
      $nameDiv = $('<div>').text(name)
      $addressDiv = $('<div>').text(address)
      $price_levelDiv = $('<div>').text("Price Level: " + price_level)
      $ratingDiv = $('<div>').text("Rating: " + rating + " / 5")    
      $infoDiv.append($nameDiv, $addressDiv, $price_levelDiv, $ratingDiv)
      $infoDiv.attr({
        id: "infoDiv"
      })
      $('#map').append($infoDiv)
    }
  })
}


// variables needed for the map
var map;
var service;
var infowindow;

// map initialization function
function initMap(searchWord) {
  infowindow = new google.maps.InfoWindow();
  map = new google.maps.Map(
    document.getElementById('googleMaps'), { center: { lat, lng }, zoom: 13 }
  );
  var request = {
    query: `${searchWord}`,
    fields: ['name', 'geometry'],
  };

  // call to PlacesService Library with searchword 
  service = new google.maps.places.PlacesService(map);
  service.findPlaceFromQuery(request, function (results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        createMarker(results[i]);
      }
      map.setCenter(results[0].geometry.location);
    }
  });
}
// creates marker on map by given name of place
function createMarker(place) {
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });
  google.maps.event.addListener(marker, 'click', function () {
    infowindow.setContent(place.name);
    infowindow.open(map, this);
  });
}

// Toggle between list and map
$('#map').hide()
$('#googleMaps').show()

$('#toggleList').on('click', function () {
  $('#googleMaps').hide();
  $('#map').show();
})
$('#toggleMap').on('click', function () {
  $('#googleMaps').show();
  $('#map').hide();
})