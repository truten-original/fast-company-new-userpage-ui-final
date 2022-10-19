import Proptypes from "prop-types"
import React, { useContext, useState, useEffect } from "react"
import { toast } from "react-toastify"
import professionService from "../app/services/profession.service"

const ProfessionContext = React.createContext()
export const useProfession = () => {
    return useContext(ProfessionContext)
}
export const ProfessionProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true)
    const [professions, setProfessions] = useState([])
    const [error, setError] = useState(null)
    useEffect(() => {
        getProfessions()
    }, [])
    useEffect(() => {
        if (error) {
            toast.error(error)
            setError(null)
        }
    }, [error])
    async function getProfessions() {
        try {
            const { content } = await professionService.get()
            setProfessions(content)
            setIsLoading(false)
        } catch (error) {
            errorCatcher(error)
        }
    }
    function errorCatcher(error) {
        const { message } = error.response.data
        setError(message)
        setIsLoading(false)
    }
    function getProfession(id) {
        return professions.find((item) => item._id === id)
    }
    return (
        <ProfessionContext.Provider
            value={{ professions, getProfession, isLoading }}
        >
            {isLoading ? "loading..." : children}
        </ProfessionContext.Provider>
    )
}

ProfessionProvider.propTypes = {
    children: Proptypes.oneOfType([
        Proptypes.node,
        Proptypes.arrayOf(Proptypes.node)
    ])
}
