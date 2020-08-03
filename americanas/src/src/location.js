import Module from './../utils/module';
import * as Location from './../services/location';
import getConfig from './../utils/getConfig';
import { removeClass, addClass, smartClick } from '../utils/utils';
import slugify from '../utils/slugify';
import { get as cookieGet, set as cookieSet } from '../utils/cookie';

let form, input, overlay, alert, svgWrapper, locationText, locationBox, locationLink, locationLinkTooltip, locationTooltip, persistentCep, persistentGeo, currentLocationText, showAlert;

const formatZipCodeMask = function (value) {
  return value.replace(/^([\d]{5})/g, '$1-');
};

const formatZipCodeWithoutMask = function (value) {
  return value.replace('-', '');
};

const hasOnlyNumbers = function (value) {
  return /\d/.exec(value);
};

const isValidZipCode = function (value) {
  const zipCode = formatZipCodeWithoutMask(value);
  return hasOnlyNumbers(zipCode) && zipCode.length === 8;
};

const getNineCharacters = function (value) {
  return value.substr(0, 9);
};

const renderSvg = function () {
  svgWrapper = addClass(document.createElement('div'), 'zipcode-close');
  svgWrapper.innerHTML = '<svg id="zipcode-close-title" viewBox="0 0 20 20"><path fill="inherit" d="M20 2.4L17.7 0 10 7.9 2.3 0 0 2.4 7.4 10 0 17.6 2.3 20l7.7-7.9 7.7 7.9 2.3-2.4-7.4-7.6L20 2.4z"></path></svg>';
  return svgWrapper;
};

const modal = function () {
  overlay = addClass(document.createElement('div'), 'zipcode-overlay');
  const card = addClass(document.createElement('div'), 'zipcode-card');
  form = addClass(document.createElement('form'), 'zipcode-form');

  const title = addClass(document.createElement('h2'), 'zipcode-title');
  title.innerHTML = 'as melhores ofertas e condições de frete para a sua região :)';

  const label = addClass(document.createElement('label'), 'zipcode-label');
  label.innerHTML = 'digite seu CEP';

  const wrapper = addClass(document.createElement('div'), 'zipcode-wrapper');

  const persistentCep = cookieGet('persistentCep');
  input = addClass(document.createElement('input'), 'zipcode-input');
  input.setAttribute('placeholder', '_____-___');
  input.value = persistentCep ? formatZipCodeMask(persistentCep) : '';

  const button = addClass(document.createElement('button'), 'zipcode-button');
  const text = addClass(document.createElement('span'), 'zipcode-text');
  text.innerHTML = 'ok';

  button.appendChild(text);
  wrapper.appendChild(input);
  wrapper.appendChild(button);
  form.appendChild(label);
  form.appendChild(wrapper);
  card.appendChild(title);
  card.appendChild(form);
  card.appendChild(renderSvg());
  overlay.appendChild(card);

  if (overlay) {
    document && document.body.insertAdjacentElement('beforeend', overlay);
    document && addClass(document.body, 'modal-open');
    handleInput();
    handleSubmit();
    handleOverlayClick();
    handleCloseClick();
  }

};

const renderAlert = function () {
  alert = addClass(document.createElement('div'), 'zipcode-alert');

  const text = addClass(document.createElement('span'), 'zipcode-alert-text');
  text.innerHTML = 'CEP não encontrado';

  const svgIcon = addClass(document.createElement('div'), 'zipcode-alert-icon');
  svgIcon.innerHTML = '<svg viewBox="0 0 3.75 25"><g fill="inherit"><path d="M0 0h3.75v16.25H0V0zm0 20h3.75v5H0v-5z" /></g></svg>';

  alert.appendChild(svgIcon);
  alert.appendChild(text);
  form.appendChild(alert);
};

const renderCurrentLocation = function() {
  persistentCep = cookieGet('persistentCep');
  currentLocationText.innerHTML = `entregar em: ${formatZipCodeMask(persistentCep)}`;
};

