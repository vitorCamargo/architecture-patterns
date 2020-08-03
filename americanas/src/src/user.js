/*
 * User
 */
import getConfig from './../utils/getConfig';
import * as cookie from './../utils/cookie';
import request from './../utils/request';
import Module from './../utils/module';
import Cache from './../utils/cache';
import { isPrime, isPrimeFromAPI } from './../services/prime';
import * as Skin from './../services/skin';
import {
  hasClass,
  addClass,
  removeClass,
  smartClick,
  smartHover,
  addListener,
  redirectEvent,
  reverseDate,
  subDomain
} from './../utils/utils';

let customerId,
  customerApiToken,
  customerNick,
  tipBox, //:D
  userAccount,
  userAction,
  userBox,
  userIcon,
  userGreeting,
  userGrtText,
  userLink,
  alertText,
  userFacebookAvatar,
  loginRequest = false,
  subDomains = getConfig('subDomains') || [];

const prerender = function(mod) {
  userBox && userBox.remove();
  customerId = cookie.get('customer.id') || getConfig('customerId', '');
  customerApiToken =
    cookie.get('customer.api.token') ||
    getConfig('customerApiTokenCookieKey', '');
  customerNick =
    cookie.get(getConfig('brand') + 'Nick') || getConfig('customerNick', '');
  tipBox = addClass(document.createElement('div'), 'usr-tip arrow-top-center');
  userAccount = mod.element.querySelector('.usr-actions');
  userAction = mod.element.querySelector('.usr-act-text');
  userBox = addClass(
    document.createElement('div'),
    'box usr-box ' + getConfig('headerPrefix') + 'tooltip arrow-top-center'
  );
  userIcon = mod.element.querySelector('.usr-icon');
  userGreeting = mod.element.querySelector('.usr-greeting');
  userGrtText = mod.element.querySelector('.usr-grt-text');
  userLink = mod.element.querySelector('.usr-link');
  userFacebookAvatar = cookie.get('b2wFacebookAvatar');

  if (customerNick === undefined || customerNick === 'undefined') {
    customerNick = '';
  }

  if ((getConfig('wishlist.active') || getConfig('lists.active')) && getConfig('brand') === 'shop') {
    addClass(userBox, 'usr-box-with-wishlist');
  }

  const mod_tip = mod.tip;
  mod.tip = function(duration = 10000) {
    return tipBox.hasChildNodes() && mod_tip(tipBox.outerHTML, duration);
  };

  mod.tipBox = function(duration = 10000) {
    return userBox.hasChildNodes() && mod_tip && mod_tip(userBox.outerHTML, duration);
  };
};

const getCurrentHref = () => {
  if (typeof window !== 'undefined') {
    return encodeURIComponent(window.location.href);
  } else {
    return undefined;
  }
};

export const appendNext = (
  url,
  _getCurrentHref = getCurrentHref,
  _getConfig = getConfig
) => {
  if (_getConfig('user.nextForwarding') === false) {
    return url;
  }

  let nextHref = _getCurrentHref();
  let nextKey = _getConfig('user.nextKey');

  if (typeof nextHref === 'undefined') {
    return url;
  }

  return /\?/.test(url)
    ? `${url}&${nextKey}=${nextHref}`
    : `${url}?${nextKey}=${nextHref}`;
};

export const noAlertPrime = () => {
  const primeApiUrl = getConfig('api.prime');
  const data = JSON.stringify({
    enabledRenewalWarning: false
  });
  const xhr = new XMLHttpRequest();

  xhr.addEventListener('readystatechange', function() {
    if (this.readyState === 4) {
      if (document.querySelector('.usr-alert-prime')) {
        document.querySelector('.usr-alert-prime').remove();
      }
      if (this.status == 403) {
        cookie.set('customer.alert.prime', customerId + ':' + false);
      }
      if (this.status == 204) {
        cookie.set('customer.alert.prime', customerId + ':' + true);
      }
    }
  });

  xhr.open('POST', primeApiUrl + customerId + '/preference');
  xhr.setRequestHeader('access-token', customerApiToken);
  xhr.setRequestHeader('content-type', 'application/json');
  xhr.setRequestHeader('cache-control', 'no-cache');
  xhr.send(data);
};

