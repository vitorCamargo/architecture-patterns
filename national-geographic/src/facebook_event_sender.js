export class FacebookEventSender {
    constructor (window, fbPixelId) {
      (function () {
        (function (f, b, e, v, n, t, s) {
          if (f.fbq) return
          n = f.fbq = function () {
            n.callMethod
              ? n.callMethod.apply(n, arguments)
              : n.queue.push(arguments)
          }
          if (!f._fbq) f._fbq = n
          n.push = n
          n.loaded = !0
          n.version = '2.0'
          n.queue = []
          t = b.createElement(e)
          t.async = !0
          t.src = v
          s = b.getElementsByTagName(e)[0]
          s.parentNode.insertBefore(t, s)
        })(window, window.document, 'script', '//connect.facebook.net/en_US/fbevents.js')
        window.fbq('init', fbPixelId)
      })()
      this.window = window
      this.fbPixelId = fbPixelId
    }
    sendCustom (eventName, params) {
      if (this.window.fbq) {
        this.window.fbq('trackSingleCustom', this.fbPixelId, eventName, params)
      }
    }
    send (eventName, params) {
      if (this.window.fbq) {
        this.window.fbq('trackSingle', this.fbPixelId, eventName, params)
      }
    }
  }
  