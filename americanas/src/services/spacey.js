
import { Log } from './log';
import Cache from './../utils/cache';
import Request from './../utils/request';
import Promise from './../utils/promise';
import getConfig from './../utils/getConfig';
import nullify from './../utils/toolbelt/nullify';
import { get as cookieGet } from './../utils/cookie';
import { getUrlParameter, deviceType } from './../utils/utils';

const isNotEmpty = (value) => !!nullify(value);

function fetch(_cache = Cache, _request = Request, _getConfig = getConfig, _window = window) {

  const segment = getSegment(_window.unescape);
  const sitePage = getUrlParameter('sitepage', _window.location) || '';
  return new Promise((resolve, reject) => {
    if (window.preFetchedSpacey) {
      return resolve(window.preFetchedSpacey);
    }

    _cache.getAsync('spacey-data', (cached) => {

      if (!sitePage && cached) {
        //Log('Spacey from cache', cached);
        resolve(cached);
      } else {
        _cache.lock(1000);
        _request(completeUrl((!sitePage ? _getConfig('api.spacey') : _getConfig('api.spaceyDev')) + deviceType() + '/feather/v2', sitePage, segment))
          .then(function (data) {
            Log('Spacey from api', data.json);
            !sitePage && _cache.add('spacey-data', data.json, 0.1666);//roughly 10 minutes
            _cache.unlock();
            resolve(data.json);
          })
          .catch(function (err) {
            _cache.unlock();
            Log(err);
            reject(err);
          });
      }
    });
  });
}

function completeUrl(url, sitepage, segment) {
  let urlAndParam = (url || '').split('?');
  let urlSegments = (urlAndParam.shift() || '').split('//');
  let urlScheme = urlSegments.length > 1 ? (urlSegments.shift() || '').concat('//') : '';
  urlAndParam = (urlAndParam.pop() || '').split('&').filter(isNotEmpty);
  urlSegments = (urlSegments.pop() || '').split('/').filter(isNotEmpty);
  sitepage && urlSegments.push(sitepage);
  segment && urlAndParam.push('segment='.concat(segment));

  let finalUrl = urlScheme.concat(urlSegments.join('/'));
  finalUrl += urlAndParam.length ? '?'.concat(urlAndParam.join('&')) : '';
  return finalUrl;
}

function getSegment(unescapeFunc = (u) => u || '') {
  let seg = unescapeFunc(cookieGet('b2wcrmts'));
  return seg ? encodeURIComponent(seg) : null;
}

function getPublicationByName(publicationName, data = {}) {
  return Object.keys(data).reduce((value, acc) => {
    if (value.name === publicationName) {
      acc = value;
    }
    return acc;
  }, {});
}

function getPublicationByPosition(position, data = {}) {
  return data[position];
}

function getItemMenu(itemsPath = [], component) {
  if (!itemsPath.length || !component) {
    return undefined;
  }

  let head = itemsPath[0];
  let tail = itemsPath.slice(1, itemsPath.length);
  let currentComponent;

  if (component.constructor === Array) {
    currentComponent = component.reduce((value, acc) => {
      if (acc.title === head) {
        return acc;
      }
      else {
        return value;
      }
    }, {});
  } else if (component.title === head) {
    currentComponent = component;
  }

  if (tail.length > 0 && currentComponent && currentComponent.children.length > 0) {
    return getItemMenu(tail, currentComponent.children);
  } else {
    return currentComponent;
  }
}

export { getPublicationByName, getPublicationByPosition, getItemMenu, fetch };
