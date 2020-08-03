/*!
 * utilities of all sorts
 */

import getConfig from './getConfig';
import { get as cookieGet } from './cookie';

export function hasClass(el, className) {
  if (el && el.classList) return el.classList.contains(className);
  else
    return el && !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
}

export function addClass(el, className) {
  let classes = (className || '').split(' ');
  for (var i = classes.length - 1; i >= 0; i--) {
    if (el && el.classList) el.classList.add(classes[i]);
    else if (el && !hasClass(el, classes[i])) el.className += ' ' + classes[i];
  }
  return el;
}

export function removeClass(el, className) {
  let classes = (className || '').split(' ');
  for (var i = classes.length - 1; i >= 0; i--) {
    if (el.classList) {
      el.classList.remove(classes[i]);
    } else if (hasClass(el, classes[i])) {
      var reg = new RegExp('(\\s|^)' + classes[i] + '(\\s|$)');
      el.className = el.className.replace(reg, '');
    }
  }
  return el;
}

export function toggleClass(el, className) {
  if (el.classList) return el.classList.toggle(className);
  else
    return hasClass(el, className)
      ? removeClass(el, className)
      : addClass(el, className);
}

export function formatMoney(
  value,
  includeCurrency,
  digits,
  separatorDec,
  separatorThou
) {
  value = value || 0;
  digits = isNaN((digits = Math.abs(digits))) ? 2 : digits;
  separatorDec = separatorDec == undefined ? ',' : separatorDec;
  separatorThou = separatorThou == undefined ? '.' : separatorThou;
  let s = value < 0 ? '-' : '',
    i = parseInt((value = Math.abs(+value || 0).toFixed(digits))) + '',
    j = (j = i.length) > 3 ? j % 3 : 0,
    c = includeCurrency
      ? (includeCurrency === true
          ? getConfig('msg.currencySymbol')
          : includeCurrency) + ' '
      : '';
  return (
    c +
    s +
    (j ? i.substr(0, j) + separatorThou : '') +
    i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + separatorThou) +
    (digits
      ? separatorDec +
        Math.abs(value - i)
          .toFixed(digits)
          .slice(2)
      : '')
  );
}
export function addListener(elem, types, fn, useCapture) {
  if (types.constructor == String) {
    types = [types];
  }

  for (var i = types.length - 1; i >= 0; i--) {
    if (elem.addEventListener) {
      elem.addEventListener(types[i], fn, useCapture || false);
    } else if (elem.attachEvent) {
      elem.attachEvent('on' + types[i], function() {
        return fn.call(elem, window.event);
      });
    } else {
      elem['on' + types[i]] = fn;
    }
  }

  return elem;
}
export function removeListener(elem, types, fn, useCapture) {
  if (types.constructor == String) {
    types = [types];
  }

  for (var i = types.length - 1; i >= 0; i--) {
    if (elem.removeEventListener) {
      elem.removeEventListener(types[i], fn, useCapture || false);
    } else if (elem.detachEvent) {
      elem.detachEvent('on' + types[i], function() {
        return fn.call(elem, window.event);
      });
    } else {
      elem['on' + types[i]] = fn;
    }
  }
  return elem;
}

const getScreenWidth = function() {
  if (!window || !document) {
    return false;
  }
  var w = window,
    d = document,
    e = d.documentElement,
    b = d.getElementsByTagName('body')[0],
    x = w.innerWidth || e.clientWidth || b.clientWidth || 0;
  return x;
};

export function isScreenSmaller() {
  return getScreenWidth() < getConfig('screenWidthBreakpoint_sm');
}

export function isScreenSmall(orSmaller = false) {
  const sw = getScreenWidth();
  return (
    (orSmaller || sw >= getConfig('screenWidthBreakpoint_sm')) &&
    sw < getConfig('screenWidthBreakpoint_md')
  );
}

export function isScreenMedium(orSmaller = false) {
  const sw = getScreenWidth();
  return (
    (orSmaller || sw >= getConfig('screenWidthBreakpoint_md')) &&
    sw < getConfig('screenWidthBreakpoint_lg')
  );
}

