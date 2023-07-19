import { useEffect, useRef, useState } from "react"

import type {
  _CalendarHookState,
  _CalendarHookAction,
  _DatePickerProps,
  _DateTypes,
  _KeyboardEvent,
} from "./types"

import { Calendar } from "./components/Calendar"
import { CalendarIcon } from "./components/CalendarIcon"

import { calendarBuilder } from "./calendarBuilder"
import { useCalendar } from "./useCalendar"
import {
  isDateValid,
  checkDateType,
  formatDate,
  convertDateArrayToString,
  areDatesOrdered,
  areMonthYearsOrdered,
} from "./helpers"
import { addOutsideClickAndEscEvents } from "../helpers/addOutsideClickAndEscEvents"

export const DatePicker = ({
  onDateChange,
  id,
}: _DatePickerProps): JSX.Element => {
  /** this custom hook handles calendar date changes using arrow icons */
  const [calendarState, dispatchChangeDate] = useCalendar()

  const [value, valueSet] = useState("")
  const [showCalendar, showCalendarSet] = useState(false)
  const [calendarData, calendarDataSet] = useState<{
    month: string
    year: string
    dates: string[][]
  }>(calendarBuilder(calendarState))

  /** refer whole DatePicker component */
  const datePickerRef = useRef<HTMLInputElement>(null)
  /** refer the date input element */
  const inputRef = useRef<HTMLInputElement>(null)

  const onInputClickHandler = (
    event: React.MouseEvent<HTMLInputElement>
  ): void => {
    valueSet("")
    showCalendarSet(false)
  }

  const onInputChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const currentValue = event.currentTarget.value
    valueSet(currentValue)
  }

  const onCalendarIconClickHandler = (): void => {
    showCalendarSet(!showCalendar)
    valueSet("")
    dispatchChangeDate("reset")
  }

  /** hide calendar on click outside date picker */
  const onClickOutsideHandler = (event: MouseEvent): void => {
    /**
     * you don't know on which kind of node user clicked so use generic Node;
     * prevent triggering the event when user clicks on the DatePicker component
     */
    if (!datePickerRef.current?.contains(event.target as Node))
      showCalendarSet(false)
  }

  /** hide calendar on esc key press */
  const onEscKeyHandler = (event: _KeyboardEvent): void => {
    if (event.key === "Escape") showCalendarSet(false)
  }

  /** handle click on calendar days */
  const onDayClickHandler = (arrayDate: string[]): void => {
    /** focus on the input element to allow manual input */
    _focusInput(inputRef)

    /** get the date type of current input value state */
    const currentInputValueDateType: _DateTypes = checkDateType(value)

    /**
     * convert passed date string array to string:
     * ['2023', '07', '30'] => '30/07/2023
     */
    const date = convertDateArrayToString(arrayDate)

    /**
     * if current input value is not "date" (05/12/2024) then user didn't click
     * a day yet or there is a date not valid in the input, so replace the
     * current input value with the clicked day date
     */
    if (currentInputValueDateType !== "date") {
      /** ex. 05/12/2024 */
      valueSet(date)
      /**
       * if current input value is "date" (05/12/2024) then user clicked has
       * clicked on the second date, so complete the range and close the
       * calendar and blur the input element
       */
    } else {
      /** if date2 is before date1 then swap them */
      if (!areDatesOrdered(value, date)) {
        /** ex. 05/12/2024-30/07/2024 */
        valueSet(`${date}-${value}`)
      } else {
        /** ex. 05/12/2024-30/07/2024 */
        valueSet(`${value}-${date}`)
      }
      /** blur the input element after the second date pick */
      _blurInput(inputRef)
      /** close the calendar after the second date pick, range completed */
      showCalendarSet(false)
    }
  }

  /** handle click on calendar months */
  const onMonthClickHandler = (monthYear: string): void => {
    /** focus on the input element to allow manual input */
    _focusInput(inputRef)

    /** get the date type of current input value state */
    const currentInputValueDateType: _DateTypes = checkDateType(value)

    /**
     * if current input value is not "oneMonthYear" (12/2024) then user didn't
     * click a month yet or there is date not valid in the input, so replace the
     * current input value with the clicked monthYear
     */
    if (currentInputValueDateType !== "oneMonthYear") {
      /** ex. 12/2024 */
      valueSet(monthYear)
      /**
       * if current input value is "oneMonthYear" (12/2024) then user has
       * clicked on the second month, so complete the range and close the
       * calendar and blur the input element
       */
    } else {
      /** if monthYear2 is before monthYear1 then swap them */
      if (!areMonthYearsOrdered(value, monthYear)) {
        /** ex. 12/2024-07/2024 */
        valueSet(`${monthYear}-${value}`)
      } else {
        /** ex. 07/2024-12/2024 */
        valueSet(`${value}-${monthYear}`)
      }
      /** blur the input element after the second date pick */
      _blurInput(inputRef)
      /** close the calendar after the second date pick, range completed */
      showCalendarSet(false)
    }
  }

  /** handle click on calendar years */
  const onYearClickHandler = (year: string): void => {
    /** focus on the input element to allow manual input */
    _focusInput(inputRef)

    /** get the date type of current input value state */
    const currentInputValueDateType: _DateTypes = checkDateType(value)

    /**
     * if current input value is not "oneYear" (2024) then user didn't click a
     * year yet or there is date not valid in the input, so replace the current
     * input value with the clicked year
     */
    if (currentInputValueDateType !== "oneYear") {
      /** ex. 05/12/2024 */
      valueSet(year)
      /**
       * if current input value is "oneYear" (2024) then user has
       * clicked on the second year, so complete the range and close the
       * calendar and blur the input element
       */
    } else {
      /** if year2 is before year1 then swap them */
      if (year < value) {
        /** ex. 2024-2024 */
        valueSet(`${year}-${value}`)
      } else {
        /** ex. 2024-2024 */
        valueSet(`${value}-${year}`)
      }
      /** blur the input element after the second date pick */
      _blurInput(inputRef)
      /** close the calendar after the second date pick, range completed */
      showCalendarSet(false)
    }
  }

  /** use useEffect to update calendarData when calendarState changes */
  useEffect(() => {
    calendarDataSet(calendarBuilder(calendarState))
  }, [calendarState])

  /**
   * use useEffect to catch click outside of the autocomplete and esc keydown
   * event to close the calendar
   */
  useEffect(
    addOutsideClickAndEscEvents(onClickOutsideHandler, onEscKeyHandler),
    []
  )

  /**
   * this is the connection point to the parent controller; pass formatted date
   * value to parent controller only when date value is empty string or valid
   * date
   */
  useEffect(() => {
    if (value === "") onDateChange(value, id)
    else if (isDateValid(value)) {
      const formattedDate = formatDate(value)
      /** if value can't be formatted do no pass anything to parent controller */
      formattedDate ? onDateChange(formattedDate, id) : ""
      /** if value is not a valid data do not pass anything to parent controller */
    } else return
  }, [value])

  const inputValidityStyle =
    value === ""
      ? ""
      : isDateValid(value)
      ? "border-green-300 bg-green-50/50 text-green-500"
      : "border-red-300 bg-red-50/90 text-red-500"

  return (
    <div ref={datePickerRef} className="relative">
      <div className="flex items-center">
        <input
          ref={inputRef}
          type="text"
          placeholder="DD/MM/YYYY-DD/MM/YYYY"
          className={`${inputValidityStyle} h-12 w-64 border px-3 text-center placeholder:text-sm focus:outline-none`}
          onClick={onInputClickHandler}
          onChange={onInputChangeHandler}
          value={value}
        />

        <CalendarIcon onClick={onCalendarIconClickHandler} />

        <Calendar
          data={calendarData}
          isOpen={showCalendar}
          dispatchChangeDate={dispatchChangeDate}
          onDayClick={onDayClickHandler}
          onMonthClick={onMonthClickHandler}
          onYearClick={onYearClickHandler}
        />
      </div>
    </div>
  )
}

/** focus on the input element */
function _focusInput(
  inputRef: React.MutableRefObject<HTMLInputElement | null>
) {
  if (inputRef.current) {
    inputRef.current.focus()
  }
}

/**
 *  using setTimeout with a minimal delay of 0 milliseconds ensures that
 *  the blur() method is called at an appropriate time in the event loop,
 *  after the necessary rendering and state updates have been applied.
 */
function _blurInput(inputRef: React.MutableRefObject<HTMLInputElement | null>) {
  setTimeout(() => {
    if (inputRef.current) {
      inputRef.current.blur()
    }
  }, 0)
}
