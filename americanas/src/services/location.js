
import { Log } from './log';
import Cache from './../utils/cache';
import Request from './../utils/request';
import Promise from './../utils/promise';
import getConfig from './../utils/getConfig';

function fetchLocation(persistentCep, _cache = Cache, _request = Request, _getConfig = getConfig) {

  return new Promise((resolve, reject) => {
    _request(`${_getConfig('api.cep')}/${persistentCep}`)
    .then(function(data) {
      Log('cep data from api', data.json);
      resolve(data.json);
    })
    .catch(function(err) {
      Log(err);
      reject(err);
    });
  });
}

function fetchRegion(persistentCep, _cache = Cache, _request = Request, _getConfig = getConfig) {

  return new Promise((resolve, reject) => {
    _request(`${_getConfig('api.region')}?zipcode=${persistentCep}`)
    .then(function(data) {
      Log('region data from api', data.json);
      resolve(data.json);
    })
    .catch(function(err) {
      Log(err);
      reject(err);
    });
  });
}

export { fetchLocation, fetchRegion };
