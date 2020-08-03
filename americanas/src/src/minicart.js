/*
 * Minicart
 */
import getConfig from './../utils/getConfig';
import * as cookie from './../utils/cookie';
import request from './../utils/request';
import Module from './../utils/module';

import prop from './../utils/toolbelt/prop';
import {hasClass, addClass, removeClass, formatMoney, smartClick, smartHover, redirectEvent, debounce, isQlasTsal, getBrand} from './../utils/utils';
import {Log} from './../services/log';

/**
 * Module Global
 */
let cartId,
  cartQuantity,
  cartUrl,
  cartTitle,
  cartBox,
  cartIcon,
  quantity,
  cartLink;

//fetch data from cart api
function fetchData(mod){
  var updated =  mod.element && hasClass(mod.element, getConfig('classUpdated'));
  if(!updated && cartId){
    request(cartUrl)
			.then((data) => {
  mod.updated = true;
  renderUpdate(prop(['json'], data));
})
			.catch(function(err){
  if(err) {
    Log('Error on fetch data from cart', err);
  }
  renderEmpty(true);
});
  }
  else if (!cartId){
    renderEmpty(false);
  }
}

//empty cart either due to fetching error or no products
function renderEmpty(hasError){
  cartBox.innerHTML = '';
  cartTitle.innerHTML = getConfig('msg.cartEmpty');
  addClass(cartTitle, 'empty-crt');
  cartBox.appendChild(cartTitle);
  quantity = addClass(document.createElement('span'), 'crt-quantity');
  cartQuantity = cookie.get('cart.quantity') || 0;
  quantity.innerHTML = cartQuantity;
  cartLink.appendChild(quantity);
  addClass(mod.element, 'pop');

  if(document.getElementById('bhf_icon-cart-full')){
    cartIcon.outerHTML = `<svg class="crt-icon" aria-labelledby="crt-title" role="img">
			<use xlink:href="#bhf_icon-cart"></use>
			<title id="crt-title">${getConfig('msg.cartTitle')}</title>
		</svg>`;
  }

  addClass(mod.element, getConfig('classReady'));
  hasError && addClass(mod.element, 'error');
}

//updates fetched data
function renderUpdate(data){
  var qty = 0,
    productItems = [];

  data.lines && data.lines.sort(function(a, b){//unavailable products last
    if (a.salesPrice && !b.salesPrice) return -1;
    if (!a.salesPrice && b.salesPrice) return 1;
    return 0;
  });

  data.lines && data.lines.map(function(l){
    qty += (getConfig('minicart.sumQuantity') ? (l.quantity || 1) : 1);//unavailable counts as 1

    if(productItems.length < getConfig('minicart.maxItens', 5)) {
      productItems.push(`
			<li class="crt-it${l.salesPrice ? '' : ' it-unavailable'}">
				<a href="/produto/${l.product.id}" class="crt-it-link">
					<img src="${l.product.image}" class="crt-it-image title="${l.product.image}" />
					<span class="crt-it-name">${l.product.name}</span>
					${l.salesPrice ? '' : `<span class="crt-it-warning"><svg class="crt-warning-icon" role="img"><use xlink:href="#icon-alert-warning"></use></svg> ${getConfig('msg.productUnavailable')}</span>`}
					<span class="crt-it-quant">${'Quantidade:'} ${l.quantity || 1}</span>
					<span class="crt-it-price">${formatMoney(l.salesPrice, true)}</span>
				</a>
			</li>`);
    }
  });

  cookie.set('cart.quantity', qty);

  if(!qty){
    renderEmpty(false);
    return;
  }

  cartBox.innerHTML = '';
  cartTitle.innerHTML = getConfig('msg.cartBoxTitle');
  cartBox.appendChild(cartTitle);

  //list of products
  let list = addClass(document.createElement('ul'), 'crt-item-list');
  list.innerHTML = productItems.join('');
  cartBox.appendChild(list);
  let eventLinks = cartBox.querySelectorAll('.crt-it-link');
  for (let i = 0, len = eventLinks.length; i < len; i++) {
    smartClick(eventLinks[i], function(e) {
      return redirectEvent(eventLinks[i], e, 'header.minicart.product');
    }, false);
  }

  //wrapping bottom elements
  var wrapBottom = addClass(document.createElement('div'), 'crt-bottom');

  //more products
  var more = data.lines.filter(function(o, i){ return i >= getConfig('minicart.maxItens', 5); }).length;
  if(more){
    var moreProducts = addClass(document.createElement('span'), 'crt-more');
    moreProducts.innerHTML = `+ ${more} ${more == 1 ? getConfig('msg.productName') : getConfig('msg.productNamePlural')}`;
    wrapBottom.appendChild(moreProducts);
  }

  //total price
  var total = addClass(document.createElement('span'), 'crt-total');
  total.innerHTML = `${getConfig('msg.cartTotal')} <strong>${formatMoney(data.total,true)}</strong>`;
  wrapBottom.appendChild(total);

  //go to cart button
  var gotoCart = addClass(document.createElement('a'), isQlasTsal() || getBrand() === 'acom' ? ''+getConfig('headerPrefix')+'btn '+getConfig('headerPrefix')+'btn-primary crt-goto rp rp-primary': 'crt-basquet');
  gotoCart.setAttribute('href', getConfig('minicart.basquetUrl'));
  gotoCart.innerHTML = getConfig('msg.cartLinkBasquet');
  smartClick(gotoCart, function(e) {
    return redirectEvent(gotoCart, e, 'header.minicart.cart');
  });
  wrapBottom.appendChild(gotoCart);

  //go to cart button
  //shouldn't exist if acom
  var gotoPayment = addClass(document.createElement('a'), ''+getConfig('headerPrefix')+'btn '+getConfig('headerPrefix')+'btn-primary crt-goto rp rp-primary');
  gotoPayment.setAttribute('href', getConfig('minicart.paymentUrl'));
  gotoPayment.innerHTML = getConfig('msg.cartBuyButton');
  smartClick(gotoPayment, function(e) {
    return redirectEvent(gotoPayment, e, 'header.minicart.payment');
  });
  if(!isQlasTsal() && getBrand() !== 'acom'){
    wrapBottom.appendChild(gotoPayment);
  }

  //Wrapping bottom elements
  cartBox.appendChild(wrapBottom);

  //total quantity
  quantity.innerHTML = qty;
  cartLink.appendChild(quantity);

  addClass(mod.element, getConfig('classUpdated') + ' pop');

  var oldBox = mod.element.querySelector('#crt-box');
  oldBox ? mod.element.replaceChild(cartBox, oldBox) : mod.element.appendChild(cartBox);
}

