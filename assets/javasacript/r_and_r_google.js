// latitude
var lat;
// longitude
var lng;
// prevents CORS errors
const proxyurl = "https://cors-anywhere.herokuapp.com/";
let latTrunc;
let lngTrunc;



$(document).ready(function () {
  // checks if they are on a modern-enough system to pull their location (probably)
  if (navigator.geolocation) {
    // pulls location
    navigator.geolocation.getCurrentPosition(function (position) {
      // console.log(position)
      lat = position.coords.latitude;
      lng = position.coords.longitude;
      latTrunc = lat.toFixed(5)
      lngTrunc = lng.toFixed(5)
      console.log(latTrunc);
      console.log(lngTrunc);


      
    },
    // if they refuse permission
    function (error) {
      if (error.code == error.PERMISSION_DENIED)
      console.log("No automatic location provided");
    });
  } 
});

  
  
  function zipSearch() {
    const zipCode = $("#zipCode").val();
      $.ajax({
          url: proxyurl + `http://api.zip-codes.com/ZipCodesAPI.svc/1.0/QuickGetZipCodeDetails/${zipCode}?key=OLFMPABGVZQOZN3XNPZ4`,
          method: "GET"
        }).then(function (response) {
          console.log(response)
          console.log(response.Latitude);
          console.log(response.Longitude);
          lat = response.Latitude;
          lng = response.Longitude;
          console.log(lat);
          console.log(lng);
            latTrunc = parseFloat(lat.toFixed(5))
            lngTrunc = parseFloat(lng.toFixed(5))
            displayRestaraunts()
        
          })
        
        }

const displayRestaraunts = () => {
  let searchWord = $('.searchField').val().trim()
  searchWord = searchWord.toLowerCase();
  $('#googleMaps').empty()
  console.log(latTrunc)
  console.log(lngTrunc)
  $.ajax({
    url: proxyurl + `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latTrunc},${lngTrunc}&radius=1500&type=restaurant&keyword=${searchWord}&key=AIzaSyC5MbQE-0lUqvgXhxVRhDCK05t0nvMrphM`,
    method: 'GET'
  }).then(function (response) {
    var results = response.results

    for (let i = 0; i < 14; i++){
    var name = results[i].name
    // console.log(results)
    var address = results[i].vicinity
    var price_level = results[i].price_level
    var rating = results[i].rating
    var link = results[i].photos[0].html_attributions[0]
    // console.log(link)
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




