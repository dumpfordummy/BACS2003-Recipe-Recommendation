const express=require("express");
const request = require('request-promise');
const https = require('https');
let ejs = require("ejs");
const bodyParser = require("body-parser");
const app=express();
app.set('view engine','ejs');
app.use(express.static('./public'));
app.use(bodyParser.json());
let imgArr=["img/slide-1.jpeg","img/slide-2.jpeg","img/slide-3.jpeg","img/slide-4.jpeg","img/slide-5.jpeg"];
let uriObj={
    ip:'http://127.0.0.1',
    port:'5000'
}

async function getPopularRecommendations() {
    let tempOptions = {
        method: 'GET',
        uri: `${uriObj.ip}:${uriObj.port}/popularity`,
        json: true
    };    
    let result = await request(tempOptions);
    L = [];
    for(const index in result.RecipeId){
        L.push({
            id: result.RecipeId[index],
            name: result.Name[index],
            wRating: result.wr[index]
        });
    };
    L.sort((a, b) => b.wRating - a.wRating);
    return L;
}

async function getCategoryBasedRecommendations(title) {
    let tempOptions = {
        method: 'POST',
        uri: `${uriObj.ip}:${uriObj.port}/`,
        json: true,
    };
    tempOptions.body = {
        keyword: title
    };
    tempOptions.uri+='category';
    const result = await request(tempOptions);
    L = [];
    for(const index in result.RecipeId){
        L.push({
            id: result.RecipeId[index],
            name: result.Name[index],
            wr: result.wr[index]
        });
    };
    L.sort((a, b) => b.wr - a.wr);
    return L;
}

async function getDescriptionBasedRecommendations(title) {
    let tempOptions = {
        method: 'POST',
        uri: `${uriObj.ip}:${uriObj.port}/`,
        json: true,
    };
    tempOptions.body = {
        keyword: title
    };
    tempOptions.uri+='description';
    const result = await request(tempOptions);
    L = [];
    for(const index in result.RecipeId){
        L.push({
            id: result.RecipeId[index],
            name: result.Name[index],
        });
    };
    return L;
}

async function getMetadataBasedRecommendations(title) {
    let tempOptions = {
        method: 'POST',
        uri: `${uriObj.ip}:${uriObj.port}/`,
        json: true,
    };
    tempOptions.body = {
        keyword: title
    };
    tempOptions.uri+='metadata';
    const result = await request(tempOptions);
    L = [];
    for(const index in result.RecipeId){
        L.push({
            id: result.RecipeId[index],
            name: result.Name[index],
        });
    };
    return L;
}

async function getContentBasedRecommendations(title) {
    let tempOptions = {
        method: 'POST',
        uri: `${uriObj.ip}:${uriObj.port}/`,
        json: true,
    };
    tempOptions.body = {
        keyword: title
    };    
    tempOptions.uri+='content';
    const result = await request(tempOptions);
    L = [];
    for(const index in result.RecipeId){
        L.push({
            id: result.RecipeId[index],
            name: result.Name[index],
            similarity: result.Similarity[index]
        });
    };
    return L;
}

async function getCollaborativeItemBasedRecommendations() {
    var likedRecipeList = JSON.parse(localStorage.getItem('likedRecipeList')) || [];
    let L = [];

    if (likedRecipeList.length !== 0) {
        // Assuming `uriObj` is defined and contains the IP address and port
        const uri = `${uriObj.ip}:${uriObj.port}/collaborative`;

        try {
            const response = await fetch(uri, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: likedRecipeList })
            });
            const result = await response.json();

            // Assuming your API returns an array of objects with RecipeId and Name properties
            L = result.map(item => ({
                id: item.RecipeId,
                name: item.Name,
            }));
        } catch (error) {
            console.error('Error fetching collaborative recommendations:', error);
        }
    }

    return L;
}


async function searchRecipes() {
    let tempOptions = {
        method: 'POST',
        uri: `${uriObj.ip}:${uriObj.port}/`,
        json: true,
    };
    tempOptions.method = 'GET';
    tempOptions.uri+='search';
    const result = await request(tempOptions);
    L = [];
    for(const index in result.RecipeId){
        L.push({
            id: result.RecipeId[index],
            name: result.Name[index],
        });
    };
    return L;
}

async function getRecipeDetailById(title) {
    let tempOptions = {
        method: 'POST',
        uri: `${uriObj.ip}:${uriObj.port}/`,
        json: true,
    };
    tempOptions.body = {
        keyword: title
    };
    tempOptions.uri+='recipeDetail';
    const result = await request(tempOptions);
    return result;
}

