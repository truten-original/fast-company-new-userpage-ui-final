import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import UserCard from "../../ui/userCard"
import QualitiesCard from "../../ui/qualitiesCard"
import MeetingsCard from "../../ui/meetingsCard"
import Comments from "../../ui/comments"
import { useUser } from "../../../../hooks/useUsers"
import { CommentProvider } from "../../../../hooks/useComment"

const UserPage = ({ userId }) => {
    const { getUser } = useUser()
    const [user, setUser] = useState()
    useEffect(() => {
        ;(async () => {
            const content = await getUser(userId)
            setUser(content)
        })()
    }, [userId])

    if (user) {
        return (
            <div className="container">
                <div className="row gutters-sm">
                    <div className="col-md-4 mb-3">
                        <UserCard user={user} />
                        <QualitiesCard data={user.qualities} />
                        <MeetingsCard value={user.completedMeetings} />
                    </div>
                    <div className="col-md-8">
                        <CommentProvider>
                            <Comments />
                        </CommentProvider>
                    </div>
                </div>
            </div>
        )
    } else {
        return <h1>Loading</h1>
    }
}

UserPage.propTypes = {
    userId: PropTypes.string.isRequired
}

export default UserPage
