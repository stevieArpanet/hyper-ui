import { useEffect, useRef, useState } from "react"

import type {
  _CalendarHookState,
  _CalendarHookAction,
  _DatePickerProps,
  _DateTypes,
  _KeyboardEvent,
} from "../types"

import { Calendar } from "./Calendar"
import { CalendarIcon } from "./CalendarIcon"

import { calendarBuilder } from "../calendarBuilder"
import { useCalendar } from "../useCalendar"
import {
  isDateValid,
  checkDateType,
  formatDate,
  convertDateArrayToString,
} from "../helpers"
import { addOutsideClickAndEscEvents } from "@/ui/helpers/addOutsideClickAndEscEvents"

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

    /**
     * convert passed date string array to string:
     * ['2023', '07', '30'] => '30/07/2023
     */
    const date = convertDateArrayToString(arrayDate)

    /** get the date type of current input value state */
    const dateType: _DateTypes = checkDateType(date)

    /** if date type is not date do not update the input value */
    if (dateType !== "date") return

    /** ex. 05/12/2024 */
    valueSet(date)

    /** blur the input element after the second date pick */
    _blurInput(inputRef)
    /** close the calendar after the second date pick, range completed */
    showCalendarSet(false)
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
          placeholder="DD/MM/YYYY"
          className={`${inputValidityStyle} h-12 w-full border px-3 text-left placeholder:text-sm focus:outline-none`}
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
