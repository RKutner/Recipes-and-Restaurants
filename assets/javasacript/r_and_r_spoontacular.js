const apiKey = "95b6a8ee9c4447c694497d6c79136605"; //spoonacular api
var database = firebase.database();
var lastSearch = "";

//spoonacular issue
const obtainRecipe = (food, response) => {
  const results = response.results;
  const ids = [];
  for (let i = 0; i < results.length; i++) {
    ids.push(results[i].id);
  }

  obtainRecipeInfo(food, results, ids);

};

// what i want is (response,results) => {blah blah}
const obtainRecipeInfo = (food, recipeResults, ids) => {
  const url = `https://api.spoonacular.com/recipes/informationBulk?ids=${ids.join(
    ","
  )}&apiKey=${apiKey}`;
  $.ajax({
    url,
    method: "GET"
  }).then(function(response) {
    saveToDB(food, recipeResults, response);
  });
};

const saveToDB = (food, recipeResults, recipes) => {
  let savedRecipes = {};
  for (let i = 0; i < recipes.length; i++) {

    savedRecipes[recipeResults[i].id] = [recipeResults[i], recipes[i]];
  }
  database.ref(`/${food}/`).set(savedRecipes);

  createCards(food);
};

const createCards = food => {
  database
    .ref(`/${food}`)
    .once("value")
    .then(snapshot => {
      let info = snapshot.val();
      for (let item in info) {
        const recipeResults = info[item][0];
        const recipes = info[item][1];
        const $card = $("<div>").addClass("card recipe mb-2");
        $card.attr({ "data-id": recipeResults.id, "data-food": food });
        const $cardImgTop = $("<img>").addClass("card-img-top img-thumbnail");
        $cardImgTop.attr(
          "src",
          ` https://spoonacular.com/recipeImages/${recipeResults.image}`
        );
        const $cardBody = $("<div>").addClass("card-body");
        const $cardTitle = $("<h5>").addClass("card-title");
        $cardTitle.text(recipeResults.title);
        const $cardSubtitle = $("<h6>").addClass("card-subtitle");
        $cardSubtitle.text(
          `Approximate Ingredient Price: $${(
            (recipes.pricePerServing * recipeResults.servings) /
            100
          ).toFixed(2)}`
        );
        const $cardText = $("<p>").addClass("card-text");
        $cardText.text(`Cook Time: ${recipeResults.readyInMinutes} minutes`);

        const $cardRow = $("<div>").addClass("row");
        const $cardColLeft = $("<div>").addClass("col-sm-10");
        const $cardColRight = $("<div>").addClass("col-sm-2");
        const $cardButton = $("<button>").addClass("fas fa-list-alt btn-lg btn-warning mt-3 getRecipe");
        $cardButton.attr("data-toggle", "modal")
        $cardButton.attr("data-target", "#recipeModal")
        $cardButton.attr("type", "button")
        
        $cardColLeft.append($cardTitle, $cardSubtitle, $cardText);
        $cardColRight.append($cardButton);

        $cardBody.append($cardRow.append($cardColLeft, $cardColRight));
        $card.append($cardImgTop, $cardBody);
        $("#recipieList").append($card);
      }
    });
};

const snoonacularCalls = () => {
  $("#recipieList").empty();
  const food = $(".searchField")
    .val()
    .trim()
    .toLowerCase();

  database
    .ref(`/${food}`)
    .once("value")
    .then(snapshot => {
      let info = snapshot.val();
      if (info) {
        createCards(food);
      } else {
        const url = `https://api.spoonacular.com/recipes/search?query=${food}&apiKey=${apiKey}&number=5&instructionsRequired=true&type=main course`;
        $("#recipieList").empty();
        $.ajax({
          url,
          method: "GET"
        }).then(response => {
          obtainRecipe(food, response);
        });
      }
    });
};

const consoleLogInfo = event => {
  // this function is to provide more info when user clicks on a recipe
  event.preventDefault();
  const $recipe = $(event.target).closest(".recipe");

  const id = $recipe.attr("data-id");
  const food = $recipe.attr("data-food");
  database
  .ref(`/${food}/${id}/1`)
  .once("value")
  .then(snapshot => {
    const info = snapshot.val();
    console.log(info)
    //name of the recipe 

    //ingredients
    const ingredientsList = [];
    const stepList =[];
    info.extendedIngredients.forEach(ingredient => {

      ingredientsList.push(`${ingredient.original}`)
      // ingredientsList.push(`${ingredient.amount} ${ingredient.unit} ${ingredient.name}`)
    })
    //steps
    info.analyzedInstructions[0].steps.forEach((step,index) => {
      stepList.push(`Step ${index+1}: ${step.step}`)
    })

    console.log(info.title)
    console.log(ingredientsList)
    console.log(stepList)
    console.log(info.sourceUrl)

    $('#recipeModalTitle').text(info.title);

    for (let i = 0; i < ingredientsList.length; i++){
      $('#ingredients').append($('<p>').addClass("font-weight-light mb-2").text(ingredientsList[i])).append($('<hr>'));
    };
    for (let i = 0; i < stepList.length; i++){
      $('#instructions').append($('<p>').text(stepList[i]));
    };
  });

};

$(document).on("click", ".searchClick", event => {
  event.preventDefault();
  let foodInput = $(".searchField").val();
  if (foodInput === "") {
    return;
  }

  $("#searchTarget").text(`You're looking for "${foodInput}"!`);
  snoonacularCalls();
  displayRestaraunts();
});
$(document).on("click", ".getRecipe", consoleLogInfo);

// initial on load Page Change functions -Andy
$(".initSearchClick").on("click", event => {
  event.preventDefault();
  let foodInput = $(".searchField").val();
  lastSearch = $(".searchField").val()
  if (foodInput === "") {
    return;
  }


  $("#searchTarget").text(`You're looking for "${foodInput}"!`);
  snoonacularCalls();
  displayRestaraunts();
  $("#initSearchPage").empty();
  $(".searchField").val(lastSearch);
  $("#main").show();
});

$(".searchField").keyup(function(event) {
  if (event.keyCode === 13) {
    $(".initSearchClick").click();
  }
});

