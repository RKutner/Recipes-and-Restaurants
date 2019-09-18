// latitude
var lat;
// longitude
var lng;

$(document).ready(function () {
  // checks if they are on a modern-enough system to pull their location (probably)
  if (navigator.geolocation) {
    // pulls location
    navigator.geolocation.getCurrentPosition(function (position) {
      // assigns latitude and longitude to lat and lng
      lat=position.coords.latitude;
      lng=position.coords.longitude;
      latTrunc=lat.toFixed(5)
      lngTrunc=lng.toFixed(5)


    })} else{
      // need to prompt for zip code
      // 
    }

});


const proxyurl = "https://cors-anywhere.herokuapp.com/";
  function zipSearch(){
  var zipForSearch=$("#zipCode").val();
    $.ajax({
  url: proxyurl+ `http://api.zip-codes.com/ZipCodesAPI.svc/1.0/QuickGetZipCodeDetails/${zipForSearch}?key=OLFMPABGVZQOZN3XNPZ4`,
  method:"GET"
    }).then(function(response){
      console.log(response);
  
    })
  
  }
  if ($(("#zipCode").val!==""));{
    zipSearch()
  }
const displayRestaraunts = () => {
  let searchWord = $('.searchField').val().trim()
  $('#googleMaps').empty()
  $.ajax({
    url: proxyurl + `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=1500&type=restaurant&keyword=${searchWord}&key=AIzaSyC5MbQE-0lUqvgXhxVRhDCK05t0nvMrphM`,
    method: 'GET'
  }).then(function(response){
    var results = response.results
    for (let i = 0; i < results.length; i++){
    var name = results[i].name
    console.log(results)
    var address = results[i].vicinity
    var price_level = results[i].price_level
    var rating = results[i].rating

    $infoDiv = $('<div>')
    $infoDiv.addClass("card card-text text-center bordered border-2 border-dark mb-3 pt-2 pb-2")
    $nameDiv = $('<div>')
    $linkDiv = $('<div>')
    $addressDiv = $('<div>')   
    $price_levelDiv = $('<div>')
    $ratingDiv = $('<div>')
    $ratingDiv.text("Rating: " + rating +" / 5")
    
    $nameDiv.text(name)
    $addressDiv.text(address)
    $price_levelDiv.text("Price Level: " + price_level)
    $infoDiv.append($nameDiv, $addressDiv, $price_levelDiv, $ratingDiv)
    $('#googleMaps').append($infoDiv)
    }
  })
}

  displayRestaraunts()

