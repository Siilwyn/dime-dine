'use strict';

var express = require('express');
var router = express.Router();

/*
  GET
  specified partial name
*/
router.get('/:partialname', function (req, res) {
  var partialName = req.params.partialname;

  res.render('sandbox', {partialName: partialName});
});

module.exports = router;