const prerender = function(mod){
  cartId = cookie.get('cart.id') || getConfig('cartId') || '';
  cartUrl = getConfig('api.cart') + cartId;
  cartTitle = addClass(document.createElement('span'), 'h_tooltip-title');
  cartBox = addClass(document.createElement('div'), 'box crt-box '+getConfig('headerPrefix')+'tooltip arrow-top-right');
  cartBox.id = 'crt-box';
  cartLink = mod.element.querySelector('.crt-link');
  cartIcon = mod.element.querySelector('.crt-icon');

  const mod_open = mod.open;
  mod.open = function(cssClass = getConfig('classActive'), delay){
    if(mod.isEnabled()){
      fetchData(mod);
      return mod_open(cssClass, delay);
    }
  };
  mod.toggle = function(){
    return mod.isActive() ? mod.close() : mod.open();
  };
  const debounced = debounce(function(e){
    removeClass(mod.element, getConfig('classUpdated') + ' pop');
    fetchData(mod);
  }, 3000, true);
  mod.update = function(){
    debounced();
  };

  mod.updateQnt = function(){
    cartQuantity = cookie.get('cart.quantity') || 0;
    quantity.innerHTML = cartQuantity;
  };
};

const render = function(mod){
	//default cart with quantity bubble and fetch on hover/touch
  var cartLoading = addClass(document.createElement('div'), 'loading-spinner');
  cartBox.appendChild(cartLoading);


  cartQuantity = cookie.get('cart.quantity');
  quantity = addClass(document.createElement('span'), 'crt-quantity');
  switch(getConfig('brand')){
  case 'shop':
    if (cartQuantity >= 10) {
      quantity.innerHTML = '+10';
    } else {
      quantity.innerHTML = cartQuantity;
    }
    break;

  default:
    quantity.innerHTML = cartQuantity;
  }

  if(cartQuantity && cartId){
    quantity.innerHTML = cartQuantity;
    cartLink.appendChild(quantity);
    addClass(mod.element, 'pop');
    if(document.getElementById('bhf_icon-cart-full')){
      cartIcon.outerHTML = `<svg class="crt-icon cic-full" aria-labelledby="crt-title" role="img">
				<use xlink:href="#bhf_icon-cart-full"></use>
				<title id="crt-title">${getConfig('msg.cartTitle')}</title>
			</svg>`;
      cartIcon = mod.element.querySelector('.crt-icon');
    }
  }
  var oldBox = mod.element.querySelector('#crt-box');
  oldBox ? mod.element.replaceChild(cartBox, oldBox) : mod.element.appendChild(cartBox);

  if (!cartQuantity){//quantity is 0: cart is empty
    renderEmpty(false);
  }
};

//add hover/touch events
const complete = function(mod){
  if (!getConfig('minicart').disableTooltip) {
    smartClick(cartLink, function(e) {
      // Altera o comportamento do overlay do Shoptime
      const [{title: brandVerify}] = document.getElementsByClassName('brd-link');
      if (brandVerify === 'Shoptime') {
        try {
          const overlay = document.getElementById('header-overlay');
          overlay.setAttribute('style', 'display: block');
        } catch(e) {}
      }
      // Fim do bloco do overlay do Shoptime
      mod.toggle();
      e.preventDefault();
      return false;
    });
    smartHover(mod.element, function(e) {
      // Altera o comportamento do overlay do Shoptime
      const [{title: brandVerify}] = document.getElementsByClassName('brd-link');
      if (brandVerify === 'Shoptime') {
        try {
          const overlay = document.getElementById('header-overlay');
          overlay.setAttribute('style', 'display: block');
        } catch(e) {}
      }
      // Fim do bloco do overlay do Shoptime
      mod.open(getConfig('classHover'), true);
    },
      function(e) {
        mod.close(getConfig('classHover'));
      });
  }
};

class minicart extends Module{
  constructor(){
    super('minicart', {
      prerender,
      render,
      complete
    });
  }
}
let mod = new minicart();
mod.init();

export default mod;
