/*
* Search
*/

import getConfig from './../utils/getConfig';
import ranker from './../utils/ranker';
import request from './../utils/request';
import prop from './../utils/toolbelt/prop';
import {Log, LogError} from './../services/log';
import Module from './../utils/module';
import {addEvent, addListener, redirectEvent, debounce, addClass, removeClass, hasClass, formatMoney, getUrlParameter, smartClick, scrollTo, isScreenMedium, isScreenSmaller} from './../utils/utils';
import SearchGateway from './../services/searchGateway';

/**
 * Module Global
 */
let searchInput,
  searchClean,
  searchClose,
  searchSelectWrapper,
  searchSelect,
  searchSelectArrow,
  searchBox,
  searchForm,
  lastSearch = '',
  modName;

/**
 * Helpers
 */
const wrapMatch = (term, str, rep) => {
  return str.replace(new RegExp(`(${term})`, 'i'), rep);
};


const ratingToPercentage = (value) => `${(100 * value) / 5}%`;

const isFloat = (_getConfig = getConfig, _document = document) => hasClass(_document.getElementById(_getConfig('headerId')), _getConfig('classHeaderFloat'));

function cleanSearch(){
  if(searchInput.value === '') {
    return addClass(searchClean, 'hidden');
  } else{
    return removeClass(searchClean, 'hidden');
  }
}

/**
 * Templates
 */
const autosuggestLineTpl = ({image, name, url, price, qtdoffers, rating, impressionUrl, clickUrl, isAds, index}, term = '', _getConfig = getConfig) => {
  if (!name) {
    return null;
  }
  return `
    <li class="as-lst-it sz sz-${index}">
      <a
      href="${getConfig('urlBrand')}${url}"
      ${impressionUrl ? `data-impressionUrl="${impressionUrl}"` : ''}
      ${clickUrl ? `data-clickUrl="${clickUrl}"` : ''}
      title="${name}"
      class="as-lnk src-lnk ac-product-key">
        <img class="as-img" alt="${name}" src="${image}"/>
        <span class="as-name">${name}</span>
        ${isAds ? '<span class="as-ads">patrocinado <span class="ico-ads"><svg id="icon-alert-warning" viewBox="0 0 3.75 25"><path fill="inherit" d="M0 0h3.75v16.25H0V0zm0 20h3.75v5H0v-5z"></path></svg></span></span>' : ''}
        ${price ? `
          <div class="as-rating-group" style="visibility: ${rating ? 'visible' : 'hidden' }">
          <svg class="as-rating" aria-labelledby="as-rating-title" role="img">
            <use xlink:href="#bhf_icon-rating"></use>
            <title id="as-rating-title">${getConfig('msg.autosuggestRating')}</title>
          </svg>
          <svg class="as-rating as-rating-score" aria-labelledby="as-rating-title" role="img">
            <defs>
            <clipPath id="mask-rating-${index}">
              <rect x="0" y="0" width="${ratingToPercentage(rating)}" height="100%" />
            </clipPath>
            </defs>
            <rect  />
            <use xlink:href="#bhf_icon-rating" clip-path="url(#mask-rating-${index})"></use>
            <title id="as-rating-title">${getConfig('msg.autosuggestRating')}</title>
          </svg>
        </div>
        <span class="as-info">${qtdoffers > 1 ? `${qtdoffers} ofertas a partir de:` : ''}</span>` : ''}
        ${price ?`<span class="as-price">${formatMoney(price,true)}</span>`:'<span class="as-unavailable">Ops! Já vendemos todo o estoque. </span>'}
      </a>
    </li>`;
};

const autosuggestContainerTpl = (products, term = '', _getConfig = getConfig) => `
  <div class="${getConfig('headerPrefix')}tooltip-title">${_getConfig('msg.autosuggestTitle')}</div>
  <ul class="as-lst sizer szr-${products.length}">
    ${products.map((p) => autosuggestLineTpl(p, term)).join('')}
  </ul>`;
const autocompleteLineTpl = ({term, category, url, q, index}) => `
  <li class="ac-lst-it sz sz-${index}">
    <a class="ac-lnk src-lnk ac-term-key" href="${url}${url.indexOf('?') >= 0 ? '&' : '?'}${getConfig('search.queryParam')}=${encodeURIComponent(term)}&chave_search=acterm">
      ${wrapMatch(q, term, '<span class="ac-term">$1</span>')} ${category ? `${getConfig('msg.searchTermAtCategory')} <span class="ac-dep">${category}</span>` : ''}
    </a>
  </li>`;

