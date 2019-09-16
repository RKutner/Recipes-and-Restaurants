const obtainRecipe = response => {
    const results = response.results
    for (let i = 0; i < 5; i++) {
        console.log(results[i])
    }
}

const snoonacularCalls = event =>{
const food = $("#submit").val().trim();
const url = `https://api.spoonacular.com/recipes/search?query=${food}&apiKey=bb9cefd1ba364505863a1ddb120313da`

$.ajax({
    url,
    method:"GET"
}).then(obtainRecipe)
}

$(document).on("click","#submit", snoonacularCalls);
