export interface _CalendarProps {
  data: { month: string; year: string; dates: string[][] }
  isOpen: boolean
  dispatchChangeDate: (action: _CalendarHookAction) => void
  onDayClick: (date: any) => void
  onMonthClick?: (month: string) => void
  onYearClick?: (year: string) => void
}

export interface _CalendarIconProps {
  onClick: () => void
}

export interface _CalendarHookState {
  month: number
  year: number
}

export type _CalendarHookAction =
  | "backwardYear"
  | "backwardMonth"
  | "forwardMonth"
  | "forwardYear"
  | "reset"

export interface _DatePickerProps {
  id: string
  /** pass date value to parent component only if date is empty string or valid */
  onDateChange: (value: Date[] | "", id: string) => void
}

export type _DateTypes =
  | "invalid"
  | "oneYear"
  | "yearsRange"
  | "oneMonthYear"
  | "monthsYearsRange"
  | "date"
  | "datesRange"

export interface _KeyboardEvent extends KeyboardEvent {
  key: string
}
