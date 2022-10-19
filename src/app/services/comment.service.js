import httpService from "./http.service"

const commentEndpoint = "comment/"

const commentService = {
    createComment: async (data) => {
        const content = await httpService.put(commentEndpoint + data._id, data)
        const cont = content.data
        return cont
    },
    getComments: async (pageId) => {
        const { data } = await httpService.get(commentEndpoint, {
            params: {
                orderBy: `"pageId"`,
                equalTo: `"${pageId}"`
            }
        })
        return data
    },
    removeComment: async (id) => {
        const { data } = await httpService.delete(commentEndpoint + id)
        return data
    }
}
export default commentService
