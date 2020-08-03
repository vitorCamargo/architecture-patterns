import {roundToTwo, firstLoadTime} from './commons'

var previousVertPosition = null
var getVerticalLocPercentage = function () {
  var wintop = window.pageYOffset || document.documentElement.scrollTop
  var body = document.body
  var html = document.documentElement
  var winheight = window.innerHeight
  var docheight = Math.max(
    body.scrollHeight,
    body.offsetHeight,
    html.clientHeight,
    html.scrollHeight,
    html.offsetHeight
  )
  return roundToTwo(
    Math.min(100, wintop / (docheight - winheight) * 100)
  )
}

var getNumberAdsInPage = () => {
  var list = document.getElementsByTagName('iframe')
  var frames = Array.prototype.slice.call(list)
  return frames.filter(function (e) { return e.dataset['googleContainerId'] }).length
}

var sendPeriodicEvent = function (imagesTracker, bidTracker, eventSender) {
  var currentVerticalPosition = getVerticalLocPercentage()
  var event = null
  var positionChanged =
        currentVerticalPosition !== previousVertPosition
  var currentTimeSpentOnPage = roundToTwo(
    (new Date() - firstLoadTime) / 60000
  )

  var tooMuchTsop = currentTimeSpentOnPage > 30

  if (positionChanged && !tooMuchTsop) {
    event = {
      tsop: currentTimeSpentOnPage,
      lop: currentVerticalPosition,
      noaip: getNumberAdsInPage(),
      noims: imagesTracker.getNumberImagesViewed()

    }
    if (bidTracker) {
      event.erps = bidTracker.getEstimatedRevPerSession()
    }
    eventSender.sendCustom('KWCEPA', event)
    previousVertPosition = currentVerticalPosition
  }
}

const initFBPeriodicEvents = function (seconds, imagesTracker, bidTracker, eventSender) {
  seconds = seconds || 30
  let milliseconds = seconds * 1000
  setInterval(sendPeriodicEvent.bind(null, imagesTracker, bidTracker, eventSender), milliseconds)
}

export default initFBPeriodicEvents
