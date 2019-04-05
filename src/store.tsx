import React, { createContext, useReducer, useEffect } from 'react'

// NOTE: WIP global app store

// Initial app state
const initialState: any = {
  errors: null,
  account: null,
  balance: 123
}

export const StoreContext = createContext([initialState])

// It changes the app state via an action
function reducer(state: any, action: any) {
  // NOTE: remove :
  switch (action.type) {
    case 'balance':
    // (async () => {
    //   let  b = await getBalance()
    //   console.log('dai cazzo ', b)

    // })()
    case 'fetchDemo':
    fetch('https://jsonplaceholder.typicode.com/todos/1')
      .then(res => {
        res.json()
      }).then(data => {
        
        console.log('data', data)
        return { ...state }
      })
    
    case 'login':
      login()
      // console.log('cc')
      return { ...state, account: { id: action.payload } }
    case 'logout':
      return { ...state, account: null }
    default:
      throw new Error('Missed action')
  }
}

const Store = ({ children }: any) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  // const [account, login, logout] = useScatter() // Appname


  return (
    <StoreContext.Provider value={[state, dispatch]} >
      {children}
    </StoreContext.Provider>
  )
}

export default Store