const autocompleteContainerTpl = ({terms, searchUrl, q}) => `
    <div class="${getConfig('headerPrefix')}tooltip-title">${getConfig('msg.autocompleteTitle')}</div>
    <ul class="ac-lst sizer szr-${terms.length}">
      ${terms.map((t, i) => autocompleteLineTpl({term: t.term, category: t.category, url: searchUrl, q, index: (i+1)})).join('')}
    </ul>`;

const historyLineTpl = ({term, rank, url, index}) => `
  <li class="ac-lst-it sz sz-${index}">
    <a class="ac-lnk src-lnk ac-history-key" href="${url}${url.indexOf('?') >= 0 ? '&' : '?'}${getConfig('search.queryParam')}=${encodeURIComponent(term)}&chave_search=achistory">
      <span class="ac-term" data-rank="${rank}">${term}</span>
    </a>
  </li>`;

const historyContainerTpl = ({terms, searchUrl}) => `
    <div class="${getConfig('headerPrefix')}tooltip-title">${getConfig('msg.searchHistoryTitle')}</div>
    <ul class="ac-lst sizer szr-${terms.length}">
      ${terms.map((t, i) => historyLineTpl({term: t.value, rank: t.rank, url: searchUrl, index: (i+1)})).join('')}
    </ul>`;

/**
 * Main
 * Initiate module
 */