const render = function(mod) {
  (getConfig('wishlist.active') || getConfig('lists.active')) &&
    document.getElementById('bhd').classList.add('has-favorites');
  if (!Array.prototype.findIndex) {
    Object.defineProperty(Array.prototype, 'findIndex', {
      value: function(predicate) {
        // 1. Let O be ? ToObject(this value).
        if (this == null) {
          throw new TypeError('"this" is null or not defined');
        }

        var o = Object(this);

        // 2. Let len be ? ToLength(? Get(O, "length")).
        var len = o.length >>> 0;

        // 3. If IsCallable(predicate) is false, throw a TypeError exception.
        if (typeof predicate !== 'function') {
          throw new TypeError('predicate must be a function');
        }

        // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
        var thisArg = arguments[1];

        // 5. Let k be 0.
        var k = 0;

        // 6. Repeat, while k < len
        while (k < len) {
          // a. Let Pk be ! ToString(k).
          // b. Let kValue be ? Get(O, Pk).
          // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
          // d. If testResult is true, return k.
          var kValue = o[k];

          if (predicate.call(thisArg, kValue, k, o)) {
            return k;
          }

          // e. Increase k by 1.
          k++;
        }

        // 7. Return -1.
        return -1;
      }
    });
  }
  function appendDefaultItems(includeSignout) {
    let defaultItems = [];
    //TODO: automate default items generation - needs locale texts

    //account
    if (getConfig('user.accountUrl')) {
      let account = addClass(document.createElement('a'), 'usr-account');
      account.setAttribute('href', getConfig('user.accountUrl'));
      account.innerHTML = getConfig('msg.userAccount');
      defaultItems.push(account);
    }

    //orders
    if (getConfig('user.ordersUrl')) {
      let orders = addClass(document.createElement('a'), 'usr-orders');
      orders.setAttribute('href', getConfig('user.ordersUrl'));
      orders.innerHTML = getConfig('msg.userOrders');
      defaultItems.push(orders);
    }

    //wishlist
    if (getConfig('brand') === 'shop' && getConfig('wishlist.active')) {
      let wishlist = addClass(document.createElement('a'), 'usr-wishlist');
      wishlist.setAttribute('href', getConfig('wishlist.linkUrl'));
      wishlist.innerHTML = getConfig('msg.wishlistTitle');
      defaultItems.push(wishlist);
    }

    //lists
    if (getConfig('brand') === 'shop' && getConfig('lists.active')) {
      let lists = addClass(document.createElement('a'), 'usr-wishlist');
      lists.setAttribute('href', getConfig('lists.linkUrl'));
      lists.innerHTML = getConfig('msg.listsTitle');
      defaultItems.push(lists);
    }

    //facebook avatar
    if (userFacebookAvatar && customerNick) {
      document
        .getElementById('h_user')
        .querySelector(
          '.usr-icon-wrapper'
        ).innerHTML = `<img class="usr-avatar" src="${userFacebookAvatar}" alt="${customerNick}"/>`;
      if (getConfig('brand') === 'shop' && (getConfig('wishlist.active') || getConfig('lists.active'))) {
        addClass(
          document.getElementById('h_user').querySelector('.usr-icon-wrapper'),
          'facebook-wrapper'
        );
      }
    }

    if (includeSignout && getConfig('user.signoutUrl')) {
      //signout
      let signout = addClass(document.createElement('a'), 'usr-signout');
      signout.setAttribute('href', appendNext(getConfig('user.signoutUrl')));
      signout.innerHTML = getConfig('msg.userSignout');
      addListener(
        signout,
        'click',
        e => {
          Cache.remove('prime-data');
          return e;
        },
        false
      );
      defaultItems.push(signout);
    }

    let link,
      item,
      itemList = addClass(document.createElement('ul'), 'usr-items');
    for (var i = 0; i < defaultItems.length; i++) {
      link = defaultItems[i];
      addEvent(link);
      item = addClass(document.createElement('li'), 'usr-it');
      item.appendChild(link);
      itemList.appendChild(item);
    }

    userBox.appendChild(itemList);
    //alert prime
    let alertPrime = '';
    let iconAlertPrime = '';
    let date = '';
    let alertIcon = '';
    let alertMsg = '';

    function contentAlert(result, alertMsg, alertIcon, isStandard) {
      if (getConfig('brand') == 'acom') {
        return;
      }
      iconAlertPrime = addClass(
        document.createElement('div'),
        'alert-prime-icon-box-user'
      );
      iconAlertPrime.innerHTML = `<span class="alert-prime-icon ${alertIcon}-prime-icon">
          <svg aria-labelledby="usr-title" role="img">
            <use xlink:href="#bhf_icon-alert-${alertIcon}"></use>
            ${
              isStandard ? '<title id="usr-title">Assinatura Prime</title>' : ''
            }
          </svg>
        </span>`;
      alertPrime = addClass(document.createElement('div'), 'usr-alert-prime');
      date = result.expiration.split('T');
      alertPrime.setAttribute('id', 'alert-prime');

      if (getConfig('brand') == 'suba') {
        alertText = isStandard
          ? '<span class="usr-text">Sua assinatura <strong>Prime</strong></span>'
          : '';
      } else {
        alertText = isStandard
          ? '<span class="usr-text">Assinatura Prime</span>'
          : '';
      }

      alertPrime.innerHTML = `<div  class="alert-prime-icon-box">
          <span class="alert-prime-icon ${alertIcon}-prime-icon">
            <svg aria-labelledby="usr-title" role="img">
              <use xlink:href="#bhf_icon-alert-${alertIcon}"></use>
              <title id="usr-title">Alert Prime Title</title>
            </svg>
          </span>
        </div>
        <div class="usr-alert-prime-box">
          ${alertText}
          <span class="usr-text">${alertMsg}<strong>${reverseDate(
        date[0]
      )}.</strong></span>
          ${
            isStandard
              ? `<a href="${getConfig(
                  'user.primeProduct'
                )}" class="alert-prime-link">Renovar</a> | <span class="notPrime alert-prime-link">Não, obrigado</span>`
              : `<a href="${
                  alertIcon === 'error'
                    ? getConfig('user.primeProduct')
                    : getConfig('user.accountUrl')
                }" class="alert-prime-link">${
                  alertIcon === 'error' ? 'Assinar' : 'Minha conta'
                }</a> | <span class="notPrime alert-prime-link">${
                  alertIcon === 'error' ? 'Não, obrigado' : 'Entendi'
                }</span>`
          }
        </div>`;
      userBox.prepend(alertPrime, itemList);
      document
        .getElementById('h_user')
        .querySelector('.usr-link')
        .prepend(iconAlertPrime);

      if (cookie.get('customer.tip.prime')) {
        mod.tipBox();
      }

      if (
        !cookie.get('customer.tip.prime') ||
        cookie.get('customer.tip.prime').indexOf(customerId) == -1
      ) {
        mod.tipBox();
        cookie.set('customer.tip.prime', customerId + ':' + true);
      }

      let notPrime = document.querySelectorAll('.notPrime');
      [].map.call(notPrime, obj => {
        obj.addEventListener(
          'click',
          function() {
            if (document.querySelector('.usr-alert-prime')) {
              let usrAlertPrime = document.querySelectorAll('.usr-alert-prime');
              [].map.call(usrAlertPrime, objbox => {
                objbox.remove();
              });
              document.querySelector('.alert-prime-icon-box-user').remove();
            }
            noAlertPrime();
          },
          false
        );
      });
    }

    isPrimeFromAPI()
      .then(val => {
        if (
          cookie.get('customer.alert.prime').indexOf(customerId + ':false') !==
          -1
        ) {
          noAlertPrime();
        }

        const conditions =
          val._warnings &&
          val._warnings.findIndex(
            i => i.code === 'ALERT_SUBSCRIPTION_RENEWABLE'
          ) !== -1 &&
          customerNick &&
          (!cookie.get('customer.alert.prime') ||
            cookie.get('customer.alert.prime').indexOf(customerId) === -1);

        const isTrialExpired =
          val._warnings.findIndex(
            i => i.code === 'ALERT_TRIAL_SUBSCRIPTION_EXPIRED'
          ) !== -1;

        if (
          conditions ||
          val._warnings.findIndex(
            i => i.code === 'ALERT_TRIAL_SUBSCRIPTION_CLOSE_TO_EXPIRING'
          ) !== -1 ||
          isTrialExpired
        ) {
          alertIcon = isTrialExpired ? 'error' : 'warning';
          const isStandard = val.type === 'STANDARD';
          alertMsg = isStandard
            ? getConfig('msg.alertMsgRenwable')
            : isTrialExpired
            ? getConfig('msg.alertMsgTrialRenewableExpired')
            : getConfig('msg.alertMsgTrialRenewable');
          contentAlert(val, alertMsg, alertIcon, isStandard);
        }
      })
      .catch(val => {
        if (
          cookie.get('customer.alert.prime').indexOf(customerId + ':false') !==
          -1
        ) {
          noAlertPrime();
        }

        const isTrialExpired =
          val &&
          val._warnings &&
          val._warnings.findIndex(
            i =>
              i.code === 'ALERT_TRIAL_SUBSCRIPTION_EXPIRED' ||
              i.code === 'ALERT_TRIAL_SUBSCRIPTION_CLOSE_TO_EXPIRING'
          ) !== -1;

        if (
          (isTrialExpired && customerNick) ||
          (val &&
            val._warnings &&
            customerNick &&
            val._warnings.findIndex(
              i => i.code === 'ALERT_SUBSCRIPTION_RENEWABLE'
            ) !== -1 &&
            val._warnings.findIndex(i => i.code === 'SUBSCRIPTION_EXPIRED') !==
              -1 &&
            (!cookie.get('customer.alert.prime') ||
              cookie.get('customer.alert.prime').indexOf(customerId) !== -1))
        ) {
          alertIcon = 'error';
          alertMsg = isTrialExpired
            ? getConfig('msg.alertMsgTrialRenewableExpired')
            : getConfig('msg.alertMsgRenwableExpired');
          contentAlert(val, alertMsg, alertIcon, !isTrialExpired);
        }
      });

      if ((getConfig('wishlist.active') || getConfig('lists.active')) && getConfig('brand') === 'shop') {
        addClass(
          document.getElementById('h_user').querySelector('.usr-icon-wrapper'),
          'usr-icon-wrapper-with-wishlist'
        );
      }
  }

  function renderIn(msg = getConfig('msg')) {
    if (document.getElementById('bhf_icon-user-in')) {
      userIcon.outerHTML = `<svg class="usr-icon uic-in" aria-labelledby="usr-title" role="img">
          <use xlink:href="#bhf_icon-user-in"></use>
          <title id="usr-title">${getConfig('msg.userTitle')}</title>
        </svg>`;
    }

    if (getConfig('brand') == 'suba') {
      userAction.innerHTML = customerNick;
      userGrtText.innerHTML = '';
    } else {
      userAction.innerHTML = getConfig('msg.userActionsLogged');
      userGrtText.innerHTML = `${msg.userGreetingLogged} <span class="usr-nick">${customerNick}</span>`;
    }

    appendDefaultItems(true);
    userAccount.appendChild(userBox);
    addClass(mod.element, 'loggedin');
  }

  function renderOut() {
    //signin
    if (getConfig('user.signinUrl')) {
      let signin = addClass(
        document.createElement('a'),
        'usr-signin ' +
          getConfig('headerPrefix') +
          'btn ' +
          getConfig('headerPrefix') +
          'btn-secondary rp rp-primary'
      );
      signin.setAttribute('id', 'h_usr-signin');
      signin.setAttribute('href', appendNext(getConfig('user.signinUrl')));
      signin.innerHTML = getConfig('msg.userSignin');
      smartClick(signin, function(e) {
        return redirectEvent(signin, e, 'header.user');
      });

      userBox.appendChild(signin);
      tipBox.appendChild(signin.cloneNode(false));
    }

    //signinFace
    if (
      subDomains.findIndex(i => i == subDomain()) != -1 &&
      (location.protocol == 'https:' ||
        getConfig('loginFacebookHttp') === true) &&
      getConfig('user.signinUrl' && 'hasFacebookLogin')
    ) {
      //divisor
      let divisor = addClass(document.createElement('span'), 'signinDivisor');
      divisor.innerHTML = '';
      userBox.appendChild(divisor);
      tipBox.appendChild(divisor.cloneNode(true));

      //faceButton
      let signinFace = addClass(
        document.createElement('div'),
        '' + getConfig('headerPrefix') + 'btn-facebook-wrp'
      );
      signinFace.innerHTML =
        '<a id="h_usr-signinFace" class="usr-signin-face ' +
        getConfig('headerPrefix') +
        'btn ' +
        getConfig('headerPrefix') +
        `btn-secondary rp rp-primary" href="#">
        <span class="wrp-icon-face">
            <svg class="icon-face" aria-labelledby="usr-title" role="img">
              <use xlink:href="#bhf_icon-social-facebook02"></use>
            </svg>
          <span class="msg-btn-face">${getConfig('msg.userSigninFace')}</span>
        </span>
        </a>
        <span class="msg-feedback" hidden></span>
        <div class="loading-wrp" hidden></div>`;

      userBox.appendChild(signinFace);
      tipBox.appendChild(signinFace.cloneNode(true));
    }

    //signup
    if (getConfig('user.signupUrl')) {
      let signup = addClass(document.createElement('a'), 'usr-signup');
      signup.setAttribute('href', appendNext(getConfig('user.signupUrl')));
      signup.innerHTML = getConfig('msg.userSignup');
      smartClick(signup, function(e) {
        return redirectEvent(signup, e, 'header.user');
      });
      userBox.appendChild(signup);
      tipBox.appendChild(signup.cloneNode(true));
    }

    appendDefaultItems(false);
    userAccount.appendChild(userBox);
    addClass(mod.element, 'loggedout');
  }

  //add hover/touch events
  function addEvent(link) {
    smartClick(link, function(e) {
      return redirectEvent(link, e, 'header.user');
    });
  }

  if (!hasClass(mod.element, getConfig('classUpdated'))) {
    if (customerId && customerNick) renderIn();
    else renderOut();
  }
};

const complete = function(mod) {
  addListener(
    userLink,
    'focus',
    function(e) {
      feather.modules.search.isOpen() && feather.modules.search.close();
    },
    true
  );

  smartClick(
    userLink,
    function(e) {
      // Altera o comportamento do overlay do Shoptime
      const [{ title: brandVerify }] = document.getElementsByClassName(
        'brd-link'
      );
      if (brandVerify === 'Shoptime') {
        try {
          const overlay = document.getElementById('header-overlay');
          overlay.setAttribute('style', 'display: block');
        } catch (e) {}
      }
      // Fim do bloco do overlay do Shoptime
      mod.toggle();
      e.preventDefault();
      requestLogin();
      return false;
    },
    true
  );

  smartClick(
    userGreeting,
    function(e) {
      mod.toggle();
      e.preventDefault();
      requestLogin();
      return false;
    },
    true
  );

  smartHover(
    mod.element,
    function(e) {
      // Altera o comportamento do overlay do Shoptime
      const [{ title: brandVerify }] = document.getElementsByClassName(
        'brd-link'
      );
      if (brandVerify === 'Shoptime') {
        try {
          const overlay = document.getElementById('header-overlay');
          overlay.setAttribute('style', 'display: block');
        } catch (e) {}
      }
      // Fim do bloco do overlay do Shoptime
      requestLogin();
      mod.open(getConfig('classHover'), true);
    },

    function(e) {
      requestLogin();
      mod.close(getConfig('classHover'));
    }
  );
};

class user extends Module {
  constructor() {
    super('user', {
      prerender,
      render,
      complete
    });
  }
}

let mod = new user();
mod.init();

mod.update = function() {
  mod = new user();
  mod.init();
  isPrime()
    .then(() => Skin.use('prime'))
    .catch(console.error);
  removeClass(document.querySelector('#h_user'), 'loggedout');
};

let btnFacebook = document.querySelector(
  `.${getConfig('headerPrefix')}btn-facebook-wrp`
);

function facebookLogin(obj) {
  const resolveSuccess = successMsg => {
    mod.update();
  };
  const resolveError = errorMsg => {
    let message =
      errorMsg.response &&
      errorMsg.response.data.validationErrors[0].message ==
        getConfig('msg.userSigninFaceErrorEmail')
        ? getConfig('msg.userSigninFaceErrorEmail')
        : getConfig('msg.userSigninFaceErrorDefault');
    document.querySelector('.msg-feedback').innerHTML = message;
    removeClass(btnFacebook, 'loading-btn') && addClass(btnFacebook, 'error');
  };

  obj.facebook
    .tryLogin()
    .then(resolveSuccess)
    .catch(resolveError);

  addClass(btnFacebook, 'loading-btn');
}

function facebookError() {
  addClass(btnFacebook, 'error');
}

function requestLogin() {
  if (
    subDomains.findIndex(i => i == subDomain()) != -1 &&
    (location.protocol == 'https:' ||
      getConfig('loginFacebookHttp') === true) &&
    !loginRequest
  ) {
    let signinFace = document.querySelector(
      '.' + getConfig('headerPrefix') + 'btn-facebook-wrp'
    );
    request({
      method: 'GET',
      url: getConfig('user.signinFaceUrl'),
      dataType: 'script'
    })
      .then(() => {
        loginRequest = true;
        const login = window.login;
        login.facebook.startSdk();
        smartClick(signinFace, function(e) {
          e.preventDefault();
          facebookLogin(login);
        });
      })
      .catch(error => {
        return facebookError();
      });
  }
}

export default mod;
