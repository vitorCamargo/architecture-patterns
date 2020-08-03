/*
 * display
 * it's !important
 */

import getConfig from './../utils/getConfig';
import overlay from './../utils/overlay';
import {addClass, removeClass, hasClass, smartHover } from './../utils/utils';

const classParentActive = 'dsp-active';

export default class {
  constructor(target){
    let _self = this;
    let _enabled = true;
    let _delay;
    let _duration;
    this.target = target;
    this.change = function(cssClass = getConfig('classActive'), open = false) {
      if (open) {
        typeof feather !== 'undefined' && addClass(feather.header.element, classParentActive);
        addClass(_self.target, cssClass);
      } else {
        removeClass(_self.target, cssClass);
        typeof feather !== 'undefined' && removeClass(feather.header.element, classParentActive);
      }
    };
    this.open = function(cssClass = getConfig('classActive'), delay){
      if(_enabled){
        if(delay){
          _delay = setTimeout(function(){
            overlay.open(_self.target);
            _self.change(cssClass, true);
          }, 450);
        }else{
          overlay.open(_self.target);
          _self.change(cssClass, true);
        }
      }
    };
    this.close = function(cssClass = getConfig('classActive')) {
      clearTimeout(_delay);
      _self.change(cssClass, false);
      if(!_self.isOpen()){
        overlay.close(_self.target);
      }
    };
    this.toggle = function(cssClass = getConfig('classActive'), delay) {
      if (hasClass(_self.target, cssClass)) {
        _self.close(cssClass);
      } else {
        _self.open(cssClass, delay);
      }
    };
    this.disable = function(cssClass = getConfig('classDisabled')){
      _self.close();
      _enabled = false;
      addClass(_self.target, cssClass);
    };
    this.enable = function(cssClass = getConfig('classDisabled')){
      _enabled = true;
      removeClass(_self.target, cssClass);
    };
    this.isOpen = function(){
      return _self.isActive() || _self.isHover();
    };
    this.isActive = function(){
      return hasClass(_self.target, getConfig('classActive'));
    };
    this.isHover = function(){
      return hasClass(_self.target, getConfig('classHover'));
    };
    this.isEnabled = function() {
      return _enabled;
    };
    this.pin = function(cssClass = getConfig('classPin')){
      addClass(_self.target, cssClass);
    };
    this.unpin = function(cssClass = getConfig('classPin')){
      removeClass(_self.target, cssClass);
    };
  }
}
