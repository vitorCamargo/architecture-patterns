export const BID_INFO = 'erps_info'
const BID_EVENT_INTERVAL_SEC = 10

export class BidTracker {
  constructor (localStorageHandler, window, eventSender) {
    this.localStorageHandler = localStorageHandler
    this.window = window
    this.document = window.document
    this.eventSender = eventSender
    setInterval(() => this.updateBidsData(), BID_EVENT_INTERVAL_SEC * 1000)
  }
  loadSessionBids () {
    return this.localStorageHandler.getStoredObject(BID_INFO) || {}
  }
  storeSessionBids (bidInfo) {
    this.localStorageHandler.storeObject(BID_INFO, bidInfo)
  }
  updateBidsData () {
    let newBidsSum = 0
    let currentBidInfo = this.loadSessionBids()
    let winners = this.getAvailableBidWinners()
    let newWinners = winners.filter(function (winner) {
      let winnerID = winner.hb_adid
      return !currentBidInfo[winnerID]
    })
    let lastWinnerID = null
    newWinners.forEach(function (winner) {
      if (winner && winner.hb_pb) {
        let winnerBid = parseFloat(winner.hb_pb)
        newBidsSum += winnerBid
        currentBidInfo[winner.hb_adid] = winnerBid
        lastWinnerID = winner.hb_adid
      }
    })
    this.storeSessionBids(currentBidInfo)
    if (newBidsSum > 0) {
      let realBidSum = (newBidsSum / 1000)
      this.sendPurchaseEvent(this.round(realBidSum), lastWinnerID)
    }
  }
  round (num) {
    return +(Math.round(num + 'e+5') + 'e-5')
  }
  sendPurchaseEvent (value, lastWinnerID) {
    this.eventSender.send('Purchase', {value: value, currency: 'USD', lwid: lastWinnerID})
  }
  getEstimatedRevPerSession () {
    let erps = Object.values(this.loadSessionBids()).reduce(function (sum, bid) {
      if (bid) {
        sum += parseFloat(bid)
      }
      return sum
    }, 0)
    return this.round(erps)
  }
  getAvailableBidWinners () {
    let winners = []
    if (this.window.gb_kaleidoscope && this.window.gb_kaleidoscope.ad_slots) {
      this.window.gb_kaleidoscope.ad_slots.forEach(
        function (adSlot) {
          if (adSlot.prebid_winner) {
            winners.push(adSlot.prebid_winner)
          }
        })
    }
    return winners
  };
}
