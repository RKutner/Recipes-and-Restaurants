$("#search").on('click', function(){
    event.preventDefault()
    
    navigator.geolocation.getCurrentPosition(function(position){
    
        console.log(position)
    })
    })