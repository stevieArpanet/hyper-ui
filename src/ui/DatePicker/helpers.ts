import type { _DateTypes } from "./types"

function getCurrentDay(): number {
  return +new Date().getDate()
}

function getCurrentMonth(): number {
  return +new Date().getMonth() + 1
}

function getCurrentYear(): number {
  return +new Date().getFullYear()
}

/**
 * getPreviousMonth(1, 2000) => {prevMonth: 12, prevMonthYear: 1999}
 * getPreviousMonth(12, 2000) => {prevMonth: 11, prevMonthYear: 2000}
 */
function getPreviousMonth(
  month: number,
  monthYear: number
): { prevMonth: number; prevMonthYear: number } {
  const prevMonth = month > 1 ? month - 1 : 12
  const prevMonthYear = month > 1 ? monthYear : monthYear - 1
  return { prevMonth, prevMonthYear }
}

/** getNextMonth(1, 2000) => {nextMonth: 2, nextMonthYear: 2000} */
/** getNextMonth(12, 2000) => {nextMonth: 1, nextMonthYear: 2001} */
function getNextMonth(
  month: number,
  monthYear: number
): { nextMonth: number; nextMonthYear: number } {
  const nextMonth = month < 12 ? month + 1 : 1
  const nextMonthYear = month < 12 ? monthYear : monthYear + 1
  return { nextMonth, nextMonthYear }
}

function getMonthName(monthNumber: number): string {
  const monthsName = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ]
  return monthsName[monthNumber - 1]
}

/**
 * return the days number of a given month in a given year
 * taking into account leap years
 */
function getMonthDaysNumber(
  month = getCurrentMonth(),
  year = getCurrentYear()
): number {
  /** april, june, september, november */
  const monthsWith30Days = [4, 6, 9, 11]

  const febrary = 2

  /**
   * the year is a leap year if
   * is divisible by 4 and not divisible by 100
   * or is divisible by 400
   */
  const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0

  const daysNumber =
    month === febrary
      ? isLeapYear
        ? 29
        : 28
      : monthsWith30Days.includes(month)
      ? 30
      : 31

  return daysNumber
}

/**
 * get the first week day number of the month following this schema:
 * 1(monday), 2(thursday), 3(wednesday), 4(tuesday), 5(friday), 6(saturday),
 * 7(sunday)
 */
function getMonthFirstWeekDayNumber(
  rawMonth = getCurrentMonth(),
  year = getCurrentYear()
): number {
  const month = padding(rawMonth, 2)
  /** getDay() return the week day number of the first day of the month */
  const firstDayOfTheMonthWeekNumber = +new Date(`${year}-${month}-01`).getDay()

  /**
   * when first day is 0 (Date() return sunday as 0), replace 0 with 7
   */
  if (firstDayOfTheMonthWeekNumber === 0) return 7
  return firstDayOfTheMonthWeekNumber
}

function getWeekDays(): { [key: string]: string } {
  return {
    Monday: "Mo",
    Tuesday: "Tue",
    Wednesday: "We",
    Thursday: "Th",
    Friday: "Fr",
    Saturday: "Sa",
    Sunday: "Su",
  }
}

function padding(value: number, length: number): string {
  const padded = `${value}`.padStart(length, "0")
  return padded
}

/** match from 1 to 31 */
const monthDaysRegex = "(?:0[1-9]|[1-2][0-9]|3[0-1])"
/**match from 1 to 12 */
const yearMonthsRegex = "(?:0[1-9]|1[0-2])"
/** match from 1900 to 2100 */
const yearsRegex = "(?:19\\d{2}|20\\d{2}|2100)"

/** match 1983 */
function oneYearRegex(value: string): boolean {
  const regex = new RegExp(`^${yearsRegex}$`)
  const isMatched = regex.test(value)
  return isMatched ? true : false
}

/** match 1983-1984 */
function yearsRangeRegex(value: string): boolean {
  const regex = new RegExp(`^${yearsRegex}-${yearsRegex}$`)
  const isMatched = regex.test(value)

  /** prevent first year to be greater than second year */
  if (isMatched) {
    const [startYear, endYear] = value.split("-")
    return +startYear <= +endYear
  }
  return false
}

/** match 01/1983 */
function oneMonthYearRegex(value: string): boolean {
  const regex = new RegExp(`^${yearMonthsRegex}\\/${yearsRegex}$`)
  const isMatched = regex.test(value)
  return isMatched ? true : false
}

/** match 01/1983-01/1984 */
function monthsYearsRangeRegex(value: string): boolean {
  const regex = new RegExp(
    `^${yearMonthsRegex}\\/${yearsRegex}-${yearMonthsRegex}\\/${yearsRegex}$`
  )
  const isMatched = regex.test(value)
  /** prevent first monthYear to be greater than second monthYear */
  if (isMatched) {
    const [startMonthYear, endMonthYear] = value.split("-")
    return areMonthYearsOrdered(startMonthYear, endMonthYear)
  }
  return false
}

