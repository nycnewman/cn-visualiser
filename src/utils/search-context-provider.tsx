// FILE - ./src/app-context/user-context-provider.tsx
// ----------------------------------

import React, { useState } from 'react'
import { RecordDateContext } from './search-context'
import type { AppState } from './search-context'

interface Props {
    children: React.ReactNode
}

/**
 * The main context provider
 */
export const RecordDateProvider: React.FunctionComponent<Props> = (props: Props): React.ReactElement => {
    /**
     * Using react hooks, set the default state
     */
    const [state, setState] = useState({recordDate: new Date("2024-06-24T00:00:00.000000Z")})

    /**
     * Declare the update state method that will handle the state values
     */
    const updateState = (newState: Partial<AppState>) => {
        if (newState.recordDate ) {
            setState({ recordDate: newState.recordDate });
        }
    }

    /**
     * Context wrapper that will provider the state values to all its children nodes
     */
    return (
        <RecordDateContext.Provider
            value={{ ...state, updateState }}>
            {props.children}
        </RecordDateContext.Provider>
    )
}