function prerender(mod){

  searchInput = mod.element.querySelector('.src-input');
  searchClean = mod.element.querySelector('.src-btn-clean');
  searchClose = mod.element.querySelector('.src-close');
  searchBox   = mod.element.querySelector('.src-box');
  searchForm  = mod.element.querySelector('.src-form');
  modName = mod.name;

  const mod_open = mod.open;
  mod.open = function(cssClass = getConfig('classActive')){
    if(!mod.isEnabled()){
      return;
    }

    searchInput.focus();
    isScreenMedium(true) && !isFloat() && scrollTo(document.body, mod.element.offsetTop, 100);
    doSearch();
    mod_open(cssClass);
  };

  const mod_close = mod.close;
  mod.close = function(cssClass = getConfig('classActive')){
    removeClass(searchBox, cssClass);
    searchInput.blur();
    isScreenMedium(true) && !isFloat() && scrollTo(document.body, 0, 50);
    mod_close(cssClass);
  };

  mod.toggle = function(){
    return mod.isOpen() ? mod.close() : mod.open();
  };

  const mod_disable = mod.disable;
  mod.disable = function(){
    removeClass(searchBox, getConfig('classActive'));
    mod_disable();
  };

  mod.fill = function(term){
    searchInput.value = term || '';
  };

  mod.clear = function(){
    return mod.fill('');
  };
  mod.filter = {
    set: function(settings){
      if(!settings){
        Log('TypeError: search filter settings is required');
        return false;
      }

      if(settings.constructor == Object){
        settings = [settings];
      }

      if(settings.constructor !== Array){
        Log('TypeError: search filter settings must be an object or array of objects');
        return false;
      }

      var required = ['name', 'id'],
        optional = ['formAction', 'queryParam', 'placeholder'],
        errors = 0;
      for (var i = 0; i < settings.length; i++) {
        settings[i];
        for (var j = 0; j < required.length; j++) {
          if(!settings[i][required[j]]){
            Log('ReferenceError: search filter "' + required[j] + '" is required in settings #' + (i+1) + (settings[i].name || settings[i].id ? (' (' + (settings[i].name || settings[i].id) + ')') : ''));
            errors++;
          }
        }
      }

      if(!errors){
        searchSelectWrapper = mod.element.querySelector('.src-slc-wrapper');
        searchSelectWrapper && searchSelectWrapper.parentNode.removeChild(searchSelectWrapper);
        filter_render(settings);
        return true;
      }
      else{
        return false;
      }
    },
    add: function(setting){
      if(!setting){
        Log('TypeError: search filter setting is required');
        return false;
      }

      if(setting.constructor !== Object){
        Log('TypeError: search filter setting must be an object');
        return false;
      }

      searchSelect = mod.element.querySelector('.src-select');
      if(!searchSelect){
        return this.filter.set(setting);
      }

      var required = ['name', 'id'],
        optional = ['formAction', 'queryParam', 'placeholder'],
        errors = 0;
      for (var j = 0; j < required.length; j++) {
        if(!setting[required[j]]){
          Log('ReferenceError: search filter ' + required[j] + ' is required in settings #' + (i+1) + (setting.name || setting.id ? (' (' + (setting.name || setting.id) + ')') : ''));
          errors++;
        }
      }

      if(!errors){
        var flt = new Option(setting.name, setting.id, false, !!setting.selected);
        var setting_filter = document.createAttribute('data-settings');
        setting_filter.value = encodeURIComponent(JSON.stringify({
          id: setting.id,
          name: setting.name,
          formAction: setting.formAction || '',
          queryParam: setting.queryParam || '',
          placeholder: setting.placeholder || ''
        }));
        flt.setAttributeNode(setting_filter);
        searchSelect.options.add(flt);
        return true;
      }
      else{
        return false;
      }
    },
    get: function(){
      searchSelect = mod.element.querySelector('.src-select');
      if(!searchSelect || !searchSelect.options.length || !searchSelect.options[0].getAttribute('data-settings')){
        return null;
      }

      var settings = [];
      for (var i = 1; i < searchSelect.options.length; i++) {
        settings.push(JSON.parse(decodeURIComponent(searchSelect.options[i].getAttribute('data-settings'))));
      }
      return settings;
    },
    select: function(id){
      searchSelect = mod.element.querySelector('.src-select');
      if(!searchSelect || !searchSelect.options.length){
        return false;
      }
      searchSelect.value = id;
      addEvent(searchSelect, 'change', {}, true, true);
      return true;
    },
    current: function(){
      searchSelect = mod.element.querySelector('.src-select');
      if(!searchSelect || !searchSelect.selectedOptions.length || !searchSelect.selectedOptions[0].getAttribute('data-settings')){
        return null;
      }
      return JSON.parse(decodeURIComponent(searchSelect.selectedOptions[0].getAttribute('data-settings')));
    },
    clear: function(){
      mod.close();
      searchSelect = mod.element.querySelector('.src-select');
      if(!searchSelect){
        return false;
      }
      var brand_settings = JSON.parse(decodeURIComponent(searchSelect.options[0].getAttribute('data-settings')));
      filter_change(brand_settings);
      removeClass(mod.element, 'src-filter select');
      searchSelectWrapper = mod.element.querySelector('.src-slc-wrapper');
      searchSelectWrapper && searchSelectWrapper.parentNode.removeChild(searchSelectWrapper);
      return true;
    }
  };

  addListener(mod.element, 'focus', function(e){
    if(!mod.isOpen() && e.target.id !== getConfig('headerPrefix') + 'search-select'){
      // Altera o comportamento do overlay do Shoptime
      const [{title: brandVerify}] = document.getElementsByClassName('brd-link');
      if (brandVerify === 'Shoptime') {
        try {
          const overlay = document.getElementById('header-overlay');
          overlay.setAttribute('style', 'display: block');
        } catch(e) {}
      }
      // Fim do bloco do overlay do Shoptime
      mod.open();
      if(!!searchInput.value && hasClass(feather.header.element, getConfig('classHeaderMini'))){
        addClass(mod.element, 'mini-open');
      }
    }
  }, true);
  addListener(mod.element, 'blur', function(){
    mod.close();
  }, false);
  addListener(searchInput, 'keyup', function() {
    cleanSearch();
    doSearch();
  }, true);
  addListener(searchClean, 'click', function() {
    searchInput.value = '';
    renderAutocomplete('', '');
    removeClass(searchBox, 'active');
    cleanSearch();
    renderHistory();
  }, true);

  getConfig('search.filter') && mod.filter.set(getConfig('search.filter'));
  searchInput.value = getUrlParameter(getConfig('search.queryParam')) || getConfig('search.value') || '';
  cleanSearch();
}

/**
 * Add event listeners
 */
