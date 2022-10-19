import React, { useContext, useState, useEffect } from "react"
import Proptypes from "prop-types"
import axios from "axios"
import userService from "../app/services/users.service"
import { toast } from "react-toastify"
import localStorageService from "../app/services/localStorage.service"
import { useHistory } from "react-router-dom"
const AuthContext = React.createContext()
export const httpAuth = axios.create({
    baseURL: "https://identitytoolkit.googleapis.com/v1/",
    params: {
        key: process.env.REACT_APP_FIREBASE_KEY
    }
})
export const useAuth = () => useContext(AuthContext)

const AuthProvider = ({ children }) => {
    const history = useHistory()
    const [error, setError] = useState(null)
    const [currentUser, setCurrentUser] = useState()
    const [isLoading, setisLoading] = useState(true)
    useEffect(() => {
        if (error) {
            toast.error(error)
            setError(null)
        }
    }, [error])
    async function getUserData() {
        try {
            const { content } = await userService.getCurrentUSer()
            setCurrentUser(content)
        } catch (error) {
            errorCatcher(error)
        } finally {
            setisLoading(false)
        }
    }
    useEffect(() => {
        if (localStorageService.getAccessToken()) {
            getUserData()
        } else {
            setisLoading(false)
        }
    }, [])

    function errorCatcher(error) {
        const { message } = error.response.data
        setError(message)
    }
    const createUser = async (data) => {
        try {
            const { content } = await userService.create(data)
            setCurrentUser(content)
        } catch (error) {
            errorCatcher(error)
        }
    }
    const randomInt = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
    const updateUser = async (data) => {
        try {
            const resp = await userService.create(data)
            await getUserData()
            return resp
        } catch (error) {
            errorCatcher(error)
        }
    }
    const signUp = async ({ email, password, ...rest }) => {
        const url = `accounts:signUp`

        try {
            const { data } = await httpAuth.post(url, {
                email,
                password,
                returnSecureToken: true
            })
            localStorageService.setTokens(data)
            await createUser({
                _id: data.localId,
                email,
                rate: randomInt(1, 5),
                completedMeetings: randomInt(0, 200),
                image: `https://avatars.dicebear.com/api/avataaars/${(
                    Math.random() + 1
                )
                    .toString(36)
                    .substring(7)}.svg`,
                ...rest
            })
        } catch (error) {
            errorCatcher(error)
            const { code, message } = error.response.data.error
            if (code === 400) {
                if (message === "EMAIL_EXISTS") {
                    const errorObject = {
                        email: "Пользователь с таким email уже существует"
                    }
                    throw errorObject
                }
            }
        }
    }
    const signIn = async ({ email, password }) => {
        const url = `accounts:signInWithPassword`
        try {
            const { data } = await httpAuth.post(url, {
                email,
                password,
                returnSecureToken: true
            })
            localStorageService.setTokens(data)
            await getUserData()
        } catch (error) {
            errorCatcher(error)
            const { code, message } = error.response.data.error
            if (code === 400) {
                if (message === "EMAIL_NOT_FOUND") {
                    const errorObject = {
                        email: "неверный email или пароль"
                    }
                    throw errorObject
                }
                if (message === "INVALID_PASSWORD") {
                    const errorObject = {
                        password: "неверный email или пароль"
                    }
                    throw errorObject
                }
            }
        }
    }
    const logOut = () => {
        setCurrentUser(null)
        localStorageService.removeAuthData()
        history.push("/")
    }
    return (
        <AuthContext.Provider
            value={{ signUp, currentUser, signIn, logOut, updateUser }}
        >
            {!isLoading ? children : "loading..."}
        </AuthContext.Provider>
    )
}

export default AuthProvider

AuthProvider.propTypes = {
    children: Proptypes.oneOfType([
        Proptypes.node,
        Proptypes.arrayOf(Proptypes.node)
    ])
}
