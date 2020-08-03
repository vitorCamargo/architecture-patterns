import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import * as axios from 'axios';
import { wixAxiosConfig } from '@wix/wix-axios-config';
import { DealerLightboxApi } from '@wix/dealer-lightbox';
import * as wixFullstoryLoader from '@wix/wix-fullstory-loader';
import supportChatWidget from '@wix/support-chat-widget-wrapper';
import * as Sentry from '@sentry/browser';
import { SiteList } from './client/components/SiteList';
import { fedopsLogger } from './client/services/fedops-logger';
import './assets/styles/global.scss';
import { i18nFactory } from './client/services/translation';
import { initClientConsentPolicy } from './client/utils/cookie-consent-policy';
import { Experiments } from './common/const/experiments';
import { createReduxApplication } from './client/redux';
import { createServices } from './client/services';
import { dealerProps, experiments } from './client/utils/env';
import { getUserId } from './client/utils/user-id';
import { registerCommonConfig } from './client/utils/common-config';

const baseURL = window['__BASEURL__'];
const locale: string = window['__LOCALE__'];
const staticsBaseUrl: string = window['__STATICS_BASE_URL__'];
const release = `sites-list@${staticsBaseUrl.match(/([^\/]*)\/*$/)[1]}`;

initClientConsentPolicy(locale);

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: 'https://6768abfa75994874be37c9bf26682009@sentry.wixpress.com/39',
    release,
    attachStacktrace: true,
  });

  Sentry.configureScope(scope => {
    scope.setUser({ id: getUserId() });
  });
}

new DealerLightboxApi().initLightbox({
  translationsUrl: dealerProps().translationsUrl,
  locale,
  viewerUrl: dealerProps().lightboxStaticsUrl,
  location: 'SITE_LIST_LB',
});

wixAxiosConfig(axios, { baseURL });

const services = createServices();
const store = createReduxApplication(services);
registerCommonConfig({ brand: window['__BRAND__'] });

const i18n = i18nFactory(locale, staticsBaseUrl);
ReactDOM.render(<Provider store={store}>
  <React.Suspense fallback="Loading...">
    <SiteList i18n={i18n}/>
  </React.Suspense>
</Provider>, document.getElementById('root'));

if (experiments()[Experiments.DISPLAY_CHAT_WIDGET] === 'true') {
  supportChatWidget.init({ origin: 'SitesList' });
}

if (process.env.NODE_ENV === 'production') {
  fedopsLogger.appLoaded();
  wixFullstoryLoader({ label: 'sites-list', spec: Experiments.CX_OS_FULLSTORY });
}
