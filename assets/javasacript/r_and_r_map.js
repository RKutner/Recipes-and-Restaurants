$(document).navigator.geolocation.getCurrentPosition();


const proxyurl = "https://cors-anywhere.herokuapp.com/";

$('#searchClick').on('click', function(){

  let searchWord = $('#searchField').val().trim()
queryUrl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=37.87158,-122.25992&radius=1500&type=restaurant&keyword=key=AIzaSyC5MbQE-0lUqvgXhxVRhDCK05t0nvMrphM'


const displayRestaraunts = () => {
  $.ajax({
    url: proxyurl + `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=37.87158, -122.25992&radius=1500&type=restaurant&keyword=${searchWord}&key=AIzaSyC5MbQE-0lUqvgXhxVRhDCK05t0nvMrphM`,
    method: 'GET'
  }).then(function(response){
    var results = response.results
    for (let i = 0; i < results.length; i++){
    var name = results[i].name
    // var link = results[i].photos[0].html_attributes
    var address = results[i].vicinity
    var price_level = results[i].price_level
    $infoDiv = $('<div>')
    $infoDiv.addClass("card card-text text-center bordered")
    $nameDiv = $('<div>')
    $linkDiv = $('<div>')
    $addressDiv = $('<div>')
    $price_levelDiv = $('<div>')

    $nameDiv.text(name)
    // $linkDiv.text(link)
    $addressDiv.text(address)
    $price_levelDiv.text("Price Level: " + price_level)
    $infoDiv.append($nameDiv, $addressDiv, $price_levelDiv)
    $('#googleMaps').append($infoDiv)
    }
  })
}
displayRestaraunts()
})

$("#search").on('click', function(){
    event.preventDefault()
    
    navigator.geolocation.getCurrentPosition(function(position){
    
        console.log(position)
    })
    })


    `http://api.zip-codes.com/ZipCodesAPI.svc/1.0/ZIPCODE=${zip}?key=OLFMPABGVZQOZN3XNPZ4`

    