/*
 * topBanner
 */
import Handlebars from 'handlebars/runtime';
import getConfig from './../utils/getConfig';
import {smartClick, redirectEvent} from './../utils/utils';
import tbanner from './../embed/_banner';
import Module from './../utils/module';
import * as hbsHelpers from './../utils/hbsHelpers';
import {get as cookieGet} from '../utils/cookie';
import * as Spacey from './../services/spacey';

const fetch = function(){
  return Spacey.fetch();
};

const multiplusEpar = ['af_00_00_m1_multiplus_acom', 'af_00_00_m1_multiplus_suba', 'af_00_00_m1_multiplus_shop'];
const epar = cookieGet('b2wEPar');

const getBannerData = (data) => {
  if(multiplusEpar.indexOf(epar) > -1)  {
    data.topbannermultiplus && document.getElementById('bhd').classList.add('has-multiplus-banner');
    return data.topbannermultiplus || data.topbanner;
  }
  return data.topbanner;
};

const render = function(mod, data){
  if(!data.topbanner && multiplusEpar.indexOf(epar) == -1){
    return;
  }

  Handlebars.registerPartial('_banner', Handlebars.template(tbanner()));
  Handlebars.registerHelper(hbsHelpers);
  const banner = getBannerData(data);
  const mainView = Handlebars.template(tbanner());
  banner.component.msg = getConfig('msg');
  banner.nolazy = true;
  mod.element.innerHTML = mainView({banner});
};

const complete = function(mod){
  var links = mod.element.querySelectorAll('.hdr-bnr-link');
  function addEvent(item){
    smartClick(item, function(e) {
      return redirectEvent(item, e, 'header.topbanner');
    });
  }
  for (var i = 0; i < links.length; i++) {
    var itm = links[i];
    addEvent(itm);
  }
};

class topbanner extends Module{
  constructor(){
    super('topbanner', {
      fetch,
      render,
      complete
    });
  }
}
let mod = new topbanner();
mod.init();

export default mod;
