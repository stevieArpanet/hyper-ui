import {
  getCurrentMonth,
  getCurrentYear,
  getNextMonth,
  getPreviousMonth,
  getMonthDaysNumber,
  getMonthFirstWeekDayNumber,
  padding,
} from "./helpers"

const WEEKS_ON_CALENDAR = 6

/** by default it return calendar for current month and year */
export const calendarBuilder = ({
  /** both object keys and object itself are optional and have a default value */
  month = getCurrentMonth(),
  year = getCurrentYear(),
} = {}): { month: string; year: string; dates: string[][] } => {
  /** ex. 30 */
  const currentMonthDaysNumber = getMonthDaysNumber(month, year)
  /** ex. 1 for Monday */
  const currentMonthFirstWeekDayNumber = getMonthFirstWeekDayNumber(month, year)

  /**
   * calendar is a grid of 6 weeks and 7 days (42 days); we add days from
   * previous month and next month to fill the grid
   */

  /**
   * this calculate days to add to the calendar from previous month; ex. if
   * first day of the week is 6 (friday) then add 6-1=5 days from previous week
   */
  const daysFromPrevMonth = currentMonthFirstWeekDayNumber - 1

  /** this calculate days to add to the calendar from next month */
  const daysFromNextMonth =
    WEEKS_ON_CALENDAR * 7 - (daysFromPrevMonth + currentMonthDaysNumber)

  const { prevMonth, prevMonthYear } = getPreviousMonth(month, year)
  const { nextMonth, nextMonthYear } = getNextMonth(month, year)

  const prevMonthDaysNumber = getMonthDaysNumber(prevMonth, prevMonthYear)

  /**
   * The code creates an array with a length of daysFromPrevMonth (a number),
   * which should represent the number of days from the previous month that are
   * being displayed in the current month's calendar view. It's mapping over
   * this array to generate date strings for each of these days. the spread is
   * needed to make the empy array iterable by map;
   * ex. return [['2023', '02', '27'], ['2023', '02', '28'], ..]]
   */
  const prevMonthDates = [...new Array(daysFromPrevMonth)].map(
    (_, zeroStartIndex): string[] => {
      /** make the mapping index starting from 1 instead of zero */
      const index = zeroStartIndex + 1
      /**
       * notDisplayedDays represents the days from the previous month that are
       * not displayed on the current month's calendar view. It's calculated by
       * subtracting daysFromPrevMonth from the total number of days in the
       * previous month (prevMonthDaysNumber). ex. febrary with 28 days; show
       * only last 2 days not displayed on calendar:  28 - 2 = 26
       */
      const notDisplayedDays = prevMonthDaysNumber - daysFromPrevMonth
      /**
       * day that will be addeed to the current calendar view;
       * ex. 1 + 26 = 27 and 2 + 26 = 28
       */
      const day = index + notDisplayedDays

      const date = [
        prevMonthYear.toString(),
        padding(prevMonth, 2),
        padding(day, 2),
        "lightColor",
      ]
      return date // ['2023', '02', '27']
    }
  )

  /**
   * display the dates of the current month ex. return [['2023', '03', '01'],
   * ['2023', '03', '02'], ...]
   */
  const currentMonthDates = [...new Array(currentMonthDaysNumber)].map(
    (_, zeroStartIndex): string[] => {
      /** adjust the zeroStartIndex to start from 1 */
      const day = zeroStartIndex + 1
      const date = [year.toString(), padding(month, 2), padding(day, 2)]
      return date
    }
  )

  /**
   * display the dates of the next month that fall within the current
   * calendar view; ex. return [['2023', '04', '01'], ['2023', '04', '02'], ...]]
   */
  const nextMonthDates = [...new Array(daysFromNextMonth)].map(
    (_, zeroStartIndex): string[] => {
      /** adjust the zeroStartIndex to start from 1 */
      const day = zeroStartIndex + 1
      const date = [
        nextMonthYear.toString(),
        padding(nextMonth, 2),
        padding(day, 2),
        "lightColor",
      ]
      return date
    }
  )
  /**
   * if WEEKS_ON_CALENDAR === 6 return 42 dates spanning 3 months:
   * previous, current and next
   */
  const calendar = {
    month: padding(month, 2),
    year: year.toString(),
    dates: [...prevMonthDates, ...currentMonthDates, ...nextMonthDates],
  }
  return calendar
}
