import type { _KeyboardEvent } from "../types"

export const addOutsideClickAndEscEvents = (
  // 1)
  clickOutsideHandler: (event: MouseEvent) => void,
  escKeyHandler: (event: _KeyboardEvent) => void
) => {
  if (typeof document !== "undefined") {
    /**
     * Add an event listener for a click event on the entire document. Whenever
     * a click happens,the function 'clickOutsideHandler' will be executed.
     * The 'true' parameter means that the event is captured during the
     * "capture phase", which is the first phase of the event flow.
     */
    document.addEventListener("click", clickOutsideHandler, true)
    /**
     * Add a keydown event listener for the document. 'escKeyHandler' will be
     * executed when a key is pressed.
     */
    document.addEventListener(
      // 2)
      "keydown",
      escKeyHandler as unknown as EventListener
    )
    /**
     * The function returned by useEffect is a clean-up function that is
     * executed when the component unmounts to clean the even listener.
     * The clean-up function is removing the event listeners that were added when
     * the component mounted. This is to prevent memory leaks and unwanted
     * behavior. If these listeners were not removed, they would continue to
     * exist and be active even after the component is unmounted.
     */
    return () => {
      document.removeEventListener("click", clickOutsideHandler, true)
      document.removeEventListener(
        "keydown",
        escKeyHandler as unknown as EventListener
      )
    }
  }
  return () => {}
}

/**
 * 1)
 * first argument of useEffect expects a function, and by calling _closeDropdown
 * and passing the necessary arguments, you are providing a function reference
 * to useEffect. Essentially, you are executing the _closeDropdown function
 * immediately and passing its return value (which is the cleanup function) to
 * useEffect.
 *
 * By doing this, you are achieving the same behavior as passing a function to
 * useEffect, where the event listeners are added when the component mounts and
 * removed when the component unmounts. The only difference is that the code
 * organizing the event listeners is moved outside of useEffect and encapsulated
 * in the _closeDropdown function.
 *
 * you have created a closure with the _closeDropdown function. A closure is a
 * function bundled together with its lexical environment (variables, functions,
 * etc.) at the time of its creation. In this case, the closure includes the
 * clickOutsideHandler and escKeyHandler functions that are passed as arguments
 * to _closeDropdown.
 *
 * By calling _closeDropdown and passing the necessary arguments
 * (clickOutsideHandler and escKeyHandler), you create a closure where those
 * arguments are captured and stored within the returned cleanup function. This
 * allows the cleanup function to access and use the clickOutsideHandler and
 * escKeyHandler functions even after _closeDropdown has finished executing.
 *
 * In essence, the closure preserves the references to clickOutsideHandler and
 * escKeyHandler within the returned cleanup function, ensuring that the correct
 * event listeners are removed when the component unmounts.
 */

/**
 * 2)
 * The reason you need to use `escKeyHandler as unknown as EventListener` when
 * adding the event listener for the "keydown" event is due to a type
 * compatibility issue between the function signature of `escKeyHandler` and the
 * expected function signature for the event listener.
 *
 * In TypeScript, event listeners are expected to have a specific function
 * signature that matches the `EventListener` type. The `EventListener` type
 * specifies that the function should take an `Event` object as its parameter.
 *
 * However, in your code, `escKeyHandler` has a more specific function signature
 * that extends `KeyboardEvent` and adds the `key` property. This means that the
 * type of `escKeyHandler` is not compatible with the expected `EventListener`
 * function signature.
 *
 * To workaround this type incompatibility, you can use the type assertion syntax
 * `(escKeyHandler as unknown as EventListener)` to explicitly cast `escKeyHandler`
 * to the `EventListener` type. This tells TypeScript to treat `escKeyHandler` as
 * an `EventListener` and allows you to add it as the event listener for the
 * "keydown" event.
 *
 * On the other hand, you don't need to use the type assertion when adding the
 * event listener for the "click" event because the function signature of
 * `clickOutsideHandler` matches the expected `EventListener` type. Therefore,
 * TypeScript recognizes `clickOutsideHandler` as a valid event listener without
 * the need for a type assertion.
 */
