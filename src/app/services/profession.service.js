import httpService from "./http.service"

const userEndpoint = "profession/"

const professionService = {
    get: async () => {
        const { data } = await httpService.get(userEndpoint)
        return data
    }
}
export default professionService