function complete(mod){
  addListener(searchForm, 'submit', function(e) {
    const actionUrl = searchForm.getAttribute('action');
    if(!searchInput.value || hasClass(mod.element, 'mini-open')){
      var filterCurrent = mod.filter.current();
      var isSellerOrNPL = filterCurrent.formAction.indexOf('lojista') >= 0 || filterCurrent.formAction.indexOf('lojas-proximas') >= 0;
      if(filterCurrent && isSellerOrNPL) {
        const cleanSearchUrl = actionUrl.split(filterCurrent.queryParam)[0];
        redirectEvent(searchForm, e, 'header.search', 'submit', cleanSearchUrl);
        e.preventDefault();
        window.location.href = cleanSearchUrl;
        return false;
      }
      searchInput.focus();
      e.preventDefault();
      removeClass(mod.element, 'mini-open');
      return false;
    }

    ranker.add(modName, searchInput.value, 1, getConfig('search.numSuggestions'));
    let redirectUrl = (getConfig([modName, 'redirect']) || {})[searchInput.value.toLowerCase()];
    const querySeparator = actionUrl.indexOf('?') >= 0 ? '&' : '?';
    let queryUrl = (actionUrl + querySeparator + searchInput.getAttribute('name') + '=' + encodeURIComponent(searchInput.value));
    redirectEvent(searchForm, e, 'header.search', 'submit', redirectUrl || queryUrl);

    if(queryUrl){
      e.preventDefault();
      window.location.href = queryUrl;
      return false;
    }

    if(redirectUrl){
      e.preventDefault();
      window.location.href = redirectUrl;
      return false;
    }
  }, true);
  addListener(searchClose, 'click', function(e){
    mod.close();
    e.preventDefault();

  }, false);
}

const debounced = debounce(function(){
  fetchData(searchInput.value);
}, getConfig('search.timeout'));

function doSearch(){
  var filterCurrent = mod.filter.current();
  if(filterCurrent && filterCurrent.id !== '0'){
    return;
  }

  if(searchInput.value + lastSearch === '' || searchInput.value != lastSearch){
    lastSearch = searchInput.value;
    if(lastSearch.length > 1){

      debounced();
    }
    else{
      render(undefined, searchInput.value);
    }
  }
  else if(searchInput.value === lastSearch && searchBox.children.length){
    addClass(searchBox, getConfig('classActive'));
    !searchBox.querySelector('.src-autocomplete') && addClass(searchBox, 'no-atc');
    !searchBox.querySelector('.src-suggestion') && addClass(searchBox, 'no-sgs');
  }
}

function fetchData(term = '') {

  SearchGateway(term)
    .then((data) => render(data, term))
    .catch((data) => LogError('Search request error: ', data));
}

function render(data, term){
  searchBox.innerHTML = '';

  // FIX: avoid render duplicated content
  // when data is fetched
  setTimeout(function(){}, 10);
  let atc = renderAutocomplete(data, term),
    sgs = renderSuggestion(data, term),
    flt = mod.filter.current(),
    rmv = ['empty', 'no-result', 'no-atc', 'no-sgs', 'filter'];

  if(!term){
    let hst = renderHistory();
    !hst && rmv.push(getConfig('classActive'));
    addClass(searchBox, rmv.splice(0, 1)[0]);
  }
  else if(!atc && !sgs){//no result
    rmv.push(getConfig('classActive'));
    addClass(searchBox, rmv.splice(1, 1)[0]);
  }
  else if(!atc){//no autocomplete
    addClass(searchBox, rmv.splice(2, 1)[0]);
  }
  else if(!sgs){//no suggestion
    addClass(searchBox, rmv.splice(3, 1)[0]);
  }

  removeClass(searchBox, rmv.join(' '));

  //WARNING: currently no atc/sgs for filters
  if(flt && flt.id !== '0'){// filtering
    addClass(searchBox, 'filter');
  }
}

function filter_render(settings){
  searchSelectWrapper = addClass(document.createElement('div'), 'src-slc-wrapper');
  searchSelectArrow =
  `<svg class="src-slc-arrow" role="img">
    <use xlink:href="#bhf_icon-arrow"></use>
  </svg>`;
  searchSelect = addClass(document.createElement('select'), 'src-select');
  searchSelect.id = getConfig('headerPrefix') + 'search-select';

  var tab = document.createAttribute('tabindex');
  tab.value = searchInput.getAttribute('tabindex');
  searchSelect.setAttributeNode(tab);

  var brand = new Option(getConfig('name') || getConfig('title') || getConfig('brand'), '', true, false);
  var settings_brand = document.createAttribute('data-settings');
  settings_brand.value = encodeURIComponent(JSON.stringify({
    id: '0',
    name: getConfig('name') || getConfig('title') || getConfig('brand'),
    formAction: getConfig('search.formAction'),
    queryParam: getConfig('search.queryParam'),
    placeholder: getConfig('msg.searchPlaceholder')
  }));
  brand.setAttributeNode(settings_brand);
  searchSelect.options.add(brand);

  var selected = false;
  for (var i = 0, flt, settings_filter; i < settings.length; i++) {
    selected = selected || !!settings[i].selected;
    flt = new Option(settings[i].name, settings[i].id, false, !!settings[i].selected);
    settings_filter = document.createAttribute('data-settings');
    settings_filter.value = encodeURIComponent(JSON.stringify({
      id: settings[i].id,
      name: settings[i].name,
      formAction: settings[i].formAction || '',
      queryParam: settings[i].queryParam || '',
      placeholder: settings[i].placeholder || ''
    }));
    flt.setAttributeNode(settings_filter);
    searchSelect.options.add(flt);
    filter_change(settings[i]);
  }

  !selected && (searchSelect.options[1].selected = true);

  searchSelectWrapper.appendChild(searchSelect);
  searchSelect.insertAdjacentHTML('afterend', searchSelectArrow);
  searchInput.parentNode.insertBefore(searchSelectWrapper, searchInput);

  filter_addEvents();
  addClass(mod.element, 'src-filter');
  mod.close();
}

