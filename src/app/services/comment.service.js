import httpService from "./http.service"
const commentEndpoint = "comment/"

const commentService = {
    createComment: async (payload) => {
        const { data } = await httpService.put(
            commentEndpoint + payload._id,
            payload
        )
        return data
    },
    getComments: async (pageId) => {
        const { data } = await httpService.get(commentEndpoint, {
            params: {
                // eslint-disable-next-line quotes
                orderBy: '"pageId"',
                equalTo: `"${pageId}"`
            }
        })
        return data
    },
    removeComment: async (commentId) => {
        const { data } = await httpService.delete(commentEndpoint + commentId)
        console.log(data)
        return data
    }
}
export default commentService