export function isScreenLarge(orSmaller = false) {
  const sw = getScreenWidth();
  return (
    (orSmaller || sw >= getConfig('screenWidthBreakpoint_lg')) &&
    sw < getConfig('screenWidthBreakpoint_xl')
  );
}

export function isScreenLarger() {
  return getScreenWidth() >= getConfig('screenWidthBreakpoint_xl');
}

export function isTouchable() {
  var nie =
    window &&
    document &&
    ('ontouchstart' in window ||
      (window.DocumentTouch && document instanceof DocumentTouch) ||
      false);
  var ie =
    navigator &&
    (navigator.maxTouchPoints || navigator.msMaxTouchPoints || 0) > 0;
  return nie || ie;
}

export function smartKeydown(element, config, useCapture) {
  if (!element || !config || config.constructor !== Object) {
    return;
  }

  addListener(
    element,
    'keydown',
    function(e) {
      let key = e.keyCode || e.which;
      if (key && config[key] && config[key].constructor == Function) {
        config[key](e);
      }
    },
    !!useCapture
  );
}

export function smartHover(elem, inFn, outFn, useCapture) {
  let timeout;
  if (
    (!inFn || inFn.constructor !== Function) &&
    (!outFn || outFn.constructor !== Function)
  ) {
    return;
  }
  inFn &&
    addListener(
      elem,
      'mouseenter',
      function(e) {
        if (!isScreenMedium(true)) {
          clearTimeout(timeout);
          return inFn(e);
        }
      },
      useCapture
    );
  outFn &&
    addListener(
      elem,
      'mouseleave',
      function(e) {
        if (!isScreenMedium(true)) {
          timeout = setTimeout(function() {
            return outFn(e);
          }, 300);
        }
      },
      useCapture
    );
}
export function smartClick(elem, fn, useCapture) {
  if (!fn || fn.constructor !== Function) {
    return;
  }
  var clicked = false;
  if (isTouchable()) {
    addListener(
      elem,
      'touchstart',
      function(e) {
        clicked = new Date().getTime();
      },
      useCapture
    );
    addListener(
      elem,
      'touchmove',
      function(e) {
        clicked = false;
      },
      useCapture
    );
    addListener(
      elem,
      'touchend',
      function(e) {
        if (clicked && clicked + 500 > new Date().getTime()) {
          clicked = false;
          return debounce(fn(e), 100, true);
        }
      },
      useCapture
    );
  }
  addListener(
    elem,
    'click',
    function(e) {
      return debounce(fn(e), 100, true);
    },
    useCapture
  );
}
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
export function debounce(func, wait = 100, immediate = false) {
  let timeout;
  return function() {
    let context = this,
      args = arguments;
    if (immediate && !timeout) func.apply(context, args);
    clearTimeout(timeout);
    timeout = setTimeout(function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    }, wait);
  };
}

export function getUrlParameter(name, url) {
  if (!url && !!window) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

export function guid() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
}

export function removeAccents(text) {
  let r = (text || '').toLowerCase(),
    i,
    nonAsciis = {
      a: '[àáâãäå]',
      ae: 'æ',
      c: '[ç]',
      e: '[èéêë]',
      i: '[ìíîï]',
      n: 'ñ',
      o: '[òóôõö]',
      oe: 'œ',
      u: '[ùúûűü]',
      y: '[ýÿ]'
    };

  for (i in nonAsciis) {
    r = r.replace(new RegExp(nonAsciis[i], 'g'), i);
  }
  return r;
}

export function kebabCase(name) {
  name = removeAccents(name)
    .replace(/&/g, 'e')
    .replace(/[^._a-zA-Z0-9]/g, '-')
    .replace(/-{2,}/g, '-');
  return name;
}

export function addEvent(
  element,
  name,
  detail,
  bubbles = false,
  cancelable = false
) {
  if (!document || typeof name !== 'string') {
    return false;
  }

  element = element || document;
  let event;
  if (typeof CustomEvent !== 'undefined') {
    event = new CustomEvent(name, {
      detail: detail,
      bubbles: bubbles,
      cancelable: cancelable
    });
  } else if ('createEvent' in document) {
    //IE
    event = document.createEvent('CustomEvent');
    event.initCustomEvent(name, bubbles, cancelable, detail);
  }

  event && element.dispatchEvent(event);
  return !!event;
}
//TODO: removeEvent should be included if needed

