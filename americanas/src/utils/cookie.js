
/*!
* Created by: Zeonardo Lima
*/

export function getDomain(_window = window) {

	let host = _window.location.hostname;

	if (!host || host === 'localhost') {
		return '';
	}

	const parts = host.split('.');
	let upperleveldomain = parts.splice(Math.max(parts.length - 3, 0)).join('.'); //domain.com.br = 3

	return `; domain=.` + upperleveldomain;
}

export function getExpires(expiration, date = new Date()) {

	expiration = Number(expiration);

	if (!expiration || isNaN(expiration) || expiration === 0) {
		return '';
	}

	expiration *= 60 * 1000;

	date.setTime(date.getTime() + expiration);

	return '; expires=' + date.toUTCString();
}

export function	get(name, documentCookie = document.cookie) {
	if (!name) {
		return '';
	}
	return decodeURIComponent(documentCookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(name).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || '';
}

export function set(name, value, expiration) {
	if (!name) {
		return false;
	}

	let str = encodeURIComponent(name) + '=' + encodeURIComponent(value) + '; path=/; ' + getDomain() + getExpires(expiration);

	document.cookie = str;
}

export default {get, set, getDomain, getExpires};
