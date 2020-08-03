
import {Log} from './log';

(function(window) {

	const defineObjectProperty = (name, props, obj = window.memoryStorage) => Object.defineProperty(obj, name, props);

	let items = {};

	window.memoryStorage = {};

	defineObjectProperty('memoryStorage', {
		get: () => items
	}, window);

	defineObjectProperty('length', {
		get: () => Object.keys(items).length
	});

	defineObjectProperty('key', {
		value: (index) => items[Object.keys(items)[index]]
	});

	defineObjectProperty('getItem', {
		value: (key) => items[key]
	});

	defineObjectProperty('setItem', {
		value: (key, value) => items[key] = value
	});

	defineObjectProperty('removeItem', {
		value: (key) => items[key] ? delete items[key] : null
	});

	defineObjectProperty('clear', {
		value: () => items = {}
	});

})(window);

function getStorage(storage, fallback = window.memoryStorage) {
	let x = '__storage_test__';
	try {
		storage.setItem(x, x);
		storage.removeItem(x);
		return storage;
	} catch (e) {
		Log('Storage not available', e);
		return fallback;
	}
}

const sessionStorage = getStorage(window.sessionStorage);
const localStorage   = getStorage(window.localStorage);

export {sessionStorage, localStorage};
