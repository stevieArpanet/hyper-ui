import type { _HelpIconProps } from "./types"

export const HelpIcon = ({
  onMouseEnterAndLeave,
}: _HelpIconProps): JSX.Element => {
  return (
    <div
      id="icon"
      className="ml-1 flex h-4 w-4 items-center justify-center rounded-full border border-gray-300 bg-gray-200"
      onMouseEnter={() => onMouseEnterAndLeave(true)}
      onMouseLeave={() => onMouseEnterAndLeave(false)}
    >
      <span id="text" className="text-xs text-gray-500">
        ?
      </span>
    </div>
  )
}
