import { Dispatch, useReducer } from "react"

import type { _CalendarHookState, _CalendarHookAction } from "./types"

import { getCurrentMonth, getCurrentYear } from "./helpers"

export const useCalendar = (): [
  _CalendarHookState,
  Dispatch<_CalendarHookAction>
] => {
  const defaultState = {
    month: getCurrentMonth(),
    year: getCurrentYear(),
  }

  const reducer = (state: _CalendarHookState, action: _CalendarHookAction) => {
    switch (action) {
      case "backwardYear":
        return _backwardYear(state)
      case "backwardMonth":
        return _backwardMonth(state)
      case "forwardMonth":
        return _forwardMonth(state)
      case "forwardYear":
        return _forwardYear(state)
      case "reset":
        return defaultState
      default: {
        return state
      }
    }
  }

  /**
   * the reducer return this tuple:
   * [_CalendarHookState, Dispatch<_CalendarHookAction>]
   */
  return useReducer(reducer, defaultState)
}

function _backwardYear(state: _CalendarHookState) {
  const updatedYear = state.year <= 1900 ? (state.year = 1900) : state.year - 1
  return { ...state, year: updatedYear }
}
function _backwardMonth(state: _CalendarHookState) {
  let updatedMonth, updatedYear

  if (state.month === 1) {
    updatedMonth = 12
    updatedYear = state.year - 1
  } else {
    updatedMonth = state.month - 1
    updatedYear = state.year
  }

  return { ...state, month: updatedMonth, year: updatedYear }
}
function _forwardMonth(state: _CalendarHookState) {
  let updatedMonth, updatedYear

  if (state.month === 12) {
    updatedMonth = 1
    updatedYear = state.year + 1
  } else {
    updatedMonth = state.month + 1
    updatedYear = state.year
  }

  return { ...state, month: updatedMonth, year: updatedYear }
}
function _forwardYear(state: _CalendarHookState) {
  const updatedYear = state.year >= 2100 ? (state.year = 2100) : state.year + 1
  return { ...state, year: updatedYear }
}
