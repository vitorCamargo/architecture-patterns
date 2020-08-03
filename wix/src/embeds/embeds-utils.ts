/* eslint-disable @typescript-eslint/prefer-for-of,prefer-const */

export const DAYS_2KEEP = 90;
export const COOKIE_NAME = '_wixCIDX';

export function readCookie(cookieName: string): string {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    let _a = cookie.split('='),
      name = _a[0],
      value = _a[1];

    if (name) {
      name = name.trim();
      if (name === cookieName) {
        return value;
      }
    }
  }
  return '';
}

export function writeCookie(name: string, value: string, domain: string, days: number, secure = true) {
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = '; expires=' + date.toUTCString();
  }
  document.cookie =
    name +
    '=' +
    (value || '') +
    '; domain=' +
    domain +
    expires +
    '; path=/;SameSite=None;' +
    (secure ? 'Secure;' : '');
}

function polyfillEndsWith() {
  // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith
  if (!String.prototype.endsWith) {
    String.prototype.endsWith = function(search, this_len) {
      if (this_len === undefined || this_len > this.length) {
        this_len = this.length;
      }
      return this.substring(this_len - search.length, this_len) === search;
    };
  }
}

export function getDomainAndUrl() {
  polyfillEndsWith();

  if (window.location.hostname.endsWith('wix.com')) {
    return ['wix.com', 'https://manage.editorx.com/_api/synchronize-cookie'];
  } else if (window.location.hostname.endsWith('editorx.com')) {
    return ['editorx.com', 'https://manage.wix.com/_api/synchronize-cookie'];
  } else {
    return [undefined, undefined];
  }
}

export function fetchDomainB(
  domainB: string,
  cookie: string,
  onResponseData?: (value: string) => void,
  onResponseEmpty?: () => void
) {
  fetch(domainB + '/?cidx=' + cookie, { credentials: 'include' })
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      if (data[COOKIE_NAME]) {
        if (onResponseData) {
          return onResponseData(data[COOKIE_NAME]);
        }
      } else {
        if (onResponseEmpty) {
          return onResponseEmpty();
        }
      }
    })
    .catch(function(error) {
      return console.error(error);
    });
}
