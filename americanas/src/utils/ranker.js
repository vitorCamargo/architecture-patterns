/*!
* Created by: Zeonardo Lima
*/

import getConfig from './getConfig';
import cookie from './cookie';

//TODO: save on storage
const cookieKey = getConfig('cookieId') + '.rank';
const delimiter_column = 'ↇ';
const delimiter_line = 'ↈ';
const default_entry = 'rank';
const structure = {
	value: 0,
	rank: 1
};
let _ck;
const getCookie = function(){//save values on cookies and json data on cache
	if(!_ck){
		_ck = cookie.get(cookieKey) || '{}';
		_ck = JSON.parse(_ck);
	}

	return _ck;
};

//
const setCookie = function(value){
	cookie.set(cookieKey, JSON.stringify(value), 180*24*60);//roughly 6 months expiration
	cookie.set(getConfig('cookieId') + '.ranker', '', -1);//TODO: remove this maintenance line at a later version (current live: 1.8.2)
};

const arrayToCsv = function(array){
	for (let i = 0, len = array.length; i < len; i++) {
		array[i] = array[i].join(delimiter_column);
	}
	return array.join(delimiter_line);
};

const csvToArray = function(csv){
	csv = csv.split(delimiter_line);
	let array = [];
	for (let i = 0, len = csv.length; i < len; i++) {
		csv[i] && array.push(csv[i].split(delimiter_column));
	}

	return array;
};

const arrayToJson = function(array){
	for (let i = 0, len = array.length; i < len; i++) {
		let j = {};
		for(let key in structure){
			if(structure.hasOwnProperty(key)){
				j[key] = array[i][structure[key]];
			}
		}
		array[i] = j;
	}
	return array;
};

//
const findCondition = function(item, value){
	return item[structure.value] == value;
};

//
const getFromCookie = function(ck, name, max = 5){
	ck = ck || getCookie();
	return csvToArray((ck && ck[name] && ck[name]) || '').slice(0, max);
};

export function get(name, max = 5){
	let c = getFromCookie(null, name || default_entry, max);
	return arrayToJson(c);
}

//
export function add(name, value = '', mod = 1, max = 5){
	if(!value){
		return;
	}

	name = name || default_entry;
	value = value.toLowerCase().replace(delimiter_column, ' ').replace(delimiter_line, ' ').replace(/\s\s+/g, ' ');
	let c = getCookie();
	let r = getFromCookie(c, name);
	let v = [];
	v[structure.value] = value;
	for (let i = 0, len = r.length; i < len; i++) {
		if(findCondition(r[i], value)){
			v = r.splice(i, 1)[0];
			v[structure.rank] = parseInt(v[structure.rank], 10);
			break;
		}
	}

	//r.sort(function(a, b){return (b[structure.rank]-a[structure.rank] > 0)});//sort by rank or most recent
	r = r.slice(0, max*2-1);//limit items up to double the max, including the new item to be added below

	v[structure.rank] = (v[structure.rank] || 0) + mod;
	r.unshift(v);//last item comes first, followed by items sorted by rank
	c[name] = arrayToCsv(r);
	setCookie(c);
}

export default {get,add};
