export interface _AutocompleteProps {
  id: string
  dropdownItems: string[]
  onChange: (id: string, value: string) => void
  onSelect: (id: string, value: string) => void
}

export interface _KeyboardEvent extends KeyboardEvent {
  key: string
}
