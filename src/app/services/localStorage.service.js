const tokenKey = "jwt-token"
const refreshKey = "jwt-refresh-Token"
const expiresKey = "jwt-expires"

const setTokens = ({ refreshToken, idToken, expiresIn = 3600 }) => {
    const expiresDate = new Date().getTime() + expiresIn * 1000
    localStorage.setItem(tokenKey, idToken)
    localStorage.setItem(refreshKey, refreshToken)
    localStorage.setItem(expiresKey, expiresDate)
}
const getAccessToken = () => {
    return localStorage.getItem(tokenKey)
}
const getRefreshToken = () => {
    return localStorage.getItem(refreshKey)
}
const getExpiresKey = () => {
    return localStorage.getItem(expiresKey)
}
const localStorageService = {
    setTokens,
    getAccessToken,
    getRefreshToken,
    getExpiresKey
}
export default localStorageService
