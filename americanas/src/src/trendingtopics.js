/*
 * trending topics
 */
import Handlebars from 'handlebars/runtime';
import getConfig from './../utils/getConfig';
import {
  hasClass,
  addClass,
  smartClick,
  redirectEvent
} from './../utils/utils';
import list from './../embed/_list';
import listItem from './../embed/_list-item';
import Module from './../utils/module';
import * as Spacey from './../services/spacey';
import { isPrime } from './../services/prime';

const fetch = function(mod) {
  return Spacey.fetch();
};

const render = function(mod, data) {
  if (!data.tt || !data.tt.component.children.length) {
    return;
  }

  Handlebars.registerPartial('_list', Handlebars.template(list()));
  Handlebars.registerPartial('_list-item', Handlebars.template(listItem()));
  Handlebars.registerHelper('counter', function(num) {
    return parseInt(num, 10) + 1;
  });
  Handlebars.registerHelper('toboolean', function(b) {
    if (!isNaN(b || 'i')) {
      b = parseInt(b || 0, 10);
    }

    return !!b && (b + '').toLowerCase() !== 'false';
  });

  data.tt.component.msg = getConfig('msg');
  data.tt.component.signinPrime =
    getConfig('trendingTopics.signinPrime') || false;
  data.tt.component.level = 1;
  if (data.tt.component.signinPrime) {
    data.tt.component.signinPrimeItemName = getConfig('msg.logoSloganText');
    data.tt.component.signinPrimeItemUrl = getConfig('msg.logoSloganLink');
  }
  data.tt.component.primeItemUrl = getConfig('trendingTopics.primeItemUrl');
  data.tt.component.primeItemName = getConfig('trendingTopics.primeItemName');

  data.tt.component.ame = getConfig('ame.active') || false;
  data.tt.component.ameItemURL = getConfig('ame.itemURL');
  data.tt.component.ameItemName = getConfig('ame.itemName');

  data.tt.component.mundo = getConfig('trendingTopics.mundo') || false;
  data.tt.component.mundoUrl = getConfig('msg.mundoUrl');
  data.tt.component.mundoName = getConfig('msg.mundoName');
  data.tt.component.mundoNick = getConfig('msg.mundoNick');

  data.tt.component.empresas = getConfig('trendingTopics.empresas') || false;
  data.tt.component.empresasUrl = getConfig('msg.empresasUrl');
  data.tt.component.empresasName = getConfig('msg.empresasName');
  data.tt.component.empresasNick = getConfig('msg.empresasNick');

  data.tt.component.fixedLink = getConfig('trendingTopics.fixedLink') || false;

  let mainView = Handlebars.template(list());

  isPrime()
    .then(result => {
      data.tt.component.prime = true;
      mod.element.innerHTML = mainView(data.tt.component);
    })
    .catch(result => {
      data.tt.component.prime = false;
      mod.element.innerHTML = mainView(data.tt.component);
    });
};

function complete(item) {
  let links = mod.element.querySelectorAll('.lst-lnk');
  function addEvent(item) {
    smartClick(item, function(e) {
      return redirectEvent(item, e, 'header.trendingtopics');
    });
  }
  for (var j = 0, jlen = links.length; j < jlen; j++) {
    let itm = links[j];
    // let tab = document.createAttribute('tabindex');
    // tab.value = ??;
    // itm.setAttributeNode(tab);
    itm.getAttribute('href') &&
      itm.getAttribute('href') !== '#' &&
      addEvent(itm);
  }
}

class trendingtopics extends Module {
  constructor() {
    super('trendingtopics', {
      fetch,
      render,
      complete
    });
  }
}
let mod = new trendingtopics();
mod.init();

export default mod;
