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
    function errorCatcher(error) {
        const { message } = error.response.data
        setError(message)
        setIsloading(false)
    }
    return (
        <UserContext.Provider value={{ users }}>
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
