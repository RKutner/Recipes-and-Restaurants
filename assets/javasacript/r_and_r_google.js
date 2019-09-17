


const proxyurl = "https://cors-anywhere.herokuapp.com/";
const displayRestaraunts = () => {
  let searchWord = $('.searchField').val().trim()
  $('#googleMaps').empty()
  $.ajax({
    url: proxyurl + `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=37.87158, -122.25992&radius=1500&type=restaurant&keyword=${searchWord}&key=AIzaSyC5MbQE-0lUqvgXhxVRhDCK05t0nvMrphM`,
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

$('.searchClick').on('click', function(event){
  event.preventDefault();
  displayRestaraunts()
  })
