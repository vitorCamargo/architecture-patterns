
import { Log } from './log';
import Cache from './../utils/cache';
import Request from './../utils/request';
import Promise from './../utils/promise';
import getConfig from './../utils/getConfig';
import {get as cookieGet} from './../utils/cookie';

function fetch(_cache = Cache, _request = Request, _getConfig = getConfig, _window = window) {
  const customerId = cookieGet('customer.id');
  const token = cookieGet('customer.api.token');

  return new Promise((resolve, reject) => {
    _request(`${_getConfig('api.wishlist')}${customerId}?customerToken=${token}&type=quantity`)
    .then(function(data) {
      Log('Wishlist quantity from api', data.json);
      resolve(data.json);
    })
    .catch(function(err) {
      Log(err);
      reject(err);
    });
  });
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
  if(!itemsPath.length || !component){
    return undefined;
  }

  let head = itemsPath[0];
  let tail = itemsPath.slice(1, itemsPath.length);
  let currentComponent;

  if(component.constructor === Array) {
    currentComponent = component.reduce((value, acc) => {
      if(acc.title === head) {
        return acc;
      }
      else{
        return value;
      }
    }, {});
  } else if(component.title === head) {
    currentComponent = component;
  }

  if (tail.length > 0 && currentComponent && currentComponent.children.length > 0) {
    return getItemMenu(tail, currentComponent.children);
  } else {
    return currentComponent;
  }
}

export { getPublicationByName, getPublicationByPosition, getItemMenu, fetch };
