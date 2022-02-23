import { createContext, useReducer } from 'react'

export const UserContext = createContext();

const initialState = {
    isLogin: false,
    user: {}
}

const reducer = (state, action) => {
    const { type, payload } = action

    switch (type) {
        // case "USER_SUCCESS" here ...
        case 'USER_SUCCESS':
        case 'LOGIN_SUCCESS':
            // Set item token to localStorage here ...
            localStorage.setItem('token', payload.token);
            return {
                isLogin: true,
                user: payload,
            };
        // case "AUTH_ERROR" here ...
        case 'AUTH_ERROR':
        case 'LOGOUT':
            // Remove item token from localStorage here ...
            localStorage.removeItem('token');
            return {
                isLogin: false,
                user: {},
            };
        default:
            throw new Error();
    }
}

export const UserContextProvider = ({ children }) => {

    const [state, dispatch] = useReducer(reducer, initialState)

    return (
        <UserContext.Provider value={[state, dispatch]}>
            {children}
        </UserContext.Provider>
    )

}