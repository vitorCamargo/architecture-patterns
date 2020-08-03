import Promise from './promise';
import getConfig from './getConfig';
import {guid} from './utils';
import mergeAll from './../utils/toolbelt/mergeAll';
import assign from './../utils/toolbelt/assign';

/*!
* Created by: Zeonardo Lima
*/
function safelyJsonParse(value = '{}') {
	try {
		return JSON.parse(value);
	} catch(e) {
		return {};
	}
}

function makeResponseObject(_xhr = {}, err, isXDomainRequestType = false) {

	const defaultResponse =  {
		status: undefined,
		statusText: undefined,
		body: '',
		json: undefined,
		headers: {},
		xhrType: isXDomainRequestType ? 'xdr' : 'xhr'
	};

	const getHeaders = (_xhr = {}) => {

		if(!_xhr.getAllResponseHeaders) {
			_xhr.getAllResponseHeaders = () => '';
		}

		return _xhr.getAllResponseHeaders()
							.split('\r\n')
							.filter((value) => value.length > 0)
							.reduce((acc, value) => {
								let kv = value.split(':');
								acc[kv[0]] = String(kv[1]).trim();
								return acc;
							}, {});
	};

	if (err) {
		return assign(defaultResponse, { statusText: err });
	}

	let successResponse = {
		body: _xhr.responseText,
		json: safelyJsonParse(_xhr.responseText),
		headers: getHeaders(_xhr)
	};

	if(isXDomainRequestType){
		return assign(defaultResponse, successResponse, {
			status: 200,
			statusText: '200 FAKE, isXDomainRequest doesn\'t support statusText'
		});
	} else {
		return assign(defaultResponse, successResponse, {
			status: _xhr.status,
			statusText: _xhr.statusText
		});
	}
}

function getQueryString(params) {
	if (params && typeof params === 'object') {
		return '?' + Object.keys(params).map(function (key) {
			return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
		}).join('&');
	}
}

function doJsonpRequest(resolve, reject, settings) {

	const getScript = (settings, name) => {
		let script        = document.createElement('script');
		let callbackParam = Object({[getConfig('jsonpCallbackKey')]: name});
		let qs            = settings.jsonp ? getQueryString(mergeAll(settings.params || {}, callbackParam)) : '';
		script.type = 'text/javascript';
		script.src = `${settings.url}${qs}`;

		script.onload = () => resolve(settings.url);

		script.onerror = (err) => reject(makeResponseObject(null, err));

		return script;
	};

	const setupGlobalHandler = (script, name) => {
		window[name] = (data) => {
			resolve(data);
			document.getElementsByTagName('head')[0].removeChild(script);
			script = null;
			delete window[name];
		};
	};


	let fnName = `fn${guid()}`;
	let script = getScript(settings, fnName);
	setupGlobalHandler(script, fnName);
	document.getElementsByTagName('head')[0].appendChild(script);
}

export default settings => {
	//const regUrl = /^(?:(ht|f)tp(s?)\:)?\/\/[0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*(:(0-9)*)*(\/?)([a-zA-Z0-9\-\.\?\,\'\/\\\+&amp;%\$#_]*)?$/;
	return new Promise((resolve, reject) => {
		let error;
		if(!window){
			error = 'referenceError: window is not supported';
		}
		else if (!XMLHttpRequest){
			error = 'referenceError: XMLHttpRequest is not supported';
		}
		else if (!settings){
			error = 'referenceError: parameter settings is not defined';
		}
		else if (typeof settings !== 'object' && typeof settings !== 'string'){
			error = 'referenceError: parameter settings must be either an object or string';
		}
		else if (typeof settings === 'object'){
			if(!settings.url){
				error = 'referenceError: object settings must have a url';
			}
			//regex com baixa performance, por isso foi comentado
			// else if(!regUrl.test(settings.url)){
			//   error = 'referenceError: settings url must be a valid uri';
			// }
		}
		// else if (typeof settings === 'string' && !(regUrl.test(settings))){
		//   error = 'referenceError: string settings must be a valid uri';
		// }

		if(error){
			reject(makeResponseObject(null, error));
			return false;
		}

		typeof settings === 'string' && (settings = { url: settings });

		const getUrl = (settings) => {

			let url = settings.url.replace(/^\/\//, `${location.protocol || ''}//` );

			if (settings.query) {
				return url + settings.query;
			} else {
				return url + (settings.params ? getQueryString(settings.params) : '');
			}
		};

		if ((settings.jsonp || settings.dataType == 'script') && window && document) {

			doJsonpRequest(resolve, reject, settings);

		} else {

			let xhr = new XMLHttpRequest();
			let isXDomainRequestType = false;

			if (window.XDomainRequest) {
				xhr = new XDomainRequest();
				isXDomainRequestType = true;
			}
			
			xhr.open((settings.method || 'GET'), getUrl(settings), true);
		
			//success
			xhr.onload = function() {
				if(isXDomainRequestType){
					resolve(makeResponseObject(xhr,  null, isXDomainRequestType));
				} else {
					if (this.status >= 200 && this.status < 300) {
						resolve(makeResponseObject(xhr,  null, isXDomainRequestType));
					} else {
						reject(makeResponseObject(xhr, null, isXDomainRequestType));
					}
				}
				
			};

			//error
			xhr.onerror = function() {
				reject(makeResponseObject(xhr, 'Request error', isXDomainRequestType));
			};

			//headers
			if (settings.headers) {
				Object.keys(settings.headers).forEach(function (key) {
					xhr.setRequestHeader(key, settings.headers[key]);
				});
			}

			xhr.send(null);
			
		}
	});
};

/*
## SAMPLE USAGE ##
request({
	method: 'POST',
	url: 'http://sample.com',
	jsonp: true
	params: {
		sample: 'sampled'
	},
	headers: {
		'X-Sample': 'Sampled'
	}
})
.then(function (data) {
	console.log('Success!', data);
})
.catch(function (err) {
	console.error('Augh, there was an error: ', err.statusText);
});
*/