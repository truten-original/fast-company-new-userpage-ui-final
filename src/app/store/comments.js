import { createAction, createSlice } from "@reduxjs/toolkit"
import commentService from "../services/comment.service"

const commentsSlice = createSlice({
    name: "comments",
    initialState: {
        entities: null,
        isLoading: true,
        error: null
    },
    reducers: {
        commentsRequested: (state) => {
            state.isLoading = true
        },
        commentsReceived: (state, action) => {
            state.entities = action.payload
            state.lastFetch = Date.now()
            state.isLoading = false
        },
        commentsRequestFailed: (state, action) => {
            state.error = action.payload
            state.isLoading = false
        },
        commentCreatedSucces: (state, { payload }) => {
            if (!Array.isArray(state.entities)) {
                state.entities = []
            }
            state.entities.push(payload)
        },
        commentRemovedSucces: (state, { payload }) => {
            state.entities = state.entities.filter((com) => com._id !== payload)
        }
    }
})

const { reducer: commentsReducer, actions } = commentsSlice
const {
    commentsRequested,
    commentsReceived,
    commentsRequestFailed,
    commentCreatedSucces,
    commentRemovedSucces
} = actions

const commentCreateRequest = createAction("comments/commentCreateRequest")
const commentCreateRequestFailed = createAction(
    "comments/commentCreateRequestFailed"
)
const commentRemoveRequestFailed = createAction(
    "comments/commentRemoveRequestFailed"
)
const commentRemoveRequest = createAction("comments/commentRemoveRequest")

export const loadCommentsList = (userId) => async (dispatch) => {
    dispatch(commentsRequested())
    try {
        const { content } = await commentService.getComments(userId)
        dispatch(commentsReceived(content))
    } catch (error) {
        dispatch(commentsRequestFailed(error.message))
    }
}
export const createComment = (comment) => async (dispatch) => {
    dispatch(commentCreateRequest())
    try {
        const { content } = await commentService.createComment(comment)
        console.log(content)
        dispatch(commentCreatedSucces(content))
    } catch (error) {
        dispatch(commentCreateRequestFailed(error.message))
    }
}
export const removeComent = (payload) => async (dispatch) => {
    dispatch(commentRemoveRequest())
    try {
        const { content } = await commentService.removeComment(payload)
        console.log(payload)
        console.log(content)
        if (content === null) {
            dispatch(commentRemovedSucces(payload))
        }
    } catch (error) {
        dispatch(commentRemoveRequestFailed(error.message))
    }
}
export const getComments = () => (state) => state.comments.entities
export const getCommentsLoadingStatus = () => (state) =>
    state.comments.isLoading
export default commentsReducer
