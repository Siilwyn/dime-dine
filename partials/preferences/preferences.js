'use strict';

var priceSlider = document.querySelector('[data-noui-slider-price]');
var timeSlider = document.querySelector('[data-noui-slider-time]');
var personsSlider = document.querySelector('[data-noui-slider-persons]');

if (priceSlider) {
  noUiSlider.create(priceSlider, {
    start: [0.5, 3],
    step: 0.1,
    connect: true,
    tooltips: true,
    range: {
      'min': 0.1,
      'max': 8
    },
    format: {
      from: function ( value ) {
        return value.replace('€', '');
      },
      to: function ( value ) {
        return '€' + value;
      }
    }
  });
}

if (timeSlider) {
  noUiSlider.create(timeSlider, {
    start: [5, 60],
    step: 1,
    margin: 5,
    connect: true,
    tooltips: true,
    range: {
      'min': 5,
      'max': 60
    },
    format: {
      from: function ( value ) {
        return value.replace(' minuten', '');
      },
      to: function ( value ) {
        return value + ' minuten';
      }
    }
  });
}

if (personsSlider) {
  noUiSlider.create(personsSlider, {
    start: 4,
    step: 1,
    tooltips: true,
    range: {
      'min': 1,
      'max': 15
    },
    format: {
      from: function ( value ) {
        return value.replace(' personen', '');
      },
      to: function ( value ) {
        return value + ' personen';
      }
    }
  });
}
