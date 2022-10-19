import axios from "axios"
import { toast } from "react-toastify"
import configFile from "../config.json"
import { httpAuth } from "../../hooks/useAuth"
import localStorageService from "./localStorage.service"
const http = axios.create({
    baseURL: configFile.apiEndpoint
})

http.interceptors.request.use(
    async function (config) {
        if (configFile.fireBase) {
            const containSlash = /\/$/gi.test(config.url)
            config.url = containSlash
                ? config.url.slice(0, -1) + ".json"
                : config.url + ".json"
            const expiresDate = localStorageService.getExpiresKey()
            const refreshToken = localStorageService.getRefreshToken()
            if (refreshToken && expiresDate < Date.now()) {
                const { data } = await httpAuth.post("token", {
                    grant_type: "refresh_token",
                    refresh_token: refreshToken
                })
                console.log(data)
                console.log(config)
                localStorageService.setTokens({
                    refreshToken: data.refresh_token,
                    idToken: data.id_token,
                    expiresIn: data.expires_in,
                    localId: data.user_id
                })
            }
            const accessToken = localStorageService.getAccessToken()
            if (accessToken) {
                config.params = { ...config.params, auth: accessToken }
            }
        }

        return config
    },
    function (error) {
        Promise.reject(error)
    }
)
function transformData(data) {
    return data && !data._id
        ? Object.keys(data).map((key) => ({ ...data[key] }))
        : data
}
http.interceptors.response.use(
    (res) => {
        if (configFile.fireBase) {
            transformData(res.data)
            res.data = { content: transformData(res.data) }
        }
        return res
    },
    function (error) {
        const expectedErrors =
            error.response &&
            error.response.status >= 400 &&
            error.response.status < 500
        if (!expectedErrors) {
            console.log("unexpected error")
            toast.error("something was wrong. Try it later")
        }
        return Promise.reject(error)
    }
)

const httpService = {
    get: http.get,
    post: http.post,
    put: http.put,
    delete: http.delete
}

export default httpService
