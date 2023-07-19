import { useEffect, useRef, useState } from "react"

import type { _AutocompleteProps, _KeyboardEvent } from "./types"

import { addOutsideClickAndEscEvents } from "../helpers/addOutsideClickAndEscEvents"

export const Autocomplete = ({
  id,
  dropdownItems,
  onChange,
  onSelect,
}: _AutocompleteProps): JSX.Element => {
  const [menuVisibility, menuVisibilitySet] = useState(false)
  const [selected, selectedSet] = useState("")

  const autocompleteRef = useRef<HTMLInputElement>(null)

  const onClickHandler = (event: React.MouseEvent<HTMLInputElement>) => {
    selectedSet("")
    menuVisibilitySet(true)
  }

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value
    selectedSet(value)
    onChange(value, id)
  }

  const onSelectHandler = (event: React.MouseEvent<HTMLParagraphElement>) => {
    const value = (event.target as HTMLParagraphElement).innerHTML
    selectedSet(value)
    onSelect(value, id)
    menuVisibilitySet(false)
  }

  const clickOutsideHandler = (event: MouseEvent) => {
    /**
     * you don't know on which kind of node user clicked so use generic Node;
     * prevent triggering the event when user clicks on the Autocomplete component
     */
    if (!autocompleteRef.current?.contains(event.target as Node))
      menuVisibilitySet(false)
  }

  const escKeyHandler = (event: _KeyboardEvent) => {
    if (event.key === "Escape") menuVisibilitySet(false)
  }

  /**
   * use useEffect to catch click outside of the autocomplete and esc keydown
   * event to close the dropdown menu
   */
  useEffect(addOutsideClickAndEscEvents(clickOutsideHandler, escKeyHandler), [])

  return (
    <div id="root" className="relative text-stone-700" ref={autocompleteRef}>
      {/* inside div relative positioned to anchor the absolute positioned menu */}
      <input
        type="text"
        className="w-48 border px-3 py-2 focus:outline-none"
        onChange={onChangeHandler}
        onClick={onClickHandler}
        value={selected}
      />
      {/* absolute positioned 2rem from top of relative positioned parent */}
      <div
        id="dropdown"
        className={`${
          menuVisibility ? "" : "hidden"
        } absolute top-11 z-10 w-48 border bg-white py-1`}
      >
        {
          /**
           * filter the dropdownItems array to only include items that contain
           * the selected string. Then map over the filtered array to show the
           * filtered items in the dropdown menu.
           * even if dropdown items are already filtered before being passed to
           * the component as a prop, you are filtering them again here to make
           * sure that the dropdown menu is always in sync with the selected
           * string. There could be the case where the dropdown items are not
           * filtered before being passed to the component as a prop.
           */
          dropdownItems
            .filter((item) =>
              item.toLowerCase().includes(selected.toLowerCase())
            )
            .map((item, index) => {
              const menuColor =
                item === selected
                  ? "bg-teal-300 hover:bg-teal-400"
                  : "hover:bg-teal-100"

              return (
                <p
                  id="dropdown-item"
                  className={`${menuColor} px-3 py-2`}
                  onClick={(event) => onSelectHandler(event)}
                  key={index}
                >
                  {item}
                </p>
              )
            })
        }
      </div>
    </div>
  )
}
