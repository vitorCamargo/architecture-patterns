/**
 * Main Menu
 */
import Handlebars from 'handlebars/runtime';
import getConfig from './../utils/getConfig';
import ovl from './../utils/overlay';
import mbox from './../embed/_menu-box';
import mpanel from './../embed/_menu-panel';
import mitem from './../embed/_menu-item';
import mbanner from './../embed/_banner';

import Module from './../utils/module';
import * as utils from './../utils/utils';
import lazy from './../utils/lazy';
import * as hbsHelpers from './../utils/hbsHelpers';
import * as Spacey from './../services/spacey';
import {Log} from './../services/log';

/**
 * Module Global
 */
let menuLink,
	menuParent,
	menuWrapper,
	menuBox,
	parentClassActive;


const prerender = function(mod) {
	menuLink = mod.element.querySelector('.mmn-link');
	menuParent = document.getElementsByTagName('body')[0];
	menuWrapper = mod.element.querySelector('.mmn-wrapper');
	menuBox = utils.addClass(document.createElement('div'), 'mmn-box');
	parentClassActive = getConfig('classMenuActive');

	const mod_open = mod.open;
	mod.open = function(cssClass = getConfig('classActive'), delay) {
		if (mod.isEnabled()) {
			utils.addClass(menuParent, parentClassActive);
			mod_open(cssClass, delay);
		}
	};

	const mod_close = mod.close;
	mod.close = function(cssClass = getConfig('classActive')) {
		mod_close(cssClass);
		!mod.isOpen() && utils.removeClass(menuParent, parentClassActive);
	};

	const mod_toggle = mod.toggle;
	mod.toggle = function() {
		mod.isActive() ? mod.close() : mod.open();
	};
}

//fetch data from spacey
const fetch = function(mod) {
	//loading data
	menuLink.parentNode.insertBefore(menuBox, menuLink.nextSibling);
	let menuLoading = utils.addClass(document.createElement('div'), 'loading-spinner');
	menuBox.appendChild(menuLoading);

	return Spacey.fetch();
}

// function to encode banner url
const encodeBannerUrl = function(data) {
  let stringData = JSON.parse(JSON.stringify(data));
  for (var item in stringData) {
    if(JSON.stringify(item).charAt(1) == 'x'){
			try {
				data[item].component.children[0].linkUrl = encodeURI(data[item].component.children[0].linkUrl);
			} catch(e) {
				console.log('Error on encode banner url: ' + e);
			}
    }
  }
  return data;
}

const render = function(mod, data) {

	if(data && data != null) {
    data = encodeBannerUrl(data);
  }

	if(!data || !data.menu) {
    menuLink.parentNode.removeChild(menuBox);
		return;
	}

	function parseColumns(menu) {
		if(!getConfig('menu.columnsJs')){
			return;
		}

		let lines = getConfig('menu.columnItens', 0);
		!lines && menu.component.children.map(c => {
			lines += c.children.length;
		});

		function columns(item, level) {
			var col = 0,
			len = item.children && item.children.length;

			if (len) {
				for (var i = 0; i < len; i++) {
					columns(item.children[i], level + 1);
				}
				if (level > 1 && len >= lines) {
					item.columns = [];
					let children = item.children.slice();
					while (children.length) {
						item.columns[col] = children.splice(0, lines -(len==lines?1:0));
						col++;
					}
				}
			}
		}

		columns(menu.component, 0);
	}

	function limitItems(menu) {
		if(!getConfig('menu.firstLevelItens')){
			return;
		}

    menu.component.children.map(c => {
    let last = c.children.pop();
      if (utils.isScreenSmaller(true) && getConfig('brand') === 'shop'){
        c.children = c.children.slice(0, getConfig('menu.firstLevelItensMobile') - 2);
      } else {
        c.children = c.children.slice(0, getConfig('menu.firstLevelItens') - 2);
      }
      c.children.push(last);
    });
	}

	function toBoolean(b) {
		if (!isNaN(b || 'i')) {
			b = parseInt((b || 0) * 1, 10);
		}

		return !!b && (b + '').toLowerCase() !== 'false';
	}

	// NOTE: Don't need this function since we're using css columns
	parseColumns(data.menu);
	limitItems(data.menu);

	Handlebars.registerPartial('_menu-panel', Handlebars.template(mpanel()));
	Handlebars.registerPartial('_menu-item', Handlebars.template(mitem()));
	Handlebars.registerPartial('_banner', Handlebars.template(mbanner()));
	Handlebars.registerHelper(hbsHelpers);

	let mainView = Handlebars.template(mbox());
	data.msg = getConfig('msg', {});
	data.config = { menu: getConfig('menu', {})};
  menuBox.outerHTML = mainView(data);
}

