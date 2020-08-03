import getConfig from './../utils/getConfig';
import cache from './../utils/cache';
import request from './../utils/request';
import {hasClass, addClass, removeClass} from './../utils/utils';
import {Log} from './../services/log';

function renderSkin(data, transitionType = 'prm-local') {
  let header = document.getElementById(`${getConfig('headerId')}`);
  let primeWrapper = addClass(document.createElement('div'), 'hidden brd-logo-wpr');
  addClass(header, 'prime ' + transitionType);

  let primeLogo =
    `<svg class="brd-logo prime" aria-labelledby="brand-prime-title" role="img">
      <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#bhf_icon-logo-prime"></use>
      <title id="brand-prime-title">${getConfig('user.primeTitle')}</title>
    </svg>
    <svg class="brd-logo prime prime-small" aria-labelledby="brand-prime-title" role="img">
      <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#bhf_icon-brand-prime"></use>
      <title id="brand-prime-title">${getConfig('user.primeTitle')}</title>
    </svg>
  `;
  document.getElementById('brd-link').innerHTML=primeLogo;

  if (hasClass(header, 'prm-remote')){
    setTimeout(() => removeClass(primeWrapper, 'hidden'), 500);
  } else {
    removeClass(primeWrapper, 'hidden');
  }

  let primeCSS = document.createElement('style');
  primeCSS.setAttribute('type', 'text/css');
  primeCSS.innerHTML = `${data.css}`;

  let primeSVG = document.createElement('div');
  primeSVG.setAttribute('style', 'display:none;');
  primeSVG.innerHTML = `${data.svg}`;

  header.insertBefore(primeSVG, header.firstChild);
  header.insertBefore(primeCSS, header.firstChild);
}

export function use(skinId, transitionType, _cache = cache) {
  if (skinId == 'prime'){
    let fromCache = cache.get('prime');
    if (fromCache.length > 0) {
      renderSkin(JSON.parse(fromCache), 'prm-local');
    } else {
      request({url: `${getConfig('headerCDNUrl')}skin.prime.js`}).then((data) => {
        cache.set('prime', data.body, 0.1666);//roughly 10 min);
        cache.unlock();
        renderSkin(data.json, 'prm-remote');
      }).catch((data) => Log('Skin error: ', data));
    }
  }
}
