import {IMAGES_INFO} from './images_tracker'
import {BID_INFO} from './bid_tracker'
export const SESSION_COOKIE_NAME = 'kw.session_ts'
const PAGE_VIEW_PER_SESSION_COOKIE_NAME = 'kw.pv_session'
const SESSION_EXPIRATION_TIME_IN_DAYS = 1 / 48 // 30 minutes

export class SessionTracker {
  constructor (cookieHandler, localStorageHandler) {
    this.cookieHandler = cookieHandler
    this.localStorageHandler = localStorageHandler
  }
  initSessionData (currentTime) {
    this.cookieHandler.createCookie(SESSION_COOKIE_NAME, currentTime, SESSION_EXPIRATION_TIME_IN_DAYS)
    this.setPageViewsPerSessionCount(1)
  }
  setPageViewsPerSessionCount (value) {
    this.cookieHandler.createCookie(PAGE_VIEW_PER_SESSION_COOKIE_NAME, value, 1)
  }
  getCurrentPageViewPerSession () {
    var pageViewsPerSessionCookieVal = this.cookieHandler.getCookie(PAGE_VIEW_PER_SESSION_COOKIE_NAME)
    var pageViewsPerSession = 0
    if (pageViewsPerSessionCookieVal) {
      pageViewsPerSession = parseInt(pageViewsPerSessionCookieVal)
    }
    return pageViewsPerSession
  }

  getAndUpdateSessionData (currentTime) {
    var currentTimestamp = currentTime.getTime()
    var pageViews = 1
    var sessionLengthSeconds = 0
    var existingSessionStart = this.getExisitingSessionStart()
    if (existingSessionStart) {
      var currentPageViews = this.getCurrentPageViewPerSession()
      pageViews = currentPageViews + 1
      sessionLengthSeconds = Math.floor((currentTimestamp - existingSessionStart) / 1000)
      this.setPageViewsPerSessionCount(pageViews)
    } else {
      this.initSessionData(currentTimestamp)
      this.localStorageHandler.clearLocalStorage(IMAGES_INFO)
      this.localStorageHandler.clearLocalStorage(BID_INFO)
    }
    return {pageViews: pageViews, sessionLengthSeconds: sessionLengthSeconds}
  }
  getExisitingSessionStart () {
    var sessionCookie = this.cookieHandler.getCookie(SESSION_COOKIE_NAME)
    var sessionStart = null
    if (sessionCookie) {
      sessionStart = parseInt(sessionCookie)
    }
    return sessionStart
  }
}
