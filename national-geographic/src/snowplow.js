const MONTH_IN_SECONDS = 30 * 24 * 60 * 60
export const DEFAULT_SNOWPLOW_SRC = '//dc8xl0ndzn2cb.cloudfront.net/sp.js'

export class SnowplowManager {
  constructor () {
    this.appendScriptToDom = function (p, l, o, w, i, n, g) {
      if (!p[i]) {
        p.GlobalSnowplowNamespace = p.GlobalSnowplowNamespace || []
        p.GlobalSnowplowNamespace.push(i)
        p[i] = function () {
          (p[i].q = p[i].q || []).push(arguments)
        }
        p[i].q = p[i].q || []
        n = l.createElement(o)
        g = l.getElementsByTagName(o)[0]
        n.async = 1
        n.src = w
        g.parentNode.insertBefore(n, g)
      }
    }

    this.initSnowplow = function (winObj, appId, domain, seconds, pingActivityEnabled, snowplowSrc) {
      seconds = seconds || 30
      snowplowSrc = snowplowSrc || DEFAULT_SNOWPLOW_SRC
      this.appendScriptToDom(
        winObj,
        winObj.document,
        'script',
        snowplowSrc,
        'snowplowKW'
      )
      winObj.snowplowKW('newTracker', 'cf', 'pixel.keywee.co', {
        appId: appId,
        cookieDomain: domain
      })
      // Setting visitior session cookie to expire after 13 months instead of 2 year to comply with GDPR
      winObj.snowplowKW('setVisitorCookieTimeout', MONTH_IN_SECONDS * 13)
      if (pingActivityEnabled) {
        winObj.snowplowKW('enableActivityTracking', seconds, seconds)
      }
    }
  }
}
