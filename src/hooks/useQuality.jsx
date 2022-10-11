import React, { useContext, useState, useEffect } from "react"
import qualityService from "../app/services/quality.service"
import Proptypes from "prop-types"
import { toast } from "react-toastify"
const QualityContext = React.createContext()
export const useQualityContext = () => useContext(QualityContext)
export const QualityProvider = ({ children }) => {
    const [quals, setQuals] = useState([])
    const [error, setError] = useState(null)
    const [isLoadingQual, setisLoadingQual] = useState(true)
    useEffect(() => {
        toast.error(error)
        setError(null)
    }, [error])
    useEffect(() => {
        getQualities()
    }, [])
    async function getQualities() {
        try {
            const { content } = await qualityService.get()
            setQuals(content)
            setisLoadingQual(false)
        } catch (error) {
            const { message } = error.response.message
            setError(message)
            setisLoadingQual(false)
        }
    }
    function getQual(id) {
        return quals.find((item) => item._id === id)
    }
    return (
        <QualityContext.Provider value={{ quals, getQual, isLoadingQual }}>
            {children}
        </QualityContext.Provider>
    )
}
QualityProvider.propTypes = {
    children: Proptypes.oneOfType([
        Proptypes.node,
        Proptypes.arrayOf(Proptypes.node)
    ])
}
