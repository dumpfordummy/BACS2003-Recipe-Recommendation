const ratingDiv=document.getElementById("starRating");
console.log(ratingDiv.childNodes);
for(let i=0;i<recipeRating;i++){
    ratingDiv.childNodes[2*i+1].classList.toggle("text-gray-300");
    ratingDiv.childNodes[2*i+1].classList.toggle("text-yellow-400");
}


function addToLocalStorage(recipeId) {
    var likedRecipeList = JSON.parse(localStorage.getItem('likedRecipeList')) || [];
    if (!likedRecipeList.includes(recipeId)) {
        likedRecipeList = likedRecipeList.concat(recipeId);

        localStorage.setItem('likedRecipeList', JSON.stringify(likedRecipeList));
    }

    location.reload();
}

function isLikedRecipe(recipeId) {
    var likedRecipeList = JSON.parse(localStorage.getItem('likedRecipeList')) || [];
    if (likedRecipeList.includes(recipeId))
        return true;
    else
        return false;
}
