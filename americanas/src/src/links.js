/*
 * Links
 */

import Handlebars from 'handlebars/runtime';
import * as hbsHelpers from './../utils/hbsHelpers';
import hbsItem from './../embed/_link';
import getConfig from './../utils/getConfig';
import mergeAll from './../utils/toolbelt/mergeAll';
import {addClass, hasClass, removeClass, smartClick, smartHover, redirectEvent, addEvent} from './../utils/utils';

let itemTemplate;
let elements = document.querySelectorAll('.'+getConfig('headerPrefix')+'links');
let renderedLinks = [];
const isValid = (elements && getConfig('links') && getConfig('links').constructor == Array && getConfig('links').length);

const prerender = function(index) {
	if(!isValid){
		return;
	}

	Handlebars.registerHelper(hbsHelpers);
	itemTemplate = Handlebars.template(hbsItem());
};

const render = function(index) {
	if(!isValid){
		return;
	}

	function renderItem(item, data){
		let itemView = Handlebars.template(hbsItem());
		item.innerHTML = itemView(data);
	}

	for (let i = 0; i < elements.length; i++) {
		let itm = elements[i];
		let configItem = getConfig('links')[i];
		if(itm){
			if(configItem){
				setTimeout(function(){
					addClass(itm, 'lks-' + i);
					configItem.name && itm.setAttribute('name', configItem.name);
					configItem.class && addClass(itm, configItem.class+'');
				}, 0);
				renderItem(itm, configItem);
				renderedLinks.push({element: itm, config: configItem });
			}
			else{
				addClass(itm, 'no-link');
			}
		}
	}
};

const complete = function(index){
	if(!isValid){
		return;
	}

	function addEvent(item){
		smartClick(item, function(e) {
			if(hasClass(item, 'lks-hash')){
				e.preventDefault();
				return false;
			}
			return redirectEvent(item, e, 'header.links');
		});
		smartHover(item, function(e) {
			addClass(item.parentNode, getConfig('classHover'));
		},
		function(e) {
			removeClass(item.parentNode, getConfig('classHover'));
		});
	}
	for (let i = 0; i < renderedLinks.length; i++) {
		addEvent(renderedLinks[i].element.querySelector('.lks-link'));
	}
};

class link{
	constructor(index = 0){
		prerender(index);
		render(index);
		complete(index);
		this.index = index;
		this.element = document.querySelector('.'+getConfig('headerPrefix')+'links.lks-'+index);
		this.name;
		this.url;
		this.text;
		this.title;
		this.svg;
		this.class;
		this.rendered = !!renderedLinks[index];
		if(this.rendered){
			this.name = renderedLinks[index].config.name;
			this.url = renderedLinks[index].config.url;
			this.text = renderedLinks[index].config.text;
			this.title = renderedLinks[index].config.title;
			this.svg = renderedLinks[index].config.svg;
			this.class = renderedLinks[index].config.class;
		}
	}
}

let mods = [];
for (let i = 0; i < elements.length; i++) {
	let mod = new link(i);
	mod.rendered && mods.push(mod);
}

export default mods