export function redirectEvent(
  element,
  event,
  source = 'header',
  type = 'click',
  redirectTo
) {
  if (
    !element ||
    (!element.getAttribute('href') && !redirectTo) ||
    element.getAttribute('href') == '#'
  ) {
    event && 'preventDefault' in event && event.preventDefault();
    return false;
  }

  return addEvent(
    element,
    'location:redirect',
    {
      type: type,
      redirectTo: element.getAttribute('href') || redirectTo,
      event: event,
      source: source
    },
    true,
    true
  );
}

export function isElementInViewport(element, fully = false) {
  var rect = element && element.getBoundingClientRect();
  return (
    !rect ||
    (rect.top + (fully ? rect.height : 0) <=
      (window.innerHeight || document.documentElement.clientHeight) &&
      rect.left + (fully ? rect.width : 0) >= 0 &&
      rect.bottom - (fully ? rect.height : 0) >= 0 &&
      rect.right - (fully ? rect.width : 0) <=
        (window.innerWidth || document.documentElement.clientWidth))
  );
}

export function scrollTo(element, to, duration, horizontal) {
  var direction = horizontal ? 'scrollLeft' : 'scrollTop';
  if (duration <= 0) return;
  var difference = to - element[direction];
  var perTick = (difference / duration) * 10;

  setTimeout(function() {
    element[direction] = element[direction] + perTick;
    if (element[direction] === to) return;
    scrollTo(element, to, duration - 10);
  }, 10);
}

export function lazyLoadScript(scriptId, elemVisibleId) {
  let elVisibleId = document.getElementById(elemVisibleId);
  for (var i = 0; i < scriptId.length; i++) {
    const srcId = document.getElementById(scriptId[i]);
    const lazyscript = debounce(function() {
      if (srcId && isElementInViewport(elVisibleId)) {
        let dataSrcAttributeValue = srcId.getAttribute('data-src');

        if (dataSrcAttributeValue) {
          srcId.setAttribute('src', dataSrcAttributeValue);
          srcId.removeAttribute('data-src');
          removeListener(window, 'scroll', lazyscript);
        }
      }
    }, 250);

    lazyscript();
    addListener(window, 'scroll', lazyscript);
  }
}

export function getBrand() {
  return getConfig('brand');
}

//funcao utiliza para verificar se estamos no ambiente de televendas ou Quiosque
export function isQlasTsal() {
  return (
    cookieGet('b2wChannel') &&
    (cookieGet('b2wChannel').toLowerCase() == 'qlas' ||
      cookieGet('b2wChannel').toLowerCase() == 'tsal')
  );
}

export function deviceType() {
  let deviceType = 'desktop';
  if (cookieGet('b2wDeviceType')) {
    const fromCookie = cookieGet('b2wDeviceType').toLowerCase();
    if (fromCookie === 'mobile') {
      deviceType = fromCookie;
    }
    // else if(fromCookie === 'tablet'){
    // 	deviceType = "desktop";
    // }
  }
  return deviceType;
}
export function reverseDate(date) {
  if (date.indexOf('-') != -1) {
    const newdate = date
      .split('-')
      .reverse()
      .join('/');
    return newdate;
  }
}

export function b64DecodeUnicode(str) {
  return decodeURIComponent(
    atob(str)
      .split('')
      .map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );
}

export function subDomain() {
  const full = window.location.host;
  var parts = full.split('.');
  var sub = parts[0];
  return sub;
}
export function isMobile(){
  return window.screen.width <= 767;
}

export default {
  hasClass,
  removeClass,
  addClass,
  addEvent,
  addListener,
  formatMoney,
  kebabCase,
  isScreenSmall,
  isScreenMedium,
  isScreenLarge,
  isScreenLarger,
  smartHover,
  smartClick,
  isTouchable,
  debounce,
  getUrlParameter,
  redirectEvent,
  scrollTo,
  smartKeydown,
  isQlasTsal,
  deviceType,
  reverseDate,
  subDomain
};
