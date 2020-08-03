import * as cookie from './../utils/cookie';
import getConfig from './../utils/getConfig';
import request from './../utils/request';
import Promise from './../utils/promise';
/* import prop from './../utils/toolbelt/prop'; // ver se esta sendo usado */
import Cache from './../utils/cache';
import { Log } from './log';

const PRIME_COOKIE_KEY = getConfig('user.primeCookieKey');
const CUSTOMER_ID_COOKIE_KEY = getConfig('user.customerIdCookieKey');
const NICK_COOKIE_KEY = getConfig('brand') + 'Nick' || getConfig('customerNick', '');
const PRIME = getConfig('prime');

/**customerNick
 * Get customer id from cookie
*/
export function getCustomerID(customerIdKey = CUSTOMER_ID_COOKIE_KEY, _cookie = cookie) {
  if (!customerIdKey) {
    return false;
  }
  return _cookie.get(customerIdKey) || false;
}

/**
 * Check on browser's cookies if customer is prime
*/
export function isPrimeFromCookie(cookieKey = PRIME_COOKIE_KEY, _cookie = cookie, cookieNick = NICK_COOKIE_KEY) {
  return (_cookie.get(cookieKey) || 'false') !== 'false' && (_cookie.get(cookieNick) || 'false') !== 'false';
}

export function hasPrimeCookie(_cookie = cookie, cookieKey = PRIME_COOKIE_KEY) {
  return _cookie.get(cookieKey);
}

/**
 * Check on api service if customer is prime
*/

export function isPrimeFromAPI(_getCustomerID = getCustomerID, _request = request, _getConfig = getConfig, _cache = Cache, _cookie = cookie, cookieNick = NICK_COOKIE_KEY, customerIdKey = CUSTOMER_ID_COOKIE_KEY) {
  return new Promise((resolve, reject) => {
    let customerId = _getCustomerID(),
      primeApiUrl = _getConfig('api.prime'),
      error;

    if (!customerId) {
      error = 'Customer ID not found';
    }
    else if (!primeApiUrl) {
      error = 'Prime Api not found';
    }

    if (error) {
      reject(error);
      return false;
    }
    _cache.getAsync('prime-data', (cached) => {
      if (cached !== '' && _cookie.get(cookieNick) && cached.customerId && _cookie.get(customerIdKey) === cached.customerId) {
        Log('prime from cache', cached);
        resolve(cached);
      } else {
        _cache.lock(1000);
        _request(primeApiUrl + customerId)
        .then(function(data) {
          const expired =  () => {
            if (data.json._warnings){
              if (data.json._warnings.findIndex(i => i.code === 'SUBSCRIPTION_EXPIRED') !== -1){
                return true;
              } else {
                return false;
              }
            } else {
              return false;
            }
          };
          if (data.status === 200 && _cookie.get(cookieNick) && !expired()) {
            Log('prime from api', data.json);
            _cache.add('prime-data', data.json, 0.1666);//roughly 10 min
            _cache.unlock();
            resolve(data.json);
          } else {
            reject(data);
          }
        }).catch(function(err) {
          Log(err);
          _cache.unlock();
          reject(err);
        });
      }
    });
  });
}


export function isPrime() {

  if (PRIME === false) {
    return new Promise((resolve, reject) => reject(false));
  }
  const hasPrime = hasPrimeCookie() === 'true';

  if (hasPrime && Cache.get('prime-data') !== '') {
    return new Promise((resolve, reject) => Cache.getAsync('prime-data', cached => {
      if(cookie.get(CUSTOMER_ID_COOKIE_KEY) !== cached.customerId)
        return reject(false);
      resolve(cached);
    }));
  }
  if (hasPrime) {
    return new Promise((resolve) => resolve(true));
  }

  return new Promise((resolve, reject) => reject(false));
}
