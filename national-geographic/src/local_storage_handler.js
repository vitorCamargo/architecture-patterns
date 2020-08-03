export class LocalStorageHandler {
  constructor (window) {
    this.setLocalStorage(window)
  }

  setLocalStorage (window) {
    var storage
    var storageIsValid
    var uid
    var now
    try {
      now = new Date()
      uid = now.toString()
      storage = window.localStorage
      storage.setItem(uid, uid)
      storageIsValid = (storage.getItem(uid) === uid)
      storage.removeItem(uid)
      if (!storageIsValid) {
        storage = false
      }
    } catch (exception) {}
    this.storage = storage
  }

  clearLocalStorage (key) {
    this.storage && this.storage.removeItem(key)
  }

  storeObject (key, items) {
    this.storage && this.storage.setItem(key, JSON.stringify(items))
  }

  getStoredObject (key) {
    var value = this.storage && this.storage.getItem(key)
    if (value) {
      return JSON.parse(value)
    } else {
      return {}
    }
  }
}
