export const NUMBER_OF_VIEWED_IMAGES = 'kw.images_storage'
export const CURRENT_PAGE_URL = 'kw.current_page_url'
export const MAX_VIEWED_IMAGES_PER_PAGE = 'kw.max_images_per_page'
export const IMAGES_INFO = 'imagesInfo'

export class ImagesTracker {
  constructor (localStorageHandler, window) {
    this.localStorageHandler = localStorageHandler
    this.window = window
    this.document = window.document
  }

  getNumberImagesViewed () {
    var imagesInfo = this.localStorageHandler.getStoredObject(IMAGES_INFO)
    var numOfViewedImagesStorageVal = imagesInfo[NUMBER_OF_VIEWED_IMAGES]
    var localStorageURL = imagesInfo[CURRENT_PAGE_URL]
    var currentURL = this.document.URL
    var maxPerPageVal = imagesInfo[MAX_VIEWED_IMAGES_PER_PAGE]
    var maxPerPage = 0

    var numOfViewedImagesPerSession = 0
    if (numOfViewedImagesStorageVal) {
      numOfViewedImagesPerSession = numOfViewedImagesStorageVal
    }

    if (maxPerPageVal) {
      maxPerPage = maxPerPageVal
    }

    var currentAmountOfImages = this.getCurrentAmountOfImages()

    if (localStorageURL === currentURL) { // url does not change
      var currentIsBigger = currentAmountOfImages > maxPerPage
      if (currentIsBigger) { // current amount of images is bigger than the max
        numOfViewedImagesPerSession = numOfViewedImagesPerSession - maxPerPage + currentAmountOfImages //
      } else { // current is smaller
        return numOfViewedImagesPerSession
      }
    } else {
      numOfViewedImagesPerSession += currentAmountOfImages // url changes, num of images is accumulated
      imagesInfo[CURRENT_PAGE_URL] = currentURL
    }
    imagesInfo[NUMBER_OF_VIEWED_IMAGES] = numOfViewedImagesPerSession
    imagesInfo[MAX_VIEWED_IMAGES_PER_PAGE] = currentAmountOfImages
    this.localStorageHandler.storeObject(IMAGES_INFO, imagesInfo)
    return numOfViewedImagesPerSession
  }

  getCurrentAmountOfImages () {
    var window = this.window
    var list = this.document.getElementsByTagName('img')
    var images = Array.prototype.slice.call(list)
    return images.filter(function (e) {
    // get all images that are above the current view
      return e.getBoundingClientRect().top < 0
    })
    // count just the images that are bigger than 10% of the screen resolution
      .filter(function (el) { return (el.height / window.screen.availHeight * 100 > 10 && el.width / window.screen.availWidth * 100 > 10) })
      .length
  };
}
