import { useEffect, useState } from "react"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/solid"

import type { _CalendarProps } from "./../types"

import { getMonthName } from "../helpers"

export const Calendar = ({
  data,
  isOpen,
  dispatchChangeDate,
  onDayClick,
  onMonthClick,
  onYearClick,
}: _CalendarProps): JSX.Element => {
  const month = data.month
  const monthName = getMonthName(+month)
  const year = data.year

  const [selected, selectedSet] = useState<string[]>([])

  /**
   * handle click on a day adding it to selected array and then trigger
   * onDayClick parent callback
   */
  const onDayClickHandler = (date: string[]): void => {
    const dateString = date.slice(0, 3).join("/")
    selectedSet((prev: string[]) => [...prev, dateString])
    onDayClick(date)
  }

  /** reset selected date when calendar is closed */
  useEffect(() => {
    selectedSet([])
  }, [isOpen])

  return (
    <div
      id="calendarPanel"
      className={`${
        !isOpen ? "hidden" : ""
      } absolute left-0 top-14 z-10 h-60 w-[296px] select-none`}
    >
      <div
        id="calendarContent"
        className="flex flex-col border bg-white p-3 shadow-sm"
      >
        <div
          id="calendarHeader"
          className="flex h-full items-center justify-between p-2 font-bold text-blue-500"
        >
          <ChevronDoubleLeftIcon
            className="h-4 w-4 cursor-pointer font-bold text-blue-500"
            onClick={() => dispatchChangeDate("backwardYear")}
          />
          <ChevronLeftIcon
            className="h-4 w-4 cursor-pointer font-bold text-blue-500"
            onClick={() => dispatchChangeDate("backwardMonth")}
          />
          <div id="calendarTitle" className="flex cursor-pointer gap-1">
            <p onClick={() => onMonthClick(`${month}/${year}`)}>{monthName}</p>
            <p onClick={() => onYearClick(year)}>{year}</p>
          </div>
          <ChevronRightIcon
            className="h-4 w-4 cursor-pointer font-bold text-blue-500"
            onClick={() => dispatchChangeDate("forwardMonth")}
          />
          <ChevronDoubleRightIcon
            className="h-4 w-4 cursor-pointer font-bold text-blue-500"
            onClick={() => dispatchChangeDate("forwardYear")}
          />
        </div>
        <div
          id="calendarGrid"
          className="grid h-60 grid-cols-calendar grid-rows-calendar text-xs"
        >
          <p className="flex items-center justify-center font-bold text-blue-300">
            M
          </p>
          <p className="flex items-center justify-center font-bold text-blue-300">
            T
          </p>
          <p className="flex items-center justify-center font-bold text-blue-300">
            W
          </p>
          <p className="flex items-center justify-center font-bold text-blue-300">
            T
          </p>
          <p className="flex items-center justify-center font-bold text-blue-300">
            F
          </p>
          <p className="flex items-center justify-center font-bold text-blue-300">
            S
          </p>
          <p className="flex items-center justify-center font-bold text-blue-300">
            S
          </p>
          {data.dates.map((date, i) => {
            const day = date[2]
            const lightColor = date[3]
            const weekendCols = [5, 6, 12, 13, 19, 20, 26, 27, 33, 34, 40, 41]

            const dayColor = lightColor
              ? "text-gray-300"
              : weekendCols.includes(i)
              ? "text-red-500"
              : "text-stone-700"

            const selectedDay = selected.includes(date.slice(0, 3).join("/"))
              ? "bg-blue-500 text-white"
              : ""

            return (
              <div
                key={i}
                className={`${dayColor} ${selectedDay} flex cursor-pointer items-center justify-center`}
                onClick={() => {
                  onDayClickHandler(date)
                }}
              >
                {day}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
