/*
 * Brand
 */

import getConfig from './../utils/getConfig';
import Module from './../utils/module';
import {addClass, smartClick, redirectEvent} from './../utils/utils';

let brandLink, sloganLink;

//
const prerender = function(mod){
  brandLink = mod.element.querySelector('.brd-link');
};

const getDynamicColor = () => {
  let css = `#dynamic-color-shop { fill: ${getConfig('logoDynamicColor')}; }`;
  let header = document.getElementById('bhd');
  let style = document.createElement('style');
  
  style.type = 'text/css';
  if (style.styleSheet){
	  style.styleSheet.cssText = css;
  } else {
	  style.appendChild(document.createTextNode(css));
  }
  
  header.appendChild(style);
};

//
const render = function(mod){
  if(!getConfig('msg.logoSloganText') && !getConfig('msg.logoSloganLink')){
    return;
  }

  let slogan = addClass(document.createElement('div'), 'brd-slogan');
  sloganLink = addClass(document.createElement('a'), 'brd-slg-link');
  sloganLink.innerHTML = getConfig('msg.logoSloganText') || '';
  sloganLink.tabIndex = 6;
  sloganLink.href = getConfig('msg.logoSloganLink') || '#';

  let title, text;
  if(getConfig('msg.logoSloganTooltipTitle')){
    title = document.createElement('strong');
    title.innerHTML = getConfig('msg.logoSloganTooltipTitle');
  }

  if(getConfig('msg.logoSloganTooltipText')){
    text = document.createElement('span');
    text.innerHTML = getConfig('msg.logoSloganTooltipText');
  }

  if(title || text){
    let box = addClass(document.createElement('span'), 'brd-box '+getConfig('headerPrefix')+'tooltip arrow-left-center shadow-ttip');
    box.href = sloganLink.href;
    title && box.appendChild(title);
    text && box.appendChild(text);
    sloganLink.appendChild(box);
  }

  slogan.appendChild(sloganLink);

  if (getConfig('logo.slogan')) {
    mod.element.appendChild(slogan);
  }
  getConfig('brand') == 'shop' && getDynamicColor();
};

//
const complete = function(mod){
  smartClick(brandLink, function(e) {
    return redirectEvent(brandLink, e, 'header.brand.logo');
  });
  sloganLink && smartClick(sloganLink, function(e) {
    return redirectEvent(sloganLink, e, 'header.brand.slogan');
  });
};

class brand extends Module{

  constructor(){
    super('brand', {
      prerender,
      render,
      complete
    });
  }
}
const mod = new brand();
mod.init();
export default mod;
