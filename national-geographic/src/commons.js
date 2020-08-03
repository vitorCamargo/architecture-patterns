var dateStr = function (date) {
    var yyyy = date.getFullYear().toString()
    var mm = (date.getMonth() + 1).toString() // getMonth() is zero-based
    var dd = date.getDate().toString()
    return yyyy + (mm[1] ? mm : '0' + mm[0]) + (dd[1] ? dd : '0' + dd[0]) // padding
  }
  export const firstLoadTime = new Date()
  export const todayStr = dateStr(firstLoadTime)
  export const last30DaysDateStr = dateStr(
    new Date(new Date().setDate(firstLoadTime.getDate() - 30))
  )
  export const firstMonthDateStr = dateStr(
    new Date(firstLoadTime.getFullYear(), firstLoadTime.getMonth(), 1)
  )
  export const roundToTwo = function (num) {
    return +(Math.round(num + 'e+2') + 'e-2')
  }
  