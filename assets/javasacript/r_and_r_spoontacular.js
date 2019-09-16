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
  )}&apiKey=bb9cefd1ba364505863a1ddb120313da`;
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
    // create jquery object to put all items into body.
    // test  is the placeholder text for index.html div
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
    $cardSubtitle.text(`Serving Size: ${recipeResults[i].servings}`);
    const $cardText = $("<p>").addClass("card-text");
    $cardText.text(`Ready In: ${recipeResults[i].readyInMinutes} minutes`);

    $cardBody.append($cardTitle, $cardSubtitle, $cardText);
    $card.append($cardImgTop, $cardBody);
    $("#recipieList").append($card);
  }
};

const snoonacularCalls = event => {
  event.preventDefault();
  // const food = $("#searchField").val().trim();
  console.log("currenting using place holder text in JS to reduce API calls")
  const food = "pineapple";
  const url = `https://api.spoonacular.com/recipes/search?query=${food}&apiKey=bb9cefd1ba364505863a1ddb120313da&instructionsRequired=true&type=main course`;

  $.ajax({
    url,
    method: "GET"
  }).then(obtainRecipe);
};

const consoleLogInfo = event => {
  // event.preventDefault()
  const $recipe = $(event.target).closest(".recipe");
  console.log();
};

$(document).on("click", "#searchClick", snoonacularCalls);
$(document).on("click", ".recipe", consoleLogInfo);