async function getDatasetDump() {
    let tempOptions = {
        method: 'POST',
        host: 'localhost',
        uri: `${uriObj.ip}:${uriObj.port}/`,
        json: true,
    };    
    tempOptions.uri+='datasetDump';
    tempOptions.method = 'GET';
    const result = await request(tempOptions);
    L = new Map();
    for(let index = 0; index < 9000; index++){
        L.set(result.RecipeId[index],{
            id: result.RecipeId[index],
            name: result.Name[index],
            authorId: result.AuthorId[index],
            authorName: result.AuthorName[index],
            cookTime: result.CookTime[index],
            prepTime: result.PrepTime[index],
            totalTime: result.TotalTime[index],
            description: result.Description[index],
            images: result.Images[index],
            recipeCategory: result.RecipeCategory[index],
            keywords: result.Keywords[index],
            recipeIngredientQuantities: result.RecipeIngredientQuantities[index],
            recipeIngredientParts: result.RecipeIngredientParts[index],
            aggregatedRating: result.AggregatedRating[index],
            reviewCount: result.ReviewCount[index],
            calories: result.Calories[index],
            fatContent: result.FatContent[index],
            saturatedFatContent: result.SaturatedFatContent[index],
            cholesterolContent: result.CholesterolContent[index],
            sodiumContent: result.SodiumContent[index],
            carbohydrateContent: result.CarbohydrateContent[index],
            fiberContent: result.FiberContent[index],
            sugarContent: result.SugarContent[index],
            proteinContent: result.ProteinContent[index],
            recipeServings: result.RecipeServings[index],
            recipeInstructions: result.RecipeInstructions[index],
        });
    }
    return L;
}
let dataMap;
getDatasetDump().then((r)=>{
    dataMap=r;
});

app.get('/',(req,res)=>{
    getPopularRecommendations().then((l)=>{
        let popArr=[]
        l.forEach((obj)=>{
            if(dataMap.get(obj.id)!=undefined){
                let temp={}
                temp.id=obj.id;
                temp.name=obj.name;
                temp.wRating=obj.wRating
                temp.img=dataMap.get(obj.id).images;
                temp.time=dataMap.get(obj.id).totalTime;
                temp.category=dataMap.get(obj.id).recipeCategory;
                popArr.push(temp);
            }
        });
        res.render("home.ejs",{
            crrImgArr: imgArr,
            popularityArr: popArr,
        });
    });
});
app.get('/recipe',(req,res)=>{
    const recipeID=parseInt(req.query.id);
    const recipe=dataMap.get(recipeID);
    getContentBasedRecommendations(recipe.name).then((l)=>{
        let popArr = [];
        l.forEach((obj)=>{
            if(dataMap.get(obj.id)!=undefined){
                let temp={}
                temp.id=obj.id;
                temp.name=obj.name;
                temp.similarity=obj.similarity;
                temp.img=dataMap.get(obj.id).images;
                temp.time=dataMap.get(obj.id).totalTime;
                temp.category=dataMap.get(obj.id).recipeCategory;
                popArr.push(temp);
            } 
        });
        recipe.popularityArr=popArr;
        res.render("recipe.ejs",recipe);
    });
});
app.get('/recipes',(req,res)=>{
    res.render('recipes.ejs',{search:false});
});

app.get('/personalised',(req,res)=>{
    res.render('personalised.ejs');
});

app.get('/knn',(req,res)=>{
    res.render('knn.ejs');
});

app.post('/category',(req,res)=>{
    getCategoryBasedRecommendations(req.body.category).then((l)=>{
        let catArr = [];
        l.forEach((obj)=>{
            if(dataMap.get(obj.id)!=undefined){
                let temp={}
                temp.id=obj.id;
                temp.name=obj.name;
                temp.wr=obj.wr;
                temp.img=dataMap.get(obj.id).images;
                temp.time=dataMap.get(obj.id).totalTime;
                temp.category=dataMap.get(obj.id).recipeCategory;
                catArr.push(temp);
            }
        });
        let resObj={
            resultArr: catArr
        }
        res.json(resObj);
    });
})

app.post('/subscribe', (req, res)=>{
    const email = req.body.emailID;
    const emailData = {
        members: [{
                email_address: email,
                status: "subscribed"}]
    };
    const jsonEmailData = JSON.stringify(emailData);
    const url = 'https://us18.api.mailchimp.com/3.0/lists/52ec9af195';
    const options = {
        method: 'POST',
        auth: 'ananyagarg28:9d129ae6293e16a80cde0e21302789f5-us18'
    };
    const request = https.request(url, options, function(response) {
        if(response.statusCode === 400) {
            res.render("subscribe.ejs", {success: true});
        }
        else {
            res.render("subscribe.ejs", {success: true});
        }
    });
    request.write(jsonEmailData);
    request.end();
})
process.on('uncaughtException', function (err) {
    console.log(err);
}); 


app.listen(3001,()=>{
    console.log("Server Up!");
});
