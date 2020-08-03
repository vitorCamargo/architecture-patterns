__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _util_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util/index */ "./src/util/index.js");
/* harmony import */ var _string_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./string/index */ "./src/string/index.js");
/* harmony import */ var _array_index__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./array/index */ "./src/array/index.js");
/* harmony import */ var _other_index__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./other/index */ "./src/other/index.js");




var Vue2Filters = {
  install: function install(Vue) {
    _util_index__WEBPACK_IMPORTED_MODULE_0__["default"].each(_string_index__WEBPACK_IMPORTED_MODULE_1__, function (value, key) {
      Vue.filter(key, value);
    });
    _util_index__WEBPACK_IMPORTED_MODULE_0__["default"].each(_other_index__WEBPACK_IMPORTED_MODULE_3__, function (value, key) {
      Vue.filter(key, value);
    });
  },
  mixin: {
    methods: {
      limitBy: _array_index__WEBPACK_IMPORTED_MODULE_2__["limitBy"],
      filterBy: _array_index__WEBPACK_IMPORTED_MODULE_2__["filterBy"],
      orderBy: _array_index__WEBPACK_IMPORTED_MODULE_2__["orderBy"],
      find: _array_index__WEBPACK_IMPORTED_MODULE_2__["find"]
    }
  }
};
/* harmony default export */ __webpack_exports__["default"] = (Vue2Filters);

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(Vue2Filters);
  window.Vue2Filters = Vue2Filters;
}
