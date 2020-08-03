/*
 * External Link
 */

import getConfig from './../utils/getConfig';
import * as cookie from './../utils/cookie';
import Module from './../utils/module';
import {addClass, removeClass, smartClick, smartHover, redirectEvent, kebabCase, getUrlParameter} from './../utils/utils';


/**
 * Module Global
 */

const render = function(mod) {
	if(!getConfig('externallink.links')){
		return;
	}

  function addActiveAttribute(links = []) {
    const { pathname } = window.location;
    const linksWithActivefield = links.map(item => {
      item.active = pathname === item.pathname;
      return item;
    });
    const hasLinkActive = linksWithActivefield.filter(link => link.active === true).length === 1;

    if( ! hasLinkActive )
      return linksWithActivefield.map(link => {
        if( link.pathname === '/')
          link.active = true;
        return link;
      });

    return linksWithActivefield;
  }

  function renderList(links){
		var len = links.length;
		var list = [];
		function showCondition(condition){
			if(!condition){
				return true;
			}
			else if(getUrlParameter('hdr_ext') == condition){
				cookie.set('hdr_ext', condition);
				return true
			}
			else if(cookie.get('hdr_ext') == condition){
				return true
			}

			return false;
		}

		var showLen = 0;
		for (var i = 0; i < len; i++) {
			var itm = links[i];
			if(!showCondition(itm.condition)){
				continue;
			}

			list.push(`<li class="sz-${i+1} sz ext-item${itm.active ? ` ${getConfig('classActive')}` : ''}"><a class="ext-link" tabindex="7" title="${itm.title}" href="${itm.url || '#'}" ${itm.openNewTab ? 'target="_blank"' : ''}>`);

			if(itm.svg){
				list.push(`<svg class="ext-lnk-ico" role="img"${itm.title ? ` aria-labelledby="${kebabCase(itm.svg).toLowerCase()}-title"` : ''}>
					<use xlink:href="#${itm.svg}"></use>
					${itm.title ? `<title id="${kebabCase(itm.svg).toLowerCase()}-title">${itm.title}</title>` : ''}
					</svg>`);
			}

			if(itm.text){
				list.push(`<span class="ext-lnk-txt">${itm.text}</span>`);
			}

			list.push(`</a></li>`);

			showLen++;
		}
		if(showLen){
			list.unshift(`<ul class="ext-list sizer szr-${showLen}">`);
			list.push('</ul>');
			mod.element.innerHTML = list.join('\r\n');
		}
	}

  renderList(
    addActiveAttribute(
      getConfig('externallink.links')
    )
  );
}

const complete = function(mod){
	var links = mod.element.querySelectorAll('.ext-link');
	function addEvent(item){
		smartClick(item, function(e) {
			return redirectEvent(item, e, 'header.externallink');
		});
		smartHover(item, function(e) {
			addClass(item.parentNode, getConfig('classHover'));
		},
		function(e) {
			removeClass(item.parentNode, getConfig('classHover'));
		});
	}
	for (var i = 0; i < links.length; i++) {
		var itm = links[i];
		addEvent(itm);
	}
}

class externallink extends Module{
	constructor(){
		super('externallink', {
			render,
			complete
		})
	}
}
let mod = new externallink();
mod.init();

export default mod
