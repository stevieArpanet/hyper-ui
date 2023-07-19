"use client"

import { DatePicker } from "@/ui/DatePicker"

const TestDatePicker = (): JSX.Element => {
  const onDateChangeHandler = (value: Date[] | "", id: string) => {
    console.log(1111, value, id)
  }

  return (
    <div className="h-screen bg-slate-100 pt-20">
      <div id="firstAutocomplete" className="flex flex-col items-center">
        <div className="mb-8">
          <DatePicker
            id="testDatePicker1"
            onDateChange={onDateChangeHandler}
          ></DatePicker>
        </div>
      </div>
    </div>
  )
}

export default TestDatePicker