function filter_addEvents(){
  addListener(searchSelect, 'focus', function(){
    addClass(mod.element, getConfig('classFocus'));
  }, false);
  addListener(searchSelect, 'blur', function(){
    removeClass(mod.element, getConfig('classFocus'));
  }, false);
  addListener(searchSelect, 'change', function(e){
    var settings = JSON.parse(decodeURIComponent(e.target.selectedOptions[0].getAttribute('data-settings')));
    filter_change(settings);
    mod.close();
    searchInput.focus();
  });
}

function filter_change(settings){
  settings.formAction && (searchForm.action = settings.formAction);
  settings.queryParam && (searchInput.name = settings.queryParam);
  settings.placeholder && (searchInput.placeholder = settings.placeholder);
}

function renderAutocomplete(model = {}, q = '') {
  let autocomplete = searchBox.querySelector('.src-autocomplete');
  autocomplete && autocomplete.parentNode.removeChild(autocomplete);
  if(getConfig('search.terms') !== true || !model.terms || !model.terms.length){
    return false;
  }

  let filterCurrent = mod.filter.current();
  let searchUrl = filterCurrent ? filterCurrent.formAction : getConfig('search.searchUrl');

  autocomplete = addClass(document.createElement('div'), 'src-autocomplete');
  autocomplete.innerHTML = autocompleteContainerTpl({terms: model.terms, searchUrl: searchUrl, q: q});
  addLinkEvents(autocomplete, 'header.search.autocomplete');
  searchBox.appendChild(autocomplete);
  mod.isOpen() && addClass(searchBox, getConfig('classActive'));
  return true;
}

function sendMetrics(url) {
  if ('sendBeacon' in navigator) {
    window.addEventListener('unload', () => {
      navigator.sendBeacon(url);
    });
  } else{
    request({url: url});
  }
}

function impressionTracking(element){
  const url = element.getAttribute('data-impressionUrl');
  if (url) {
    sendMetrics(url);
  }
  return element;
}

function clickTracking(element){
  const url = element.getAttribute('data-clickUrl');
  if (url) {
    addListener(element, 'click', function() {
      sendMetrics(url);
    }, true);
  }
  return element;
}

function renderSuggestion(model = {}, term = '') {

  let suggestion = searchBox.querySelector('.src-suggestion');

  suggestion && suggestion.parentNode.removeChild(suggestion);
  if(getConfig('search.products') !== true || !model.products || !model.products.length || isScreenSmaller()){
    return false;
  }

  return request({
    url: getConfig('api.product'),
    query: makeProductQuery({
      products: model.products.map(item => item.id),
      //fields: ['name', 'images', 'offers', 'rating']
    })
  })
  .then((data) => {
    const offer = data.json.offer.result;
    const product = data.json.product.result;

    let offersData = offer instanceof Array ? offer : [offer];
    offersData = offersData.map(getOffersInfo);

    let productsData  = product instanceof Array ? product : [product];
    productsData = productsData
      .map(getProductInfo)
      .map(product => {
        const modelProduct = model.products.find(p => p.id === product.id);
        const p = product;
        p.isAds = modelProduct.type === 'ads';
        p.impressionUrl = modelProduct.impressionUrl;
        p.clickUrl = modelProduct.clickUrl;
        p.url = modelProduct.url;
        return p;
      });

    for (var i=0; i < productsData.length; i++){
      productsData[i].price = offersData[i].price;
      productsData[i].qtdoffers = offersData[i].qtdoffers;
    }
    suggestion = addClass(document.createElement('div'), 'src-suggestion');
    suggestion.innerHTML = autosuggestContainerTpl(productsData, term);
    addLinkEvents(suggestion, 'header.search.autosuggest');

    Array.from(suggestion.querySelectorAll('.ac-product-key'))
    .map(impressionTracking)
    .map(clickTracking);
    searchBox.appendChild(suggestion);
    mod.isOpen() && addClass(searchBox, getConfig('classActive'));
    return true;
  })
  .catch((data) => {
    Log('Suggestion request error: ', data);
    return false;
  });

}

