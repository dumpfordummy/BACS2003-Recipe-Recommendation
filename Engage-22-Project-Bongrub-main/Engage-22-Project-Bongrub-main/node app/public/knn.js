const personalisedRecipeList = getPersonalisedRecipe();

var container = document.getElementById("popular");

const loadingUI = document.getElementById('loader');

loadingUI.style.display = 'block';

const regex = /c\("([^"]+)"/;

personalisedRecipeList.then(response => {
    let idArr = response.RecipeId;
    let imageArr = response.Images;
    let nameArr = response.Name;
    let totalTimeArr = response.TotalTime;
    let categoryArr = response.RecipeCategory;
    let sourceRecipeId = response.SourceRecipeId;
    let previousRecommendedId = -1;

    for(let i = 0; i < Object.keys(idArr).length; i++) {
        const match = imageArr[i].match(regex) ?? imageArr[i][0];

        if(previousRecommendedId != sourceRecipeId[i] || previousRecommendedId == -1) {
            printRecommendSourceId(container, sourceRecipeId[i]);
            previousRecommendedId = sourceRecipeId[i]
        }
        appendRecipe(container, idArr[i], match[1], nameArr[i], totalTimeArr[i], categoryArr[i], sourceRecipeId[i]);
    }
});

function printRecommendSourceId(element, sourceRecipeId) {
    var placeholder = `
        <div class="text-2xl font-normal my-4 child-span-4">
            <span>You may also like because you liked <a href="/recipe?id=${sourceRecipeId}" style="color: blue; text-decoration: underline;">${sourceRecipeId}</a>  </span>
        </div>
    `
    element.innerHTML += placeholder;
}

function appendRecipe(element, id, img, name, time, category) {
    var placeholder = `
        <a href="/recipe?id=${id}" class="transition duration-150 ease-in-out transform hover:scale-105">
            <div class="mx-8 my-2">
                <img src="${img}" alt="" class="mb-4 h-60">
                <div class="text-2xl font-normal my-4">
                    <span>${name}</span>
                </div>
                <div class="bg-gray-400 h-0.5"></div>
                    <div class="font-light my-4 flex">
                        <span class="flex-none"><i class="fa-solid fa-clock"></i> ${ time.slice(2).replace("H"," Hour ").replace("M"," Minutes") }</span>
                        <span class="flex-auto text-right">${category}</span>
                    </div>
                    <div class="bg-gray-400 h-0.5 mb-4"></div>
                </div>
            </a>
        </a>
    `

    element.innerHTML += placeholder;
}

async function getPersonalisedRecipe() {
    var personalisedRecipeList;
    var likedRecipeList = JSON.parse(localStorage.getItem('likedRecipeList')) || [];
    if (likedRecipeList.length !== 0) {
        personalisedRecipeListPromise = await fetchAndProcessData(likedRecipeList);
    } else {
        personalisedRecipeListPromise = Promise.resolve(null);
    }

    loadingUI.style.display = 'none';
    return personalisedRecipeListPromise;
}

async function fetchAndProcessData(likedRecipeList) {
    try {
        const response = await fetch('http://127.0.0.1:5000/knn', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ likedRecipeList: likedRecipeList })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        return Promise.resolve(null);
    }
}