//add hover/touch events
const complete = function(mod) {

	utils.addListener(menuLink, 'focus', function(e) {
		feather.modules.search.isOpen() && feather.modules.search.close();
	}, true);
	utils.smartClick(menuLink, function(e) {
		if(mod.updated){
			mod.toggle();
			e.preventDefault();
			return false;
		}
		else{
			return utils.redirectEvent(menuLink, e, 'header.menu');
		}
	});
	utils.smartHover(menuWrapper, function(e) {
		mod.open(getConfig('classHover'), true);
		menuLink.focus();

	}, function(e) {
		mod.close(getConfig('classHover'));
	});
	utils.smartKeydown(menuLink, {
		13: function(e) {
			mod.open(getConfig('classHover'), true);
			e.preventDefault();
		}, //enter
		32: function(e) {
			mod.open(getConfig('classHover'), true);
			e.preventDefault();
		}, //space
		38: function(e) {
			mod.close(getConfig('classHover'));
			e.preventDefault();
		}, //up
		40: function(e) { //down
			if (mod.isOpen()) {
				menuWrapper.querySelector('.mmn-itm-link').focus();
			} else {
				mod.open(getConfig('classHover'), true);
			}
			e.preventDefault();
		}, //down
	});

	function addEvent(item){
		/*utils.smartKeydown(item, {
			13: function(e) {
				item.click();
				e.preventDefault();
			}, //enter
			32: function(e) {
				item.click();
				e.preventDefault();
			}, //space
			38: function(e) { //up
				//console.log(item.parentNode.previousSibling, item.parentNode.previousSibling.firstChild);
				item.parentNode.previousSibling && item.parentNode.previousSibling.firstChild.click();
				e.preventDefault();
			},
			40: function(e) { //down
				item.parentNode.nextSibling && item.parentNode.nextSibling.firstChild.click();
				e.preventDefault();
			}, //down
		}, true);*/

		utils.smartClick(item, function(e) {
			if (utils.isScreenMedium(true) && utils.hasClass(item.parentNode, 'mmn-submenu')) {
				utils.scrollTo(menuWrapper.querySelector('.mmn-box'), 0, 50);
				utils.addClass(item.parentNode, getConfig('classActive'));
				e.preventDefault();
				return false;
			}
			return utils.redirectEvent(item, e, 'header.menu');
		});

		utils.smartHover(item,
			function(e) {
				if (!utils.isScreenMedium(true)) {
					try{
						var imgs = item.parentNode.querySelectorAll('.hdr-bnr-image');
						for (var j = 0, jlen = imgs.length; j < jlen; j++) {
							imgs[j] = lazy.load(imgs[j]);
						}
						utils.addClass(item.parentNode, getConfig('classHover'));
						e.preventDefault();
					}catch(e) {}
					return false;
				}
			},
			function(e) {
				if (!utils.isScreenMedium(true)) {
					utils.removeClass(item.parentNode, getConfig('classHover'));
					e.preventDefault();
					return false;
				}
		});
	}

	let menuItems = menuWrapper.querySelector('.mmn-box').querySelectorAll('.mmn-itm-link');
	for (var i = 0, ilen = menuItems.length; i < ilen; i++) {
		let itm = menuItems[i],
			tab = document.createAttribute('tabindex');
		tab.value = 1;
		itm.setAttributeNode(tab);
		addEvent(itm);

		let menuBack = itm.parentNode.querySelector('.mmn-back');
		menuBack && utils.smartClick(menuBack, function(e) {
			utils.removeClass(itm.parentNode, getConfig('classActive'));
			e.preventDefault();
			return false;
		});
	}
	let menuBanners = menuWrapper.querySelector('.mmn-box').querySelectorAll('.mmn-bnr-link');
	for (var j = 0, jlen = menuBanners.length; j < jlen; j++) {
		let itm = menuBanners[j];
		utils.smartClick(itm, function(e) {
			return utils.redirectEvent(itm, e, 'header.menu.banner');
		});
	}
  utils.addClass(mod.element, getConfig('classReady'));

  // Altera o comportamento do overlay do Shoptime
	const [{title: brandVerify}] = document.getElementsByClassName('brd-link');

  if (brandVerify === 'Shoptime') {
		try {
			const categoryLinks = menuWrapper.querySelector('.mmn-box').querySelectorAll('.itm-lnk-level-1');
			const todasLojas = menuWrapper.querySelector('.mmn-box').querySelectorAll('.itm-lnk-level-1')[6];
			const panel = menuWrapper.querySelector('.mmn-box').querySelectorAll('.mmn-pnl-level-2')[6];
			const mobileMenuIcon = menuWrapper.querySelector('.mmn-sidebar').querySelector('.mmn-link');
			const minicart = document.getElementsByClassName('crt-link')[0];
			const minhaConta = document.getElementById('h_user');
			const search = document.getElementById('h_search-input');
			const headerMiddle = document.getElementById('header-middle');
			const bhd = document.getElementById('bhd');

			headerMiddle.style.backgroundColor = '#ffffff';
			headerMiddle.style.lineHeight = '1.9';
			bhd.style.backgroundColor = '#ffffff';


			ovl._create(false);

			const overlay = document.querySelector('#header-overlay');
			const innerlayShow = (enabled = true) => {
			  Array.from(document.getElementsByClassName('header-innerlay'))
          .map(innerlay => innerlay.setAttribute('style', `display: ${enabled ? 'block' : 'none'}`));
      };

			(function overlayLimited() {
				for (var i = 0; i < categoryLinks.length - 1; i++) {
					let categoryLink = categoryLinks[i];
					categoryLink.classList.add('no-hover');
					categoryLink.addEventListener('mouseenter', function() {
						if (window.matchMedia('(min-width: 1025px)').matches) {
							overlay.setAttribute('style', 'display: none');
							innerlayShow(false);
						};
					});
				}

				todasLojas.addEventListener('mouseenter', function() {
					overlay.setAttribute('style', 'display: block');
          innerlayShow(true);
				});

				panel.addEventListener('mouseenter', function() {
					overlay.setAttribute('style', 'display: block');
          innerlayShow(true);
				});

				mobileMenuIcon.addEventListener('click', function() {
					overlay.setAttribute('style', 'display: block');
          innerlayShow(true);
				});

				mobileMenuIcon.addEventListener('touchstart', function() {
					overlay.setAttribute('style', 'display: block');
          innerlayShow(true);
				});

				minicart.addEventListener('mouseenter', function() {
          innerlayShow(true);
				});

				minhaConta.addEventListener('mouseenter', function() {
          innerlayShow(true);
				});

				search.addEventListener('onfocus', function() {
          innerlayShow(true);
				});

				search.addEventListener('click', function() {
          innerlayShow(true);
				});

				todasLojas.addEventListener('mouseleave', function() {
					overlay.setAttribute('style', 'display: none');
          innerlayShow(false);
				});

				panel.addEventListener('mouseleave', function() {
					overlay.setAttribute('style', 'display: none');
          innerlayShow(false);
				});
			})();
		} catch(e) {}
	}
  // Fim do bloco do overlay do Shoptime
};

class menu extends Module{
	constructor(){
		super('menu', {
			prerender,
			fetch,
			render,
			complete
		})
	}
}
let mod = new menu();
mod.init();

export default mod
