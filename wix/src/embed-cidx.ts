import {
  COOKIE_NAME,
  DAYS_2KEEP,
  fetchDomainB,
  getDomainAndUrl,
  readCookie,
  writeCookie
} from './embeds/embed-utils';

try {
  (function() {
    const cookie = readCookie(COOKIE_NAME);
    const [domainA, urlB] = getDomainAndUrl();

    if (urlB) {
      fetchDomainB(urlB, cookie, value => writeCookie(COOKIE_NAME, value, domainA!, DAYS_2KEEP, true));
    }
  })();
} catch (e) {
  console.error('Some problem on cidx cookie processing', e);
}
