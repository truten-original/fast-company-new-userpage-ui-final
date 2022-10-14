import React, { useContext, useState, useEffect } from "react"
import Proptypes from "prop-types"
import axios from "axios"
import userService from "../app/services/users.service"
import { toast } from "react-toastify"
import localStorageService from "../app/services/localStorage.service"
const AuthContext = React.createContext()
const httpAuth = axios.create({})
export const useAuth = () => useContext(AuthContext)
const keyFireBasePrivate = process.env.REACT_APP_FIREBASE_KEY

const AuthProvider = ({ children }) => {
    const [error, setError] = useState(null)
    const [currentUser, setCurrentUSer] = useState({})
    useEffect(() => {
        if (error) {
            toast.error(error)
            setError(null)
        }
    }, [error])

    function errorCatcher(error) {
        const { message } = error.response.data
        setError(message)
    }
    const createUser = async (data) => {
        try {
            const { content } = await userService.create(data)
            setCurrentUSer(content)
        } catch (error) {
            errorCatcher(error)
        }
    }
    const signUp = async ({ email, password, ...rest }) => {
        const url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${keyFireBasePrivate}`
        try {
            const { data } = await httpAuth.post(url, {
                email,
                password,
                returnSecureToken: true
            })
            await createUser({ _id: data.localId, email, ...rest })
            localStorageService.setTokens(data)
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
        const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${keyFireBasePrivate}`
        try {
            const { data } = await httpAuth.post(url, {
                email,
                password,
                returnSecureToken: true
            })
            localStorageService.setTokens(data)
        } catch (error) {
            errorCatcher(error)
            const { code, message } = error.response.data.error
            if (code === 400) {
                if (message === "EMAIL_NOT_FOUND") {
                    const errorObject = {
                        email: "Пользователя с таким email не существует"
                    }
                    throw errorObject
                }
                if (message === "INVALID_PASSWORD") {
                    const errorObject = {
                        password: "неверный пароль"
                    }
                    throw errorObject
                }
            }
        }
    }
    return (
        <AuthContext.Provider value={{ signUp, currentUser, signIn }}>
            {children}
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
