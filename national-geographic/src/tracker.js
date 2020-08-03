import {FacebookEventSender} from './facebook_event_sender'
import {SnowplowManager} from './snowplow'
import {initAdvancedPixel, sendAdvancedPageView} from './advanced_pixel'
import initFBPeriodicEvents from './fb_periodic_events'
import {CookieHandler} from './cookie_handler'
import {SessionTracker} from './session_tracker'
import {LocalStorageHandler} from './local_storage_handler'
import {ImagesTracker} from './images_tracker'
import {BidTracker} from './bid_tracker'

export class Tracker {
  constructor (win) {
    this.snowplowManager = new SnowplowManager()
    this.setKeyweeAdId = function (cookieDomain) {
      var identifier = 'kwp_4'
      var cookieIdentifier = 'keywee.' + identifier
      var urlValueMatch = new RegExp(identifier + '=([^&#]*)', 'i').exec(
        win.location.href
      )
      var adId = (urlValueMatch && unescape(urlValueMatch[1])) || ''
      if (adId !== '') {
        this.cookieHandler.createCookie(cookieIdentifier, adId, 30)
      }
      if (win.snowplowKW) {
        win.snowplowKW('setUserIdFromCookie', cookieIdentifier)
      }
    }
    this.getConfig = function (appId) {
      var newScript = win.document.createElement('script')
      newScript.type = 'text/javascript'
      newScript.src = '//cdn.keywee.co/config/' + appId + '.js'
      if (this.testConfigPath) {
        newScript.src = this.testConfigPath
      }
      win.document.getElementsByTagName('head')[0].appendChild(newScript)
    }
    this.initiateTracking = function () {
      var config = this.config
      var domain = this.testDomain || config.domain
      var bidTracker = null
      this.cookieHandler = new CookieHandler(win.document, domain)
      this.localStorageHandler = new LocalStorageHandler(win)
      var imagesTracker = new ImagesTracker(this.localStorageHandler, win)
      var sessionTracker = new SessionTracker(this.cookieHandler, this.localStorageHandler)

      if (config.fbPixelId) {
        this.facebookEventSender = new FacebookEventSender(window, config.fbPixelId)
        if (config.bt) {
          bidTracker = new BidTracker(this.localStorageHandler, win, this.facebookEventSender)
        }
        initFBPeriodicEvents(this.pixelPeriodTimeSec, imagesTracker, bidTracker, this.facebookEventSender)
        initAdvancedPixel(win, sessionTracker, this.localStorageHandler, this.facebookEventSender)
      }
      if (config.appId) {
        this.snowplowManager.initSnowplow(win, config.appId, domain, this.pixelPeriodTimeSec, config.ping_activity, config.snowplow_src)
      }
      this.setKeyweeAdId(domain)
      this.sendPageView()
    }
    this.loadConfig = function (config) {
      var visitorFromEU = config.in_eu || false
      this.config = config
      if (!visitorFromEU || this.trackEU) {
        this.initiateTracking()
      }
    }
    this.init = function (appId, options = {}) {
      this.pixelPeriodTimeSec = options.pixelPeriodTimeSec
      this.testDomain = options.testDomain
      this.testConfigPath = options.testConfigPath
      if (typeof options.trackEU === 'undefined') {
        this.trackEU = true
      } else {
        this.trackEU = options.trackEU
      }
      this.getConfig(appId)
    }
    this.sendPageView = function () {
      if (win.snowplowKW) {
        win.snowplowKW('trackPageView')
      }
      if (this.config.fbPixelId) {
        sendAdvancedPageView(this.config.fbPixelId)
      }
    }
    this.setCustomUrl = function (customUrl) {
      if (win.snowplowKW) {
        win.snowplowKW('setCustomUrl', customUrl)
      }
    }
    this.applyFunc = function () {
      try {
        var args = (arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments))
        var funcArgs = args.slice(1)
        var funcName = args[0]
        if (funcName === 'initialize') {
          this.init.apply(this, funcArgs)
        } else if (funcName === 'sendPageView') {
          this.sendPageView.apply(this, funcArgs)
        } else if (funcName === 'loadConfig') {
          this.loadConfig.apply(this, funcArgs)
        } else if (funcName === 'setCustomUrl') {
          this.setCustomUrl.apply(this, funcArgs)
        }
      } catch (err) {
        funcName = args[0]
        console.log(`Error in keywee-analytics-tracker occurred trying to run the function ${funcName}: `, err)
      }
    }
  }
}
