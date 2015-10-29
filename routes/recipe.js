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
  element.discount = '€' + (0.10 + 3 * Math.random()).toFixed(2);
  element.price = '€' + (0.80 + 10 * Math.random()).toFixed(2);
  element.supermarket = randomItemInArray(supermarkets);
  element.healthiness = Math.round(10 * Math.random());
};

var formatRecipeTitle = function (element) {
  element.recipeName = element.recipeName.toLowerCase();
  element.recipeName = capitalize.words(element.recipeName);
};

/*
  GET
  recipe-overview
*/
router.get('/', function (req, res) {
  yummly.search({
    credentials: credentials,
    query: {
      allowedIngredient: ['tomato', 'salad'],
      allowedCourse: ['Main Dishes', 'Salads'],
      maxTotalTimeInSeconds: 5400, // 5400 seconds is 90 minutes
      requirePictures: true
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
router.get('/:id', function (req, res) {
  yummly.recipe({
    credentials: credentials,
    id: req.params.id
  }, function (error, statusCode, json) {
    if (error) {
      console.error(error);
    } else if (statusCode === 200) {
      res.render('recipe', { recipe: json });
    }
  });
});

module.exports = router;
