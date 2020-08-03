/*!
* Overlay
*/

import getConfig from './getConfig';
import {addClass, removeClass, hasClass, smartClick, smartKeydown} from './../utils/utils';
import {LogError} from './../services/log';

let ovl, inl, ovlTarget;

const render = visible => {
	if(!visible) {
		removeClass(document.getElementById(getConfig('headerId')), 'autocomplete-opened');
	}
	ovl = ovl || document.getElementById('header-overlay');
	if(ovl && visible) return addClass(ovl, getConfig('classActive'));
	if(ovl) return removeClass(ovl, getConfig('classActive'));
	create(visible);
	return true;
};

const create = (visible, _getConfig = getConfig, _LogError = LogError) => {

  // overlay1
  ovl    = document.createElement('div');
  ovl.id = 'header-overlay';

  // innerlay
  inl    = addClass(document.createElement('div'), 'header-innerlay');

  if(visible) {
    addClass(ovl, _getConfig('classActive'));
  }

  let hdr            = document.getElementById(_getConfig('headerId'));
  let headerMiddleEl = document.getElementById('header-middle');
  let headerBottomEl = document.getElementById('header-bottom');

  const closeAll = typeof feather !== 'undefined'
                  ? feather.closeAll
                  : () => _LogError('Missing feather.closeAll');

  smartClick(ovl, () => closeAll());
  smartClick(inl, () => closeAll());

  smartKeydown(document, {
    27: function(e){
      if(isOpen() && typeof feather != 'undefined'){
        closeAll();
      }
    }
  }, true);

  if(hdr) {
    hdr.parentNode.insertBefore(addClass(ovl, _getConfig('classReady')), hdr);
    //hdr.querySelector('.header-content').appendChild(inl);
  }

  if(headerMiddleEl) {
    document.getElementById('header-middle').appendChild(inl);
  }

  if(headerBottomEl) {
    document.getElementById('header-bottom').appendChild(inl.cloneNode());
  }
};

const closeOthers = function(){
  if(typeof feather == 'undefined'){
    return;
  }

  let opn = feather.whoIsOpen();
  opn && opn.element !== ovlTarget && opn.close();

};

const isOpen = () => (!!ovl && hasClass(ovl, getConfig('classActive')));

export default ({
  _create: create,
  isOpen: isOpen,
  open: target => {
    if(typeof target == 'object' && target.classList){
      ovlTarget = target;
    }
    else if(typeof target == 'string'){
      let t = document.querySelector(target);
      t && (ovlTarget = t);
    }
    closeOthers();
    render(true);
  },
  close: (target) => {
    ovlTarget == target && render(false);
  },
  toggle: target => {
    isOpen() ? close() : open(target);
  }
});
