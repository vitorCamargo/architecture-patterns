import toBoolean from './toolbelt/toBoolean';
import prop from './toolbelt/prop';
import {kebabCase} from './utils';

export function counter(num) {
	return parseInt(num, 10) + 1;
}

export function toclass(text) {
	return kebabCase(text);
}

export function bestbanner(b = {}) {
	if(b.type !== 'zion-image'){
		return '';
	}

	let sizes = ['medium', 'big', 'small', 'large', 'extralarge'];//from theme
	sizes.unshift(b.defaultSize);
	for (var i = 0; i < sizes.length; i++) {
		if(!!b[sizes[i]]){
			return b[sizes[i]];
		}
	}
	return '';
}

export function get(obj, _prop) {
	obj = obj || {},
	_prop = _prop || '';
	return obj[_prop] || '';
}

export const kebabcase = kebabCase;
export const toboolean = toBoolean;

export function eq (v1, v2, deep = false) {
		//console.log('eq', v1, v2, (deep && (v1 === v2)) || v1 == v2);
	return (deep && (v1 === v2)) || v1 == v2;
}

export function ne (v1, v2) {
		//console.log('ne', v1||'empty', v2||'empty', v1 !== v2);
	return v1 !== v2;
}

export function lt (v1, v2) {
	return v1 < v2;
}

export function gt (v1, v2) {
	return v1 > v2;
}

export function lte (v1, v2) {
	return v1 <= v2;
}

export function gte (v1, v2) {
	return v1 >= v2;
}

export function and(v1, v2) {
	return (toBoolean(v1) && toBoolean(v2));
}

export function or(v1, v2) {
	return (toBoolean(v1) || toBoolean(v2));
}

export function getHiddenClass(module) {

	const buildClassStr = (m) =>
		(prop(['hidden'], m) || [])
		.map(mq => `hidden-${mq}`)
		.join(' ');

	return buildClassStr(module);
}
