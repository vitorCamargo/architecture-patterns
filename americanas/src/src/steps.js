/*
 * Steps
 */
import Handlebars from 'handlebars/runtime';
import getConfig from './../utils/getConfig';
import {addClass, smartClick, redirectEvent} from './../utils/utils';
import Module from './../utils/module';
import {Log} from './../services/log';
import stepsTpl from './../embed/_steps';
import * as hbsHelpers from './../utils/hbsHelpers';
import mergeAll from './../utils/toolbelt/mergeAll';


/**
 * Module Global
 */
let stepsTemplate;

let _steps = [];
let currentStep = 0;

const getElement = (_getConfig = getConfig, _document = document) => _document.getElementById(_getConfig('headerPrefix') + 'steps');

const prerender = function(mod){

	addClass(document.getElementById(getConfig('headerId')), getConfig('classHeaderSteps'));
	_steps = getConfig('steps.items');
	currentStep = getConfig('steps.current');

	Handlebars.registerHelper(hbsHelpers);
	stepsTemplate = Handlebars.template(stepsTpl());

	mod.set = function(stepsArray) {
		if(stepsArray.constructor === Array && stepsArray.length > 0) {
			_steps = stepsArray;
			render(this);
			return true;
		}
		return false;
	}

	// mod.setCurrent = function(value) {
	// 	let found = findStepIndex(value);
	// 	if(found > -1 && found < _steps.length) {
	// 		currentStep = found;
	// 		render(this);
	// 		return true;
	// 	}
	// 	return false;
	// }

	// mod.getCurrent = function() {
	// 	return currentStep;
	// }

	mod.get = function(index) {
		return index ? _steps[index] : _steps;
	}

	mod.remove = function(index) {
		let len = _steps.length;
		_steps.splice(findStepIndex(index), 1);
		if(len !== _steps.length){
			render(this);
			return true;
		}

		return false;
	}

	mod.add = function(name, url = '#') {
		if(!name) {
			Log('step name is missing');
			return false;
		}
		_steps.push({name, url});
		render(this);
		return true;
	}
}

function findStepIndex(value) {
	return (value.constructor === Number) ? value : _steps.reduce((acc, item, index) => {
		if(item.name.toLowerCase() === value.toLowerCase()) {
			acc = index;
		}
		return acc;
	}, -1);
}

const render = function(mod) {

	let newElement = document.createElement('div');
	mod.element.outerHTML = stepsTemplate({
		headerPrefix: getConfig('headerPrefix'),
		steps: mergeAll(getConfig('steps'), {
			items: _steps
		})
	});
	mod.getElement();
}

const complete = function(mod){
	function addEvent(item){
		smartClick(item, function(e) {
			return redirectEvent(item, e, 'header.steps');
		});
	}
	let links = mod.element.querySelectorAll('.stp-label');
	links.forEach((itm) => {
		addEvent(itm);
	});
}

class steps extends Module{
	constructor(){
		super('steps', {
			prerender,
			render,
			complete
		})
	}
}
const mod = new steps();
mod.init();
export default mod
