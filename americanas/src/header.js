import config from './embed/config';
import getConfig from './utils/getConfig';
import Request from './utils/request';
import Cache from './utils/cache';
import prop from './utils/toolbelt/prop';
import Float from './services/float';
import * as utils from './utils/utils';
import * as Skin from './services/skin';
import * as Spacey from './services/spacey';
import * as Wishlist from './services/wishlist';
import {Log} from './services/log';
import {isPrime} from './services/prime';
import updateCartQuantity from './utils/updateCart';
//modules
import brand from './src/brand';
import externalLink from './src/externallink';
import links from './src/links';
import menu from './src/menu';
import minicart from './src/minicart';
import topbanner from './src/topbanner';
import topmenu from './src/topmenu';
import destaques from './src/destaques';
import trendingtopics from './src/trendingtopics';
import wishlist from './src/wishlist';
import search from './src/search';
import steps from './src/steps';
import user from './src/user';
import location from './src/location';

function looper(fn){
  for (var prop in mods) {
  if (mods.hasOwnProperty(prop)) {
  fn && fn(mods[prop]);
}
}
}

function closeAll(){
  looper(function(mod){
  if(mod.rendered && mod.isOpen && mod.isOpen() && mod.close){
  mod.close(getConfig(['classActive']));
  mod.close(getConfig(['classHover']));
}
});
}

function disableAll(){
  looper(function(mod){
  mod.rendered && mod.isEnabled && mod.isEnabled() && mod.disable && mod.disable();
});
}

function enableAll(){
  looper(function(mod){
  mod.rendered && mod.isEnabled && !mod.isEnabled() && mod.enable && mod.enable();
});
}

function initAll(){
  looper(function(mod){
  mod.init && mod.init();
});
}

function whoIsOpen(){
  let open = null;
  looper(function(mod){
  if(mod.rendered && mod.isOpen && mod.isOpen()){
  open = mod;
  return;
}
});
  return open;
}

function anyOpen(){
  return !!whoIsOpen();
}

let mainElement = document.getElementById(getConfig(['headerId'])),
  contentElement = mainElement.querySelector('.header-content');

const headerMiddle = document.getElementById('header-middle');
const headerBottom = document.getElementById('header-bottom');

function enableMini(){
  return utils.hasClass(utils.addClass(mainElement, getConfig(['classHeaderMini'])), getConfig(['classHeaderMini']));
}

function disableMini(){
  return !utils.hasClass(utils.removeClass(mainElement, getConfig(['classHeaderMini'])), getConfig(['classHeaderMini']));
}

utils.hasClass(mainElement, getConfig(['classHeaderFloatEnable'])) && Float(mainElement, getConfig(['classHeaderFloat']));

isPrime().then((result) => {
  Skin.use('prime', result);
}).catch((result) => result.status && Log('Prime check error: ', result));


window.addEventListener('load', function(event) {
  utils.lazyLoadScript(['siteBlindado'], getConfig(['footerId']));
});

function headerBottomIsOpen() {
  if (typeof mainElement === 'undefined' || mainElement === null) return false;

  return utils.hasClass(mainElement, 'up') ? true : false;
}

function getFloaterHeaderHeight() {
  if (typeof headerMiddle === 'undefined' || typeof headerBottom === 'undefined') return 0;

  const middleHeight = headerMiddle ? headerMiddle.getBoundingClientRect().height : 0;
  const bottomHeight = headerBottom ? headerBottom.getBoundingClientRect().height : 0;

  return middleHeight + bottomHeight;
}

let toolbelt = {prop: prop};
let mods = { config, brand, trendingtopics, wishlist, search, user, minicart, menu, topmenu, destaques, externalLink, topbanner, steps, utils, Request, Cache, toolbelt, Spacey, Wishlist, Log, location };
let exp = { version: getConfig(['version']), getConfig, header: {element: mainElement, updateCartQuantity, links, headerBottomIsOpen, getFloaterHeaderHeight}, modules: mods, anyOpen, closeAll, whoIsOpen, enableAll, disableAll, initAll, enableMini, disableMini };

export default exp;
