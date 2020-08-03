__webpack_require__.r(__webpack_exports__);
/**
 *  If the value is missing outputs the placeholder text
 * 
 * '' => {placeholder}
 * 'foo' => 'foo'
 */
function placeholder(input, property) {
  return input === undefined || input === '' || input === null ? property : input;
}

/* harmony default export */ __webpack_exports__["default"] = (placeholder);
