'use strict';

var express = require('express');
var router = express.Router();
var yummly = require('yummly');
var randomItemInArray = require('random-item-in-array');
var capitalize = require('capitalize');

var credentials = {
  id: process.env.YUMMLY_ID,
  key: process.env.YUMMLY_KEY
};

var supermarkets = [
  'albert-heijn',
  'jumbo',
  'aldi',
  'lidl',
  'plus',
  'dirk'
];

// Leet hacks to improve image quality by cutting the last params from the url
var cutSmallImageUrls = function (element) {
  element.smallImageUrls[0] = element.smallImageUrls[0].split('=')[0];
};

// Add fake data to the recipe that would otherwise be pulled from API's
var addSampleData = function (element) {


  element.discount = '-€' + (0.10 + 3 * Math.random()).toFixed(2);
  element.price = '€' + (0.80 + 3 * Math.random()).toFixed(2) + ' p.p.';
  element.supermarket = randomItemInArray(supermarkets);
};

var formatRecipeTitle = function (element) {
  element.recipeName = element.recipeName.toLowerCase();
  element.recipeName = capitalize.words(element.recipeName);
};

var getCalories = function (json) {
  var calories,
      i;

  for (i = 0; i< json.length; i += 1) {
    if (json[i].attribute === 'ENERC_KCAL') {
      calories = json[i].value;
      return Math.round(calories);
    }
  }
};

var transformIngredients = function (json) {
  var ingredients = [],
      description,
      i;

  for (i = 0; i< json.length; i += 1) {
    // Detect ingredients that have a discount
    if (json[i].indexOf('tomato') > 0 || json[i].indexOf('tuna') > 0) {
      description = json[i];

      json[i] = {};
      json[i].description = description;
      json[i].discount = Math.round(5 * Math.random()) + '0%';
    }
    ingredients.push(json[i]);
  }
  return ingredients;
};

/*
  GET
  recipe-overview
*/
router.get('/', function (req, res) {
  yummly.search({
    credentials: credentials,
    query: {
      allowedIngredient: ['tuna', 'tomato'],
      allowedCourse: ['Main Dishes', 'Salads'],
      maxTotalTimeInSeconds: 5400, // 5400 seconds is 90 minutes
      requirePictures: true,
      nutrition: {NA: {'max': 1}}
    }
  }, function (error, statusCode, json) {
    if (error) {
      console.error(error);
    } else if (statusCode === 200) {
      json.matches.forEach(cutSmallImageUrls);
      json.matches.forEach(addSampleData);
      json.matches.forEach(formatRecipeTitle);

      res.render('recipe-overview', { recipes: json.matches });
    }
  });
});

/*
  GET
  recipe
*/
router.get('/recipe/:id', function (req, res) {
  yummly.recipe({
    credentials: credentials,
    id: req.params.id
  }, function (error, statusCode, json) {
    if (error) {
      console.error(error);
    } else if (statusCode === 200) {
      json.calories = getCalories(json.nutritionEstimates);
      json.ingredients = transformIngredients(json.ingredientLines);

      res.render('recipe', { recipe: json });
    }
  });
});

module.exports = router;
