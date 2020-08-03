const ONE_DAY_MILISEC = 24 * 60 * 60 * 1000
export class CookieHandler {
  constructor (document, domain) {
    this.document = document
    this.domain = domain
  }
  getCookie (name) {
    var value = '; ' + this.document.cookie
    var parts = value.split('; ' + name + '=')
    if (parts.length === 2) return parts.pop().split(';').shift()
  }
  createCookie (name, value, daysToExpire) {
    var expires
    var cookie
    if (daysToExpire) {
      var date = new Date()
      date.setTime(date.getTime() + daysToExpire * ONE_DAY_MILISEC)
      expires = '; expires=' + date.toGMTString()
    } else {
      expires = ''
    }
    cookie = name + '=' + value + expires + '; path=/;'
    if (this.domain) {
      cookie = cookie + ' Domain=' + this.domain
    }
    this.document.cookie = cookie
  }
}
