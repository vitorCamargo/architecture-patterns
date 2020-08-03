__webpack_require__.r(__webpack_exports__);
/**
 *  Truncate at the given || default length
 *
 * 'lorem ipsum dolor' => 'lorem ipsum dol...'
 */
function truncate(value, length) {
  length = length || 15;
  if (!value || typeof value !== 'string') return '';
  if (value.length <= length) return value;
  return value.substring(0, length) + '...';
}

/* harmony default export */ __webpack_exports__["default"] = (truncate);