function renderHistory() {
  let terms = ranker.get(modName, getConfig('search.numSuggestions'));
  let history = searchBox.querySelector('.src-history');
  history && history.parentNode.removeChild(history);
  if(getConfig('search.history') === false || !terms || !terms.length){
    return false;
  }

  let filterCurrent = mod.filter.current();
  let searchUrl = filterCurrent ? filterCurrent.formAction : getConfig('search.searchUrl');

  history = addClass(document.createElement('div'), 'src-history');
  history.innerHTML = historyContainerTpl({terms, searchUrl: searchUrl});
  addLinkEvents(history, 'header.search.history');
  searchBox.appendChild(history);
  addClass(searchBox, getConfig('classActive'));
  return true;
}

function addLinkEvents(target, source) {
  let eventLinks = target.querySelectorAll('.src-lnk');
  for (var i = 0, len = eventLinks.length; i < len; i++) {
    var lnk = eventLinks[i];
    lnk.getAttribute('href') &&
    lnk.getAttribute('href') !== '#' &&
    addLinkClick(lnk, source);
  }
}
function addLinkClick(link, source){
  smartClick(link, function(event) {
    if (source == 'header.search.autosuggest') {
      redirectEvent(link, event, source);
    }
    else {//term and history
      ranker.add(modName, link.innerText, 1, getConfig('search.numSuggestions'));
      let redirectUrl = (getConfig([modName, 'redirect']) || {})[link.innerText.toLowerCase()];
      let linkUrl = link.getAttribute('href');
      redirectEvent(link, event, source, 'click', redirectUrl || linkUrl);
      if(redirectUrl){
        event.preventDefault();
        window.location.href = redirectUrl;
      }
    }
  }, true);
}

function makeProductQuery({products = [], /*fields = [], responseGroups = ['small'], paymentOptions = ['CARTAO_VISA'],*/ log = Log}) {

  if (!Array.isArray(products) || products.length === 0) {
    log('Product id must be an array of strings');
    return;
  }
  return [
    `?id=${products.join('&id=')}`
  ]
  .join('&');
}

/**
 * Get image url according to size order
 */
function getProductImage(data = {}, log = Log) {

  let imageSizes = prop(['images'], data);

  if (!imageSizes || imageSizes.length === 0) {
    log('Array of image not defined');
    return '';
  }

  imageSizes = imageSizes[0];

  let sizesOrder     = ['medium', 'big', 'small', 'large', 'extraLarge'];
  let imageSizesKeys = Object.keys(imageSizes);

  if (imageSizesKeys.reduce((acc, key) => sizesOrder.indexOf(key), 0) < 0) {
    log('Image size unknown');
    return '';
  }

  return  sizesOrder
            .map((size) => imageSizes[size])
            .filter((url) => !!url)
            .reverse()
            .reduce((acc, value) => value, '');
}

/**
 * Get and round rating
 */
function getProductRating(data = {}) {

  let average = prop(['rating', 'average'], data);

  return average ? (Math.round(average * 2) / 2) : 0;
}

function getProductInfo(data, index) {
  return {
    id: data.id,
    name: data.name,
    url: `/produto/${data.id}`,
    image: getProductImage(data),
    //price: data.offers[0].salesPrice,
    rating: getProductRating(data),
    //installment: getInstallments(data),
    index: (index + 1)
  };
}
function getOffersInfo(data) {
  if(data.offers && data.offers.length == 0){
    return false;
  }
  return {
    price: data.offers != undefined ? data.offers[0].salesPrice : null,
    qtdoffers: data.offers != undefined ? data._result.total : null,
  };
}

// Não precisa extender pq não está adiconando nada!
class search extends Module{
  constructor(){
    super('search', {
      prerender,
      //render,
      complete
    });
  }
}
const mod = new search();
// Export private functions for testing
mod._private = {
  makeProductQuery: makeProductQuery,
  getProductImage: getProductImage,
  getProductRating: getProductRating
};
mod.init();

export default mod;
