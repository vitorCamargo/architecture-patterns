/*!
 * inspired by basket.js
 * http://addyosmani.github.com/basket.js
 * credit to Addy Osmani
 * Created by: Zeonardo Lima
 */

import getConfig from './getConfig';
import {localStorage, sessionStorage} from './../services/storage';

let lockTimer = {
	started: 0,
	ms: 0,
	locked: false
};

const stringer = (input = '') => typeof input === 'object' ? JSON.stringify(input) : input + '';

const hash = (input = 'key') => {//djb2
	input = getConfig('brand') + stringer(input);
	let hash = 5381,
		char;
	for (let i = 0; i < input.length; i++) {
		char = input.charCodeAt(i);
		hash = ((hash << 5) + hash) + char; /* hash * 33 + c */
	}
	return hash;
};

const wrap = (data, expire) => {
	let obj = {};
	let now = +new Date();
	obj.type = typeof data;
	obj.stamp = now;
	obj.expire = expire ? (now + (expire * 60 * 60 * 1000)) : 0;//hours
	obj.data = typeof data === 'object' ? JSON.stringify(data) : (data || '');
	obj.data = data || '';
  obj.version = getConfig('version');
	return JSON.stringify(obj);
};

const expire = () => {
	const now = +new Date();

  Object.keys(localStorage).forEach(function(itemKey){
    const key = itemKey.split(getConfig('headerPrefix'))[1];
    if (!key) {
      return false;
    }
    const item = getFromHash(key, false) || {};
		if (item.expire <= now || item.version !== getConfig('version')) {
			localStorage.removeItem(itemKey);
    }
  });
};

const add = (key, data, expiration) => {
	expire();
	let storage = (expiration ? localStorage : sessionStorage);
	let hashKey = getConfig('headerPrefix') + hash(key);
	try {
		data && storage.setItem(hashKey, wrap(data, expiration));
		return true;
	} catch (e) {
		if (e.name.toUpperCase().indexOf('QUOTA') >= 0) {
			var item;
			var tempObjs = [];

			for (item in storage) { //retrieve all proprietary data
				if (item.indexOf(getConfig('headerPrefix')) === 0) {
					tempObjs.push(JSON.parse(storage[item]));
				}
			}

			if (tempObjs.length) {
				tempObjs.sort(function(a, b) {
					return a.stamp - b.stamp;
				});

				remove(tempObjs[0].key); //remove older

				return add(key, data, expiration); //and try to add again

			} else {
				// no proprietary data to remove and still larger than available quota
				return false;
			}
		} else {
			// some other error
			return false;
		}
	}
};

const remove = key => {
	let hashKey = getConfig('headerPrefix') + hash(key);
	delete window[hashKey];
	localStorage.removeItem(hashKey);
	sessionStorage.removeItem(hashKey);
};

const get = key => {
	expire();
	return getFromKey(key);
};

const getAsync = (key, callback) => {
	lockTimer.locked = lockTimer.locked && lockTimer.ms - (Date.now() - lockTimer.started) > 0;
	if(!lockTimer.locked){
		if(typeof callback == 'function'){
			return callback(get(key));
		}
		return get(key);
	}
	else{
		setTimeout(function(){
			getAsync(key, callback);
		}, 10);
	}
};

const lock = (ms = 100) => {
	if(lockTimer.locked){
		lockTimer.ms = (lockTimer.ms - (Date.now() - lockTimer.started)) + ms;
	}
	else{
		lockTimer.ms = ms;
		lockTimer.started = Date.now();
		lockTimer.locked = true;
	}
};

const unlock = () =>{
	lockTimer.locked = false;
};

const getFromKey = key => {
	let hashKey = hash(key);
	return getFromHash(hashKey);
};

const getFromHash = (hashKey, dataOnly = true) => {
	hashKey = getConfig('headerPrefix') + hashKey;
	let item = window[hashKey] || sessionStorage.getItem(hashKey) || localStorage.getItem(hashKey);
	try {
		if(item){
			item = JSON.parse(item);
			if(item.type === 'object' && typeof item.data !== 'object'){
				item.data = JSON.parse(item.data);
			}
			return dataOnly ? item.data : item;
		}
		return '';
	} catch (e) {
		return '';
	}
};

const addGlobal = (key, value) =>{
	let hashKey = getConfig('headerPrefix') + hash(key);
	window[hashKey] = wrap(value);
};

const set = add; //for the sake of intelligibility
const setGlobal = addGlobal; //for the sake of intelligibility

export default {
	get,
	getAsync,
	set,
	add,
	setGlobal,
	addGlobal,
	remove,
	lock,
	unlock
};
