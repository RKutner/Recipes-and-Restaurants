// i know i'm on the right path here, but it's commented out until it's working.
// // latitude
// var lat;
// // longitude
// var lng;

// $(document).ready(function () {
//   // checks if they are on a modern-enough system to pull their location (probably)
//   if (navigator.geolocation) {
//     // pulls location
//     navigator.geolocation.getCurrentPosition(function (position) {
//       // assigns latitude and longitude to lat and lng
//       lat=position.coords.latitude;
//       lng=position.coords.longitude;
//       console.log(lat);
//       console.log(lng);


//     })} else{
//       // need to prompt for zip code
//       console.log("geolocation is not supported")
//       // 
//     }

// });




const proxyurl = "https://cors-anywhere.herokuapp.com/";

$('.searchClick').on('click', function(event){
  event.preventDefault();
  let searchWord = $('.searchField').val().trim()


  const displayRestaraunts = () => {
    if (navigator.geolocation) {
      // pulls location
      navigator.geolocation.getCurrentPosition(function (position) {
        // assigns latitude and longitude to lat and lng
        lat=position.coords.latitude;
        lng=position.coords.longitude;
        console.log(lat);
        console.log(lng);
  
  
      })} else{
        // need to prompt for zip code
        console.log("geolocation is not supported")
        // 
      }  
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
      $infoDiv.addClass("card card-text text-center bordered")
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
  })
