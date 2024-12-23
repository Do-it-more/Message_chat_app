import { LOGIN, LOGOUT, TOKEN } from "./actionType"

export const userLogin = (data) => {
    return {
        type: LOGIN,
        payload: {
            data
        }
    }
}

export const userLogout = () => {
    return {
        type: LOGOUT,
    }
}