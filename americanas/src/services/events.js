import {b64DecodeUnicode} from '../utils/utils';
import {get as cookieGet} from '../utils/cookie';

function getDeviceInfo() {
  try {
    const deviceCookie = cookieGet('b2wDevice');
    const device = b64DecodeUnicode(deviceCookie);

    return JSON.parse(device);
  } catch(err) {
    return {};
  }
}

export function getNavigationInfo() {
  if (!window || !document) return {};

  const host = window.location && window.location.host;
  const pathname = window.location && window.location.pathname;
  const search = window.location && window.location.search;
  const referrer = document.referrer;

  return {
    host,
    pathname,
    search,
    referrer,
  };
}

export function getProjectInfo(config) {
  if (!config) return {};

  return {
    name: 'feather',
    brand: config.brand,
    domain: config.domain,
    version: config.version,
  };
}

export function getDefaultBody(config) {
  if (!window) return {};

  const eventID = `${new Date()
    .getTime()}.${Math.random()
    .toString()}`;

  return {
    eventID,
    device: getDeviceInfo(),
    navigation: getNavigationInfo(),
    project: getProjectInfo(config),
  };
}
