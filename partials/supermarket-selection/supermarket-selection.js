'use strict';

// Init supermarkets in localStorage if not set
if (localStorage.getItem('supermarkets') === null) {
  localStorage.setItem('supermarkets', '{"albert-heijn": true}');
}

var supermarketOptions = document.querySelectorAll('[data-supermarket-option]');
var recipes = document.querySelectorAll('[data-recipe-preview]');
var supermarkets = JSON.parse(localStorage.getItem('supermarkets'));

for (var i = 0; i < supermarketOptions.length; i += 1) {
  var element = supermarketOptions[i];

  // Set DOM element to reflect state in localStorage
  element.firstChild.checked = supermarkets[element.firstChild.id];

  element.addEventListener('click', function () {
    // Update localStorage when option is being toggled
    var name = this.firstChild.id;
    var state = this.firstChild.checked;

    supermarkets[name] = state;

    localStorage.setItem('supermarkets', JSON.stringify(supermarkets));

    // Update recipe listing
    updateRecipeListing();
  });
};

var updateRecipeListing = function () {
  for (var i = 0; i < recipes.length; i += 1) {
    var element = recipes[i];

    if (!supermarkets[element.dataset.recipePreview]) {
      element.classList.add('recipe-preview-disabled');
    } else {
      element.classList.remove('recipe-preview-disabled');
    }
  }
};

// Initial recipe listing update
updateRecipeListing();
