__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _util_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/index */ "./src/util/index.js");

/**
 * Filter filter for arrays
 *
 * @param {String|Array<String>|Function} ...sortKeys
 * @param {Number} [order]
 */

function orderBy(arr) {
  var _comparator = null;
  var sortKeys;
  arr = _util_index__WEBPACK_IMPORTED_MODULE_0__["default"].convertArray(arr); // determine order (last argument)

  var args = _util_index__WEBPACK_IMPORTED_MODULE_0__["default"].toArray(arguments, 1);
  var order = args[args.length - 1];

  if (typeof order === 'number') {
    order = order < 0 ? -1 : 1;
    args = args.length > 1 ? args.slice(0, -1) : args;
  } else {
    order = 1;
  } // determine sortKeys & comparator


  var firstArg = args[0];

  if (!firstArg) {
    return arr;
  } else if (typeof firstArg === 'function') {
    // custom comparator
    _comparator = function comparator(a, b) {
      return firstArg(a, b) * order;
    };
  } else {
    // string keys. flatten first
    sortKeys = Array.prototype.concat.apply([], args);

    _comparator = function comparator(a, b, i) {
      i = i || 0;
      return i >= sortKeys.length - 1 ? baseCompare(a, b, i) : baseCompare(a, b, i) || _comparator(a, b, i + 1);
    };
  }

  function baseCompare(a, b, sortKeyIndex) {
    var sortKey = sortKeys[sortKeyIndex];

    if (sortKey) {
      if (sortKey !== '$key') {
        if (_util_index__WEBPACK_IMPORTED_MODULE_0__["default"].isObject(a) && '$value' in a) a = a.$value;
        if (_util_index__WEBPACK_IMPORTED_MODULE_0__["default"].isObject(b) && '$value' in b) b = b.$value;
      }

      a = _util_index__WEBPACK_IMPORTED_MODULE_0__["default"].isObject(a) ? _util_index__WEBPACK_IMPORTED_MODULE_0__["default"].getPath(a, sortKey) : a;
      b = _util_index__WEBPACK_IMPORTED_MODULE_0__["default"].isObject(b) ? _util_index__WEBPACK_IMPORTED_MODULE_0__["default"].getPath(b, sortKey) : b;
    }

    return a === b ? 0 : a > b ? order : -order;
  } // sort on a copy to avoid mutating original array


  return arr.slice().sort(_comparator);
}

/* harmony default export */ __webpack_exports__["default"] = (orderBy);
