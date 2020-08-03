__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _util_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/index */ "./src/util/index.js");

/**
 * Limit filter for arrays
 *
 * @param {Number} n
 * @param {Number} offset (Decimal expected)
 */

function limitBy(arr, n, offset) {
  offset = offset ? parseInt(offset, 10) : 0;
  n = _util_index__WEBPACK_IMPORTED_MODULE_0__["default"].toNumber(n);
  return typeof n === 'number' ? arr.slice(offset, offset + n) : arr;
}

/* harmony default export */ __webpack_exports__["default"] = (limitBy);
