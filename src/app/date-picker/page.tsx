"use client"

import { DatePicker, DateRangePicker } from "@/ui/DatePicker"

const TestDatePicker = (): JSX.Element => {
  const onDateChangeHandler = (value: Date[] | "", id: string) => {
    console.log(1111, value, id)
  }

  return (
    <div className="h-screen bg-slate-100 pt-20">
      <div className="flex flex-col items-center">
        <div className="mb-8">
          <DateRangePicker
            id="dateRange"
            onDateChange={onDateChangeHandler}
          ></DateRangePicker>
        </div>
        <div className="mb-8">
          <DatePicker
            id="singleDate"
            onDateChange={onDateChangeHandler}
          ></DatePicker>
        </div>
      </div>
    </div>
  )
}

export default TestDatePicker
