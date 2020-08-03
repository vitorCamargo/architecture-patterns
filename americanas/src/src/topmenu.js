/*
 * Top Menu
 */
import Handlebars from 'handlebars/runtime';
import getConfig from './../utils/getConfig';
import {hasClass, addClass, smartClick, redirectEvent} from './../utils/utils';
import list from './../embed/_list';
import listItem from './../embed/_list-item';
import Module from './../utils/module';
import * as Spacey from './../services/spacey';
import {Log} from './../services/log';

const fetch = function(mod){
	return Spacey.fetch();
};

const render = function(mod, data){
	if(!data.top || !data.top.component.children.length){
		return;
	}

	Handlebars.registerPartial('_list', Handlebars.template(list()));
	Handlebars.registerPartial('_list-item', Handlebars.template(listItem()));
	Handlebars.registerHelper('counter', function (num){
		return parseInt(num, 10) + 1;
	});
	Handlebars.registerHelper('toboolean', function (b){
		if(!isNaN(b || 'i')){
			b = parseInt(b || 0, 10);
		}

		return !!b && (b + '').toLowerCase() !== 'false';
	});

	let mainView = Handlebars.template(list());
	data.top.component.msg = getConfig('msg');
	data.top.component.level = 1;
	mod.element.innerHTML = mainView(data.top.component);
};

const complete = function(mod){
	let links = mod.element.querySelectorAll('.lst-lnk');
	function addEvent(item){
		smartClick(item, function(e) {
			return redirectEvent(item, e, 'header.topmenu');
		});
	}
	for (var j = 0, jlen = links.length; j < jlen; j++) {
		let itm = links[j],
			tab = document.createAttribute('tabindex');
			tab.value = 8;
		itm.setAttributeNode(tab);
		itm.getAttribute('href') &&
		itm.getAttribute('href') !== '#' &&
		addEvent(itm);
	}
};

class topmenu extends Module{
	constructor(){
		super('topmenu', {
			fetch,
			render,
			complete
		})
	}
}
let mod = new topmenu();
mod.init();

export default mod
