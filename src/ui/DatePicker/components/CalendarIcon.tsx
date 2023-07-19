import React from "react"
import { CalendarDaysIcon } from "@heroicons/react/24/solid"

import type { _CalendarIconProps } from "./../types"

export const CalendarIcon = ({ onClick }: _CalendarIconProps): JSX.Element => {
  return (
    <div
      id="calendarIcon"
      className="flex h-12 w-10 cursor-pointer items-center justify-center border border-l-0 bg-white"
      onClick={() => onClick()}
    >
      <CalendarDaysIcon className="h-6 w-6 text-gray-400" />
    </div>
  )
}
