import { useState, useMemo } from 'react'
import set from 'lodash.set'
import unset from 'lodash.unset'
import cloneDeep from 'lodash.clonedeep'
import { useLocalStorage } from './useLocalStorage'
import { defaultGist as baseGist } from 'shared/components/workbench/gist.mjs'

// Generates a default design gist to start from
export const defaultGist = (design, locale = 'en') => {
  const gist = {
    design,
    ...baseGist,
    _state: { view: 'draft' },
  }
  if (locale) gist.locale = locale

  return gist
}

// generate the gist state and its handlers
export function useGist(design, locale) {
  // memoize the initial gist for this design so that it doesn't change between renders and cause an infinite loop
  const initialGist = useMemo(() => defaultGist(design, locale), [design, locale])

  // get the localstorage state and setter
  const [gist, _setGist, gistReady] = useLocalStorage(`${design}_gist`, initialGist)
  const [gistHistory, setGistHistory] = useState([])
  const [gistFuture, setGistFuture] = useState([])

  const setGist = (newGist, addToHistory = true) => {
    let oldGist
    _setGist((gistState) => {
      // have to clone it or nested objects will be referenced instead of copied, which defeats the purpose
      if (addToHistory) oldGist = cloneDeep(gistState)

      return typeof newGist === 'function' ? newGist(cloneDeep(gistState)) : newGist
    })

    if (addToHistory) {
      setGistHistory((history) => {
        return [...history, oldGist]
      })
      setGistFuture([])
    }
  }

  /** update a single gist value */
  const updateGist = (path, value, addToHistory = true) => {
    setGist((gistState) => {
      const newGist = { ...gistState }
      set(newGist, path, value)
      return newGist
    }, addToHistory)
  }

  /** unset a single gist value */
  const unsetGist = (path, addToHistory = true) => {
    setGist((gistState) => {
      const newGist = { ...gistState }
      unset(newGist, path)
      return newGist
    }, addToHistory)
  }

  const undoGist = () => {
    _setGist((gistState) => {
      let prevGist
      setGistHistory((history) => {
        const newHistory = [...history]
        prevGist = newHistory.pop() || defaultGist(design, locale)
        return newHistory
      })
      setGistFuture((future) => [gistState, ...future])

      return { ...prevGist }
    })
  }

  const redoGist = () => {
    const newHistory = [...gistHistory, gist]
    const newFuture = [...gistFuture]
    const newGist = newFuture.shift()
    setGistHistory(newHistory)
    setGistFuture(newFuture)
    _setGist(newGist)
  }

  const resetGist = () => setGist(defaultGist(design, locale))

  return { gist, setGist, unsetGist, gistReady, updateGist, undoGist, redoGist, resetGist }
}
