import {toggleClass, smartClick} from './utils/utils';
import {getDefaultBody} from './services/events';

let feather;
let Spacey;
let GetConfig;
let Utils;

let waitCount = 0;
let timer;

const WAIT_TIME = 500;
const WAIT_LIMIT = 10;

function WaitForHeader(fn = () => {}) {

  feather = window.feather || null;

  if(feather || waitCount > WAIT_LIMIT){
    clearTimeout(timer);
    feather && fn();
  } else {
    timer = setTimeout(() => {
      WaitForHeader(fn);
    }, WAIT_TIME);
  }
  waitCount++;
}

//expanded footer
const expandableBtn = document.getElementById('btn-expanded');
const expandableArea = document.getElementById('f_expandable');
const expandableBtnMobile = document.getElementById('btn-expanded-mobile');
const moreInfoBackButton = document.getElementById('more-info-back-btn');

expandableBtn && smartClick(expandableBtn, function(e) {
  e.preventDefault();
  toggleClass(expandableBtn, 'closed');
  toggleClass(expandableArea, 'closed');
});

expandableBtnMobile && smartClick(expandableBtnMobile, function(e) {
  e.preventDefault();
  toggleClass(expandableArea, 'opened');
});

moreInfoBackButton && smartClick(moreInfoBackButton, function(e) {
  e.preventDefault();
  toggleClass(expandableArea, 'opened');
});

//social metrics
function socialMetricsInit(config) {
  const socialLinks = document.getElementsByClassName('social-link');
  const body = getDefaultBody(config);

  for (var i = 0; i < socialLinks.length; i++) {
    const item = socialLinks[i];
    const data = {
      detail: Object.assign(body, {
        link: {
          url: item.href,
          title: item.title,
        }
      })
    };

    smartClick(item, () => {
      document.dispatchEvent(new CustomEvent('externalLink:click', data));
    });
  }
}

//modal
function modal(_getConfig = GetConfig){
  let {smartClick,addClass,removeClass,hasClass,isScreenMedium,redirectEvent} = Utils;
  let element = document.getElementById(_getConfig('footerPrefix') + 'link-list'),
    modalLink = element.querySelectorAll('.lst-lnk');
  for (var i = 0, ilen = modalLink.length; i < ilen; i++) {
    let itm = modalLink[i];
    smartClick(itm, function(e) {
      if(isScreenMedium(true) && hasClass(itm.parentNode, 'lst-submenu')){
        e.preventDefault();
        addClass(expandableArea, 'level2-open');
        addClass(itm.parentNode, _getConfig('classActive'));
        return false;
      }
      return redirectEvent(itm, e, 'footer');
    });
    let listBack = itm.parentNode.querySelector('.lst-back');
    listBack && smartClick(listBack, function(e) {
      e.preventDefault();
      removeClass(expandableArea, 'level2-open');
      removeClass(itm.parentNode, _getConfig('classActive'));
      return false;
    });
  }
}

function loop(list = [], template = () => {}, joinStr = '') {
  return list.map(template).join(joinStr);
}

function setHTML(elementID, content = '') {
  document.getElementById(elementID).innerHTML = content;
}

const HTML = {
  highlightMenu: ({menu}) => `
    <div class="feather-wrapper">
      <ul class="list" id="list-level-2">
        ${loop(menu.children, HTML.listItem)}
      </ul>
    </div>`,

  menuContainer: ({menu}) => `
    <div class="feather-wrapper">
      <ul class="list" id="list-level-1">
        ${loop(menu.children, HTML.menuItem)}
      </ul>
    </div>`,

  menuItemTitle: ({title}, msg = GetConfig('msg')) => `
    <a title="${title}" class="lst-lnk ft-title">
      ${title}
      <svg class="ft-arrow" aria-labelledby="ft-arw-title" role="img">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#bhf_icon-arrow"></use>
          <title id="mmn-arw-title">${msg.open}</title>
      </svg>
    </a>
  `,

  listItem: ({title, link, target}) => `
    <li class="lst-item">
      <a href="${link}" title="${title}" class="lst-lnk" ${ !!target && 'target="_blank"'}>${title}</a>
    </li>`,

  menuItem: ({title, children}) => `
    <li class="lst-item lst-submenu">
      ${HTML.menuItemTitle({title: title})}
      <div class="menu-mobile-container">
        <div class="header-mobile">
          <h4 class="lst-title">${title}</h4>
          <a href="#" class="lst-lnk lst-back">
            <svg class="ft-arrow" aria-labelledby="ft-arw-content" role="img">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#bhf_icon-arrow"></use>
              <title id="ft-arw-content">${GetConfig('msg.back')}</title>
            </svg> ${GetConfig('msg.back')}
          </a>
        </div>
        <ul class="list" id="list-level-2">
          ${loop(children, HTML.listItem)}
        </ul>
      </div>
  </li>`,

  footerSvg: () => `
  <svg class="ft-logo" aria-labelledby="bt-title" role="img">
    ${getIcon()}
    <title id="bt-title">${GetConfig('msg.logoTitle')}</title>
  </svg>
  <div class="ft-slogan">${GetConfig('msg.brandSlogan')}</div>
  `

};

function getIcon() {
  if (GetConfig('brand') === 'soub'){
    return '<use xlink:href="#bhf_icon-logo-secondary"></use>';
  }
  return '<use xlink:href="#bhf_icon-logo"></use>';
}

function renderData(data, _getConfig = GetConfig) {

  let highlightTagId  = `${_getConfig('footerPrefix')}hightlight-link-list`;
  let menuTagId       = `${_getConfig('footerPrefix')}link-list`;
  let footerComponent = (Spacey.getPublicationByPosition('footer', data) || {}).component;
  let highlightData   = Spacey.getItemMenu(['Footer', 'Highlight'], footerComponent);
  let menuData        = Spacey.getItemMenu(['Footer', 'Menu'], footerComponent);

  highlightData && setHTML(highlightTagId, HTML.highlightMenu({
    menu: highlightData
  }));

  menuData && setHTML(menuTagId, HTML.menuContainer({
    menu: menuData
  }));

  modal();
}

function Init() {

  Spacey = feather.modules.Spacey;
  GetConfig = feather.getConfig;
  Utils  = feather.modules.utils;
  setHTML('ft-svg', HTML.footerSvg());

  Spacey.fetch().then((data) => renderData(data));
  socialMetricsInit(feather.modules.config);
  // Export feather.footer
  // feather = Object.assign(feather, {
  // });
  // window.feather = feather;
}
WaitForHeader(Init);

