import {PropsWithChildren, useContext} from 'react'
import {createContext} from 'react'

type MultiSelectContextValue = {
  selected: string[]
  toggleSelected: (key: string) => void
  selectAll: (keys: string[]) => void
}

const MultiSelectContext = createContext<MultiSelectContextValue>({
  selected: [],
  toggleSelected: () => null,
  selectAll: () => null,
})

export function useMultiSelectContext() {
  const current = useContext(MultiSelectContext)

  return current
}

type MultiSelectProviderProps = PropsWithChildren & MultiSelectContextValue

export function MultiSelectProvider(props: MultiSelectProviderProps) {
  const {selected, toggleSelected, selectAll, children} = props

  return (
    <MultiSelectContext.Provider value={{selected, toggleSelected, selectAll}}>
      {children}
    </MultiSelectContext.Provider>
  )
}