/** match 01/01/1983 */
function oneDateRegex(value: string): boolean {
  const regex = new RegExp(
    `^${monthDaysRegex}\\/${yearMonthsRegex}\\/${yearsRegex}$`
  )
  const isMatched = regex.test(value)
  return isMatched ? true : false
}

/** match 01/01/1983-01/01/1984 */
function datesRangeRegex(value: string): boolean {
  const regex = new RegExp(
    `^${monthDaysRegex}\\/${yearMonthsRegex}\\/${yearsRegex}-${monthDaysRegex}\\/${yearMonthsRegex}\\/${yearsRegex}$`
  )
  const isMatched = regex.test(value)

  /** prevent first date to be greater than second date */
  if (isMatched) {
    const [startDate, endDate] = value.split("-")
    return areDatesOrdered(startDate, endDate)
  }
  return false
}

function isDateValid(value: string): boolean {
  if (typeof value !== "string") return false

  if (
    oneYearRegex(value) ||
    yearsRangeRegex(value) ||
    oneMonthYearRegex(value) ||
    monthsYearsRangeRegex(value) ||
    oneDateRegex(value) ||
    datesRangeRegex(value)
  ) {
    return true
  } else return false
}

function checkDateType(value: string): _DateTypes {
  if (typeof value !== "string") return "invalid"

  if (oneYearRegex(value)) return "oneYear"
  if (yearsRangeRegex(value)) return "yearsRange"
  if (oneMonthYearRegex(value)) return "oneMonthYear"
  if (monthsYearsRangeRegex(value)) return "monthsYearsRange"
  if (oneDateRegex(value)) return "date"
  if (datesRangeRegex(value)) return "datesRange"

  return "invalid"
}

function formatDate(date: string): Date[] | null {
  const dateType = checkDateType(date)
  if (dateType === "oneYear") {
    const year = date
    return [new Date(`${year}-01-01`)]
  } else if (dateType === "yearsRange") {
    const [startYear, endYear] = date.split("-")
    return [new Date(`${startYear}-01-01`), new Date(`${endYear}-01-01`)]
  } else if (dateType === "oneMonthYear") {
    const [month, year] = date.split("/")
    return [new Date(`${year}-${month}-01`)]
  } else if (dateType === "monthsYearsRange") {
    const [startMonthYear, endMonthYear] = date.split("-")
    const [startMonth, startYear] = startMonthYear.split("/")
    const [endMonth, endYear] = endMonthYear.split("/")
    return [
      new Date(`${startYear}-${startMonth}-01`),
      new Date(`${endYear}-${endMonth}-01`),
    ]
  } else if (dateType === "date") {
    const [day, month, year] = date.split("/")
    return [new Date(`${year}-${month}-${day}`)]
  } else if (dateType === "datesRange") {
    const [startDate, endDate] = date.split("-")
    const [startDay, startMonth, startYear] = startDate.split("/")
    const [endDay, endMonth, endYear] = endDate.split("/")
    return [
      new Date(`${startYear}-${startMonth}-${startDay}`),
      new Date(`${endYear}-${endMonth}-${endDay}`),
    ]
  } else return null
}

function convertDateArrayToString(date: string[]): string {
  const stringDate = `${date[2]}/${date[1]}/${date[0]}`
  return stringDate
}

/**
 * check if date1 is before date2; date format: dd/mm/yyyy
 */
function areDatesOrdered(date1: string, date2: string): boolean {
  const [day1, month1, year1] = date1.split("/")
  const [day2, month2, year2] = date2.split("/")

  const date1Obj = new Date(`${year1}-${month1}-${day1}`)
  const date2Obj = new Date(`${year2}-${month2}-${day2}`)

  return date1Obj <= date2Obj
}

/** check if monthYear1 is before monthYear2: date format: mm/yyyy */
function areMonthYearsOrdered(date1: string, date2: string): boolean {
  const [month1, year1] = date1.split("/")
  const [month2, year2] = date2.split("/")

  const date1Obj = new Date(`${year1}-${month1}`)
  const date2Obj = new Date(`${year2}-${month2}`)

  return date1Obj <= date2Obj
}

export {
  getCurrentDay,
  getCurrentMonth,
  getCurrentYear,
  getMonthName,
  getNextMonth,
  getPreviousMonth,
  getMonthDaysNumber,
  getMonthFirstWeekDayNumber,
  getWeekDays,
  padding,
  isDateValid,
  checkDateType,
  formatDate,
  convertDateArrayToString,
  areDatesOrdered,
  areMonthYearsOrdered,
}