const reloadPage = function () {
  window && window.location && window.location.reload();
};

const handleSubmit = function () {
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (isValidZipCode(input.value)) {
      fetchLocation(formatZipCodeWithoutMask(input.value), reloadPage);
    }
  });
};

const handleInput = function () {
  input.addEventListener('input', function (event) {
    event.target.value = event.target.value.replace(/\D/g, '');
    if (event.target.value.length > 5) {
      event.target.value = formatZipCodeMask(event.target.value);
    }
    if (event.target.value.length > 9) {
      event.target.value = getNineCharacters(event.target.value);
    }
  });
};

const handleOverlayClick = function () {
  smartClick(overlay, function (event) {
    event.stopPropagation();
    if (event.target === overlay) {
      overlay.remove();
      document && removeClass(document.body, 'modal-open');
    }
  });
};

const handleCloseClick = function() {
  svgWrapper.addEventListener('click', function(event) {
    event.stopPropagation();
    overlay.remove();
    document && removeClass(document.body, 'modal-open');
  });
};

const handleModalClick = function (mod) {
  locationLink = document.getElementById('location-link');

  smartClick(locationLink, function (event) {
    event.stopPropagation();
    modal();
  });
};

const handleTooltipClick = function (mod) {
  mod.open(getConfig('classHover'), true);

  setTimeout(function () {
    localStorage.setItem('tooltip', false);
    mod.close(getConfig('classHover'));
  }, 6000);

  smartClick(locationLinkTooltip, function (e) {
    localStorage.setItem('tooltip', false);
    mod.close(getConfig('classHover'));
  });
};

function fetchLocation(persistentCep, callback) {
  Promise.all([Location.fetchLocation(persistentCep), Location.fetchRegion(persistentCep)])
  .then(function(result) {
    const geolocation = {
      latitude: result[0].latitude,
      longitude: result[0].longitude,
    };
    cookieSet('b2wRegion', result[1].b2wRegion);
    cookieSet('c_customRegion', `${result[0].state}_${slugify(result[0].city)}`);
    cookieSet('persistentGeo', JSON.stringify(geolocation));
    cookieSet('persistentCep', persistentCep);
    if (typeof callback === 'function') {
      callback();
    }
    if (showAlert) {
      alert.remove();
    }
    overlay.remove();
  })
  .catch(function(error) {
    if(error.status === 404) {
      showAlert = true;
      renderAlert();
    }
  });
}

const prerender = function (mod) {
  persistentCep = cookieGet('persistentCep');
  persistentGeo = cookieGet('persistentGeo');
  locationTooltip = !getConfig('location.tooltip') || localStorage.getItem('tooltip');
  currentLocationText = mod.element.querySelector('.location-message');

  if (!locationTooltip) {
    locationBox = addClass(document.createElement('div'), 'box lct-box ' + getConfig('headerPrefix') + 'tooltip arrow-top-right');
    locationBox.id = 'lct-box';
    locationText = addClass(document.createElement('span'), 'lct-text');
    locationLinkTooltip = addClass(document.createElement('a'), 'lct-link');
  }

  if (persistentCep && !persistentGeo) {
    fetchLocation(persistentCep);
  }
};

const render = function (mod) {
  if (!locationTooltip) {
    locationBox.innerHTML = '';
    locationText.innerHTML = 'Pra gente te mostrar as melhores ofertas e condições de frete para o seu endereço.';
    locationLinkTooltip.innerHTML = 'ok, entendi';

    locationBox.appendChild(locationText);
    locationBox.appendChild(locationLinkTooltip);
    mod.element.appendChild(locationBox);
  }

  handleModalClick(mod);
};

const complete = function (mod) {
  if (!locationTooltip) {
    handleTooltipClick(mod);
  }

  if (persistentCep) {
    renderCurrentLocation();
  }
};

class location extends Module {
  constructor() {
    super('location', {
      prerender,
      render,
      complete
    });
  }
}
let mod = new location();
mod.init();

mod.update =  function() {
  renderCurrentLocation();
};

export default mod;
