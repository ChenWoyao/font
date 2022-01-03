import { useContext, useReducer } from 'react'
import { createStore, createReducer } from './redux.helper'

const initStore = {
    userInfo: {
        name: 'woyao'
    },
    token: '',
}

export const Store = createStore(initStore)

const reducer = createReducer(initStore, function () {
    return {
        ["UPDATE_USER_INFO"](state, action) {
            return {
                ...state,
                userInfo: action.payload
            }
        }
    }
})

export const useReduxHook = () => useReducer(reducer, useContext(Store))
