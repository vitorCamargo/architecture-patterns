/*
 * Top Menu
 */
import Handlebars from 'handlebars/runtime';
import getConfig from './../utils/getConfig';
import {smartClick, redirectEvent} from './../utils/utils';
import list from './../embed/_list';
import listItem from './../embed/_list-item';
import Module from './../utils/module';
import * as Spacey from './../services/spacey';

const fetch = function(){
  return Spacey.fetch();
};

const render = function(mod, data){
  if(!data.destaque || !data.destaque.component.children.length){
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
  data.destaque.component.msg = getConfig('msg');
  data.destaque.component.level = 1;
  mod.element.innerHTML = mainView(data.destaque.component);
};

const complete = function(mod){
  let links = mod.element.querySelectorAll('.dstq-lnk');
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

class destaques extends Module{
  constructor(){
    super('destaques', {
      fetch,
      render,
      complete
    });
  }
}
let mod = new destaques();
mod.init();

export default mod;
