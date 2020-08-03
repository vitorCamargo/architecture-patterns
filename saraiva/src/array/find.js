__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _filterBy__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./filterBy */ "./src/array/filterBy.js");

/**
 * Get first matching element from a filtered array
 *
 * @param {Array} arr
 * @param {String|Number} search
 * @returns {mixed}
 */

function find(arr, search) {
  var array = _filterBy__WEBPACK_IMPORTED_MODULE_0__["default"].apply(this, arguments);
  array.splice(1);
  return array;
}

/* harmony default export */ __webpack_exports__["default"] = (find);
