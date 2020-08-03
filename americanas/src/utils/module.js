/*
 * display
 * it's !important
 */

import getConfig from './../utils/getConfig';
import Dsp from './../utils/display';
import {Log} from './../services/log';
import {addClass} from './../utils/utils';

export default class {
	constructor(name = 'module', functions = {}){

		// const is better since you don't want to reassign this value
		const logger = (message) => {
			return function(){
				Log(message);
				return false;
			}
		};

		const notAvailable = (fname) => {
			return logger(this.name + '.' + fname + ' not available');
		};

		const displayFunctions = (fn, display) => {
			display = display || new Dsp();
			for (var prop in display) {
				if (display.hasOwnProperty(prop) && typeof display[prop] == 'function') {
					this[prop] = fn || display[prop];
				}
			}
		}

		const isFunction = (fn) => typeof fn == 'function';

		const noErrorAndIsFunction = (err, fn) => !err && isFunction(fn);

		let error = false;

		this.initiated = false;
		this.updated = false;
		this.rendered = false;
		this.name = name;
		this.element = undefined;
		this.getElement = (_getConfig = getConfig, _document = document) => {
			const el = _document.getElementById(_getConfig('headerPrefix') + this.name);
			this.element = el;
			return el;
		};
		displayFunctions(logger('! ' + this.name + ' not initiated'));
		this.init = () => {
			if (this.initiated || (getConfig([this.name, 'init']) === false)) {
				return false;
			}

			this.initiated = true;
			displayFunctions(logger('! ' + this.name + ' not rendered'));
			const prerender = () => {
				this.getElement();
				if(!this.element){
					return false;
				}

				const display = new Dsp(this.element);
				displayFunctions(false, display);

				if(noErrorAndIsFunction(error, functions.prerender)){
					try{
						functions.prerender(this);
					}
					catch(err){
						error = true;
						Log(this.name + ' module prerender error\n', err);
					}
				}

				if(noErrorAndIsFunction(error, functions.fetch)){
					try{
						functions.fetch(this).then(data => {
							render(data);
							addClass(this.element, getConfig('classUpdated'));
							this.updated = true;
						}).catch(err => {
							render();
						});
					}
					catch(err){
						error = true;
						render();
						Log(this.name + ' module prerender error\n', err);
					}
				}
				else{
					render();
				}

			};

			const render = (asyncData) => {
				if(noErrorAndIsFunction(error, functions.render)){
					try{
						functions.render(this, asyncData);
					}
					catch(err){
						error = true;
						Log(this.name +' module render error\n', err);
					}
					finally{
						complete();
					}
				}
				else{
					complete();
				}
			};

			const complete = () => {
				const box = this.element.querySelector('.box');
				if(!box){
					this.pin=notAvailable('pin');
					this.unpin=notAvailable('unpin');
					this.open=notAvailable('open');
					this.close=notAvailable('close');
					this.toggle=notAvailable('toggle');
					this.enable=notAvailable('enable');
					this.disable=notAvailable('disable');
					this.isActive=notAvailable('isActive');
					this.isOpen=notAvailable('isOpen');
					this.isEnabled=notAvailable('isEnabled');
				}
				if(noErrorAndIsFunction(error, functions.complete)){
					try{
						functions.complete(this);
					}
					catch(err){
						error = true;/**/
						Log(this.name + ' module complete error\n', err);
					}
				}
				addClass(this.element, getConfig('classReady'));
				this.rendered = true;
			};

			prerender();
		};
	}
}
