let savedRecipes = {};
const apiKey = ""; //spoonacular api
// const proxyurl = 'https://cors-anywhere.herokuapp.com/';

//spoonacular issue
const obtainRecipe = response => {
  const results = response.results;
  const ids = [];
  for (let i = 0; i < results.length; i++) {
    ids.push(results[i].id);
  }
  obtainRecipeInfo(results, ids);
  console.log(ids);
};

// what i want is (response,results) => {blah blah}
const obtainRecipeInfo = (recipeResults, ids) => {
  const url = `https://api.spoonacular.com/recipes/informationBulk?ids=${ids.join(
    ","
    
  )}&apiKey=${apiKey}`;
  $.ajax({
    url,
    method: "GET"
  }).then(function(response) {
    createCards(recipeResults, response);
  });
};

const createCards = (recipeResults, recipes) => {
  for (let i = 0; i < recipes.length; i++) {
    console.log(recipes[i]);
    savedRecipes[recipeResults[i].id] = [recipeResults[i],recipes[i]]
    const $card = $("<div>").addClass("card recipe mb-2");
    $card.attr("data-id", recipeResults[i].id);
    const $cardImgTop = $("<img>").addClass("card-img-top img-thumbnail");
    $cardImgTop.attr(
      "src",
      ` https://spoonacular.com/recipeImages/${recipeResults[i].id}-636x393.jpg`
    );
    const $cardBody = $("<div>").addClass("card-body");
    const $cardTitle = $("<h5>").addClass("card-title");
    $cardTitle.text(recipeResults[i].title);
    const $cardSubtitle = $("<h6>").addClass("card-subtitle");
    $cardSubtitle.text(`Price: $${((recipes[i].pricePerServing*recipeResults[i].servings)/100).toFixed(2)}`);
    const $cardText = $("<p>").addClass("card-text");
    $cardText.text(`Ready In: ${recipeResults[i].readyInMinutes} minutes`);

    $cardBody.append($cardTitle, $cardSubtitle, $cardText);
    $card.append($cardImgTop, $cardBody);
    $("#recipieList").append($card);
  }
  console.log(savedRecipes)
};

const snoonacularCalls = event => {
  event.preventDefault();
  // const food = $(".searchField").val().trim();
  console.log("currenting using place holder text in JS to reduce API calls")
  const food = "pineapple";
  // console.log(food);
  const url = `https://api.spoonacular.com/recipes/search?query=${food}&apiKey=${apiKey}&number=2&instructionsRequired=true&type=main course`;

  $.ajax({
    url,
    method: "GET"
  }).then(obtainRecipe);

  $('#searchTarget').text(food);
};

/*
const snoonacularCalls = event => {
  event.preventDefault();
  const food = $("#searchField")
    .val()
    .trim();
  // console.log("currenting using place holder text in JS to reduce API calls")
  // const food = "pineapple";
  const queryURL = `http://www.recipepuppy.com/api/?q=${food}`;

  $.ajax({
    url:proxyurl+queryURL,
    method: "GET"
  }).then(obtainRecipe);
};

const obtainRecipe = response => {

  response = JSON.parse(response);
  const results = response.results
  $("#recipieList").empty()
  for (let i = 0; i < results.length; i++) {
    console.log(results[i])
    const $card = $("<div>").addClass("card recipe mb-2");
    const $cardImgTop = $("<img>").addClass("card-img-top img-thumbnail");
    $cardImgTop.attr("src", results[i].thumbnail);
    const $cardBody = $("<div>").addClass("card-body");
    const $cardTitle = $("<h5>").addClass("card-title");
    $cardTitle.text(results[i].title);
    const $cardText = $("<p>").addClass("card-text");
    $cardText.text(`Ingredients list: ${results[i].ingredients}`);

    $cardBody.append($cardTitle, $cardText);
    $card.append($cardImgTop, $cardBody);
    $("#recipieList").append($card);
  }
  // console.log(savedRecipes);
};

*/

const consoleLogInfo = event => {
  event.preventDefault()
  const $recipe = $(event.target).closest(".recipe");
  console.log($recipe.attr("data-id"));
  console.log(savedRecipes[$recipe.attr("data-id")])
};

$(document).on("click", ".searchClick", snoonacularCalls);
$(document).on("click", ".recipe", consoleLogInfo);

// initial on load Page Change functions -Andy
$('.initSearchClick').on("click", event => {
  event.preventDefault();

  // prevents transition if searchField is blank
  if ($('.searchField').val() === "") { 
    return;
  }
  snoonacularCalls(event);
  $('#initSearchPage').empty();
  $('#main').show();
  // displayRestaraunts(); // r_and_r_google.js
});