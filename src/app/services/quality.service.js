import httpService from "./http.service"

const userEndpoint = "quality/"

const qualityService = {
    get: async () => {
        const { data } = await httpService.get(userEndpoint)
        return data
    }
}
export default qualityService
