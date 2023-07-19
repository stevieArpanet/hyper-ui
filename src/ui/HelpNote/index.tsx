import type { _HelpNoteProps } from "./types"

export const HelpNote = ({ children, show }: _HelpNoteProps): JSX.Element => {
  return (
    <div
      className={`${
        show ? "hidden" : ""
      } relative top-2 z-10 h-40 w-[296px] border border-gray-300 bg-white p-2 text-xs text-stone-500 shadow-sm`}
    >
      <div className="flex h-full flex-col justify-center">
        <div className="flex justify-between">{children}</div>
      </div>
    </div>
  )
}
