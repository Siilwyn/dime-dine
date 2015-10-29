'use strict';

var supermarketOptions = document.querySelectorAll('[data-supermarket-option]');

for (var i = 0; i < supermarketOptions.length; i += 1) {

  var optionChecked = localStorage.getItem(supermarketOptions[i].firstChild.id);
  supermarketOptions[i].firstChild.checked = (optionChecked === 'true');

  supermarketOptions[i].addEventListener('click', function () {
    localStorage.setItem(this.firstChild.id, this.firstChild.checked);
  });
};