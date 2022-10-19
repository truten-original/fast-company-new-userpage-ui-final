import Proptypes from "prop-types"
import React, { useContext, useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { useAuth } from "./useAuth"
import { nanoid } from "nanoid"
import commentService from "../app/services/comment.service"
import { toast } from "react-toastify"
const CommentContext = React.createContext()
export const useComment = () => {
    return useContext(CommentContext)
}
export const CommentProvider = ({ children }) => {
    const { userId } = useParams()
    const { currentUser } = useAuth()
    const [isLoading, setIsLoading] = useState(true)
    const [comments, setComments] = useState([])
    const [error, setError] = useState(null)
    useEffect(() => {
        if (error) {
            toast.error(error)
            setError(null)
        }
    }, [error])
    useEffect(() => {
        setIsLoading(true)
        getComments()
    }, [userId])
    function errorCatcher(error) {
        const { message } = error.response.data
        setError(message)
    }

    async function getComments() {
        try {
            const { content } = await commentService.getComments(userId)
            setComments(content)
        } catch (error) {
            errorCatcher(error)
        } finally {
            setIsLoading(false)
        }
    }
    async function removeComment(id) {
        try {
            const { content } = await commentService.removeComment(id)
            setComments((prevState) =>
                prevState.filter((item) => item._id !== id)
            )
        } catch (error) {
            errorCatcher(error)
        }
    }
    async function createComment(data) {
        const comment = {
            ...data,
            pageId: userId,
            created_at: Date.now(),
            userId: currentUser._id,
            _id: nanoid()
        }
        try {
            await commentService.createComment(comment)
            getComments()
        } catch (error) {
            errorCatcher(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <CommentContext.Provider
            value={{ comments, createComment, isLoading, removeComment }}
        >
            {children}
        </CommentContext.Provider>
    )
}

CommentProvider.propTypes = {
    children: Proptypes.oneOfType([
        Proptypes.node,
        Proptypes.arrayOf(Proptypes.node)
    ])
}
