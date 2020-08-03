import {todayStr, roundToTwo, last30DaysDateStr, firstMonthDateStr} from './commons'

var objectValues = function (object) {
  var dataArray = []
  for (var o in object) {
    if (object.hasOwnProperty(o)) {
      dataArray.push(object[o])
    }
  }
  return dataArray
}
var category = 'general'
var windowObj = null
var localStorageHandler = null
var sessionTracker = null
var eventSender = null
var getKeyweeHistory = function () {
  return localStorageHandler.getStoredObject('keyweeHistory')
}
var setKeyweeHistory = function (history) {
  localStorageHandler.storeObject('keyweeHistory', history)
}
var getDailyData = function (date) {
  var history = getKeyweeHistory()
  var data = history[date]
  return data || { date: date }
}
var setDailyData = function (date, data) {
  var history = getKeyweeHistory()
  history[date] = data
  setKeyweeHistory(history)
}

var updateData = function (forcedDate) {
  var currentVisitedArticle = windowObj.document.title
  var isKeyweeArticle = windowObj.location.href.indexOf('kwp_4=') > 0
  var dailyData = getDailyData(forcedDate || todayStr)
  var categoryData
  if (!dailyData.categories) {
    dailyData.categories = {}
  }
  if (!dailyData.categories[category]) {
    dailyData.categories[category] = {
      articles_read: 0,
      keywee_articles_read: 0,
      time_spent: 0,
      category: category
    }
  }
  categoryData = dailyData.categories[category]
  if (categoryData.last_visited_article !== currentVisitedArticle) {
    categoryData.articles_read++
    if (isKeyweeArticle) {
      categoryData.keywee_articles_read++
    }
    categoryData.last_visited_article = currentVisitedArticle
  }
  setDailyData(forcedDate || todayStr, dailyData)
  return dailyData
}
var getDatesBetween = function (keyweeHistory, minDate, maxDate) {
  return Object.keys(keyweeHistory).filter(function (historicalDate) {
    return (
      historicalDate >= minDate &&
      (!maxDate || historicalDate <= maxDate)
    )
  })
}
var getDataBetweensDates = function (minDate, maxDate) {
  var keyweeHistory = getKeyweeHistory()
  return getDatesBetween(keyweeHistory, minDate, maxDate).map(function (
    date
  ) {
    return keyweeHistory[date]
  })
}
var cleanOldData = function (forcedDate) {
  var earliestAllowedDate = last30DaysDateStr
  var recentDate
  var updatedHistory = {}
  if (firstMonthDateStr < earliestAllowedDate) {
    earliestAllowedDate = firstMonthDateStr
  }
  if (forcedDate) {
    earliestAllowedDate = forcedDate
  }
  recentDate = getDataBetweensDates(earliestAllowedDate)
  recentDate.forEach(function (historicalData) {
    updatedHistory[historicalData.date] = historicalData
  })
  setKeyweeHistory(updatedHistory)
}
var getEventToSend = function () {
  var dataLast30Days = getDataBetweensDates(last30DaysDateStr)
  var dataThisMonth = getDataBetweensDates(firstMonthDateStr)
  var dataToday = getDataBetweensDates(todayStr, todayStr)
  var sessionData = sessionTracker.getAndUpdateSessionData(new Date())
  var extractCategoriesData = function (rows) {
    if (rows.length === 1) {
      return objectValues(rows[0].categories)
    }
    return rows.reduce(function (all, row) {
      return all.concat(objectValues(row.categories))
    }, [])
  }
  var sumRowsBy = function (rows, field) {
    if (rows.length === 1) {
      return rows[0][field]
    }
    return rows.reduce(function (sum, row) {
      return sum + row[field]
    }, 0)
  }
  var firstLetters = function (field) {
    return field
      .split('_')
      .map(function (word) {
        return word[0]
      })
      .join('')
  }
  var aggregativeFields = [
    'articles_read',
    'keywee_articles_read',
    'time_spent'
  ]
  var flatCategoriesData30D = extractCategoriesData(dataLast30Days)
  var flatCategoriesDataThisMonth = extractCategoriesData(
    dataThisMonth
  )
  var numKeyweeArticlesReadToday = sumRowsBy(extractCategoriesData(dataToday), 'keywee_articles_read')
  var numOfActiveDays30D = dataLast30Days.length
  var numOfActiveDaysCalMonth = dataThisMonth.length
  var event = {
    noad30: numOfActiveDays30D,
    noadcm: numOfActiveDaysCalMonth,
    nokart: numKeyweeArticlesReadToday,
    pvps: sessionData.pageViews,
    slensec: sessionData.sessionLengthSeconds
  }
  var addIsKeyweeReturningUser = function (event) {
    if (event.kar30d > 0 && event.nokart === 0) {
      event.kru = 1
    } else {
      event.kru = 0
    }
    return event
  }
  aggregativeFields.forEach(function (field) {
    var fieldShort = firstLetters(field)
    var fieldName30D = fieldShort + '30d'
    var fieldNameLastMonth = fieldShort + 'cm'
    var fieldsAndData = [
      [fieldName30D, flatCategoriesData30D],
      [fieldNameLastMonth, flatCategoriesDataThisMonth]
    ]
    fieldsAndData.forEach(function (fieldAndData) {
      var fieldName = fieldAndData[0]
      var data = fieldAndData[1]
      var sum = sumRowsBy(data, field)
      event[fieldName] = roundToTwo(sum)
    })
  })
  event = addIsKeyweeReturningUser(event)
  return event
}

export const sendAdvancedPageView = function () {
  var event = null
  updateData()
  event = getEventToSend()
  eventSender.sendCustom('KWCEPV', event)
  eventSender.send('PageView')
}
export const initAdvancedPixel = function (win, sessionTrackerObj, localStorage, fbEventSender) {
  eventSender = fbEventSender
  windowObj = win
  localStorageHandler = localStorage
  sessionTracker = sessionTrackerObj
  cleanOldData()
}
