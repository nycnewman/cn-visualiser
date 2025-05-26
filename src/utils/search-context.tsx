import React from 'react'

// export interface UserContract {
//     id?: number
//     username?: string
//     firstName?: string
//     email?: string
// }
//
// // The dummy user object used for this example
// export const DummyUser: UserContract = {
//     id: 1,
//     username: 'MyUserName',
//     firstName: 'John',
//     email: 'john@doe.com',
// }

/**
 * Application state interface
 */
export interface AppState {
    recordDate?: Date | null
    updateState: (newState: Partial<AppState>) => void
}

/**
 * Default application state
 */
const defaultState: AppState = {
    recordDate: new Date("2024-06-24T21:08:34.404896Z"),
    // @ts-ignore:
    updateState: (newState?: Partial<AppState>) => {},
}

/**
 * Creating the Application state context for the provider
 */
export const RecordDateContext = React.createContext<AppState>(defaultState)