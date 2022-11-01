import { orderBy } from "lodash"
import React, { useEffect } from "react"
import CommentsList, { AddCommentForm } from "../common/comments"
import { useDispatch, useSelector } from "react-redux"
import {
    createComment,
    getComments,
    getCommentsLoadingStatus,
    loadCommentsList,
    removeComent
} from "../../store/comments"
import { useParams } from "react-router-dom"
import { getCurrentUserId } from "../../store/users"
import { nanoid } from "nanoid"

const Comments = () => {
    const { userId } = useParams()
    const currentUserId = useSelector(getCurrentUserId())
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(loadCommentsList(userId))
    }, [userId])
    const isLoading = useSelector(getCommentsLoadingStatus())
    const comments = useSelector(getComments())
    // const { createComment, removeComment } = useComments()

    const handleSubmit = (data) => {
        const comment = {
            ...data,
            _id: nanoid(),
            pageId: userId,
            created_at: Date.now(),
            userId: currentUserId
        }
        dispatch(createComment(comment))
        // api.comments
        //     .add({ ...data, pageId: userId })
        //     .then((data) => setComments([...comments, data]));
    }
    const handleRemoveComment = (id) => {
        dispatch(removeComent(id))
        // api.comments.remove(id).then((id) => {
        //     setComments(comments.filter((x) => x._id !== id));
        // });
    }
    const sortedComments = orderBy(comments, ["created_at"], ["desc"])
    return (
        <>
            <div className="card mb-2">
                {" "}
                <div className="card-body ">
                    <AddCommentForm onSubmit={handleSubmit} />
                </div>
            </div>
            {sortedComments.length > 0 && (
                <div className="card mb-3">
                    <div className="card-body ">
                        <h2>Comments</h2>
                        <hr />

                        {!isLoading ? (
                            <CommentsList
                                comments={sortedComments}
                                onRemove={handleRemoveComment}
                            />
                        ) : (
                            "Loading"
                        )}
                    </div>
                </div>
            )}
        </>
    )
}

export default Comments
