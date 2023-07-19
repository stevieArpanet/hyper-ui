"use client"

import { Autocomplete } from "@/ui/Autocomplete"

const TestAutocomplete = (): JSX.Element => {
  const ITEMS = ["javascript", "go", "phyton", "php", "c++", "ruby", "rust"]

  const onChangeHandler = (id: string, value: string) => {
    console.log("onChangeHandler: ", id, value)
  }

  const onSelectHandler = (id: string, value: string) => {
    console.log("onSelectHandler: ", id, value)
  }

  return (
    <div className="h-screen bg-slate-100 pt-20">
      <div id="firstAutocomplete" className="flex flex-col items-center">
        <div className="mb-8">
          <Autocomplete
            id="firstAutocomplete"
            dropdownItems={ITEMS}
            onChange={onChangeHandler}
            onSelect={onSelectHandler}
          ></Autocomplete>
        </div>
      </div>
    </div>
  )
}

export default TestAutocomplete
