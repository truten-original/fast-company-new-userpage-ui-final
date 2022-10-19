import React, { useContext, useState, useEffect } from "react"
import Proptypes from "prop-types"
import userService from "../app/services/users.service"
import { toast } from "react-toastify"
const UserContext = React.createContext()

export const useUser = () => {
    return useContext(UserContext)
}

const UserProvider = ({ children }) => {
    const [users, setUsers] = useState([])
    const [isLoading, setIsloading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        getUsers()
    }, [])
    useEffect(() => {
        if (error) {
            toast.error(error)
            setError(null)
        }
    }, [error])

    async function getUsers() {
        try {
            const { content } = await userService.get()
            setUsers(content)
            setIsloading(false)
        } catch (error) {
            errorCatcher(error)
        }
    }
    async function getUser(id) {
        const { content } = await userService.getUser(id)
        return content
    }

    function errorCatcher(error) {
        const { message } = error.response
        setError(message)
        setIsloading(false)
    }
    return (
        <UserContext.Provider value={{ users, getUser }}>
            {isLoading ? "loading..." : children}
        </UserContext.Provider>
    )
}
export default UserProvider
UserProvider.propTypes = {
    children: Proptypes.oneOfType([
        Proptypes.node,
        Proptypes.arrayOf(Proptypes.node)
    ])
}
