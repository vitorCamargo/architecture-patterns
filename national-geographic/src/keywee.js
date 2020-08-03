import {Tracker} from './tracker'
var tracker = new Tracker(window)
if (window.kwa && window.kwa.q) {
  var queue = window.kwa.q
  queue.forEach(function (args) { tracker.applyFunc.apply(tracker, args) })
}
window.kwa = tracker.applyFunc.bind(tracker)
