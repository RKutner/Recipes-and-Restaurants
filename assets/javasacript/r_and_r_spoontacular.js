let currentFood ;
const apiKey = "9eeb1c3c7a454e8784a2ce72c0ac6299"; //spoonacular api
var database = firebase.database();


//spoonacular issue
const obtainRecipe = (food,response) => {
  const results = response.results;
  const ids = [];
  for (let i = 0; i < results.length; i++) {
    ids.push(results[i].id);
  }
  obtainRecipeInfo(food,results, ids);
};

// what i want is (response,results) => {blah blah}
const obtainRecipeInfo = (food,recipeResults, ids) => {
  const url = `https://api.spoonacular.com/recipes/informationBulk?ids=${ids.join(",")}&apiKey=${apiKey}`;
  $.ajax({
    url,
    method: "GET"
  }).then(function(response) {
    saveToDB(food,recipeResults, response);
  });
};

const saveToDB = (food,recipeResults, recipes) => {
  let savedRecipes = {};
  for (let i = 0; i < recipes.length; i++) {
      savedRecipes[recipeResults[i].id] = [recipeResults[i],recipes[i]]
  }
  database.ref(`/${food}/`).set(JSON.stringify(savedRecipes))
  
  createCards(food)
}

const createCards = (food) => {
  
  database.ref(`/${food}`).once('value').then(snapshot =>{
    let info=JSON.parse(snapshot.val());
  for (let item in info) {
    const recipeResults = info[item][0]
    const recipes = info[item][1]
    const $card = $("<div>").addClass("card recipe mb-2");
    $card.attr("data-id", recipeResults.id);
    const $cardImgTop = $("<img>").addClass("card-img-top img-thumbnail");
    $cardImgTop.attr(
      "src",
      ` https://spoonacular.com/recipeImages/${recipeResults.id}-636x393.jpg`
    );
    const $cardBody = $("<div>").addClass("card-body");
    const $cardTitle = $("<h5>").addClass("card-title");
    $cardTitle.text(recipeResults.title);
    const $cardSubtitle = $("<h6>").addClass("card-subtitle");
    $cardSubtitle.text(`Price: $${((recipes.pricePerServing*recipeResults.servings)/100).toFixed(2)}`);
    const $cardText = $("<p>").addClass("card-text");
    $cardText.text(`Ready In: ${recipeResults.readyInMinutes} minutes`);

    $cardBody.append($cardTitle, $cardSubtitle, $cardText);
    $card.append($cardImgTop, $cardBody);
    $("#recipieList").append($card);
  }
})
};


const snoonacularCalls = () => {
  $("#recipieList").empty()
  const food = $(".searchField").val().trim().toLowerCase();

  database.ref(`/${food}`).once('value').then(snapshot =>{
    let info=snapshot.val();
    if (info){
      createCards(food)
    }else{
      const url = `https://api.spoonacular.com/recipes/search?query=${food}&apiKey=${apiKey}&number=5&instructionsRequired=true&type=main course`;
      $('#recipieList').empty()
      $.ajax({
        url,
        method: "GET"
      }).then(response => {
        obtainRecipe(food,response)
      });
  }
  
  })


};

const consoleLogInfo = event => { // this function is to provide more info when user clicks on a recipe
  event.preventDefault()
  const $recipe = $(event.target).closest(".recipe");
  console.log($recipe.attr("data-id"));
  console.log(savedRecipes[$recipe.attr("data-id")])
};





$(document).on("click", ".searchClick", event => {
  event.preventDefault();
  let foodInput = $('.searchField').val()
  if (foodInput === "") { 
    return;
  }
  
  $('#searchTarget').text(`You're looking for ${foodInput}`);
  snoonacularCalls();
  displayRestaraunts();
});
$(document).on("click", ".recipe", consoleLogInfo);

// initial on load Page Change functions -Andy
$('.initSearchClick').on("click", event => {
  event.preventDefault();
  let foodInput = $('.searchField').val()
  if (foodInput === "") { 
    return;
  }
  
  $('#searchTarget').text(`You're looking for ${foodInput}`);
  snoonacularCalls();
  displayRestaraunts();
  $('#initSearchPage').empty();
  $('#main').show();

});