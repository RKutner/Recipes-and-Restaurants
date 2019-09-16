const obtainRecipe = response => {
  const results = response.results;
  for (let i = 0; i < results.length; i++) {
    console.log(results[i]);
    // create jquery object to put all items into body.
    // PLACEHOLDER is the placeholder text for
    const $card = $("<div>").addClass("card");
    const $cardImgTop = $("<img>").addClass("card-img-top img-thumbnail");
    $cardImgTop.attr(
      "src",
      ` https://spoonacular.com/recipeImages/${results[i].id}-636x393.jpg`
    );
    const $cardBody = $("<div>").addClass("card-body");
    const $cardTitle = $("<h5>").addClass("card-title");
    $cardTitle.text(results[i].title);
    const $cardSubtitle = $("<h6>").addClass("card-subtitle");
    $cardSubtitle.text(`Serving Size: ${results[i].servings}`);
    const $cardText = $("<p>").addClass("card-text");
    $cardText.text(`Ready In: ${results[i].readyInMinutes} minutes`);

    $cardBody.append($cardTitle, $cardSubtitle, $cardText);
    $card.append($cardImgTop, $cardBody);
    $(".test").append($card);
  }
};

const snoonacularCalls = event => {
  // const food = $("#submit").val().trim();
  const food = "pineapple";
  const url = `https://api.spoonacular.com/recipes/search?query=${food}&apiKey=bb9cefd1ba364505863a1ddb120313da`;

  $.ajax({
    url,
    method: "GET"
  }).then(obtainRecipe);
};

$(document).on("click", "#submit", snoonacularCalls);
