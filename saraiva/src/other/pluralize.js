__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _util_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/index */ "./src/util/index.js");

/**
 * 'item' => 'items'
 *
 * @param {String|Array} word
 * @param {Object} options
 *
 */

function pluralize(value, word, options) {
  options = options || {};
  var output = '';
  var includeNumber = options.includeNumber != null ? options.includeNumber : false;
  if (includeNumber === true) output += value + ' ';
  if (!value && value !== 0 || !word) return output;

  if (Array.isArray(word)) {
    output += word[value - 1] || word[word.length - 1];
  } else {
    output += word + (value === 1 ? '' : 's');
  }

  return output;
}

/* harmony default export */ __webpack_exports__["default"] = (pluralize);
