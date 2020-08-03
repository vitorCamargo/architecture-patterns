__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _util_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/index */ "./src/util/index.js");

/**
 * Filter filter for arrays
 *
 * @param {Array} arr
 * @param {String} prop
 * @param {String|Number} search
 */

function filterBy(arr, search) {
  var arr = _util_index__WEBPACK_IMPORTED_MODULE_0__["default"].convertArray(arr);

  if (search == null) {
    return arr;
  }

  if (typeof search === 'function') {
    return arr.filter(search);
  } // cast to lowercase string


  search = ('' + search).toLowerCase();
  var n = 2; // extract and flatten keys

  var keys = Array.prototype.concat.apply([], _util_index__WEBPACK_IMPORTED_MODULE_0__["default"].toArray(arguments, n));
  var res = [];
  var item, key, val, j;

  for (var i = 0, l = arr.length; i < l; i++) {
    item = arr[i];
    val = item && item.$value || item;
    j = keys.length;

    if (j) {
      while (j--) {
        key = keys[j];

        if (key === '$key' && contains(item.$key, search) || contains(_util_index__WEBPACK_IMPORTED_MODULE_0__["default"].getPath(val, key), search)) {
          res.push(item);
          break;
        }
      }
    } else if (contains(item, search)) {
      res.push(item);
    }
  }

  return res;
}

function contains(val, search) {
  var i;

  if (_util_index__WEBPACK_IMPORTED_MODULE_0__["default"].isPlainObject(val)) {
    var keys = Object.keys(val);
    i = keys.length;

    while (i--) {
      if (contains(val[keys[i]], search)) {
        return true;
      }
    }
  } else if (_util_index__WEBPACK_IMPORTED_MODULE_0__["default"].isArray(val)) {
    i = val.length;

    while (i--) {
      if (contains(val[i], search)) {
        return true;
      }
    }
  } else if (val != null) {
    return val.toString().toLowerCase().indexOf(search) > -1;
  }
}

/* harmony default export */ __webpack_exports__["default"] = (filterBy);
