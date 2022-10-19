const tokenKey = "jwt-token"
const refreshKey = "jwt-refresh-Token"
const expiresKey = "jwt-expires"
const userIdKey = "user-local-id"
const setTokens = ({ refreshToken, idToken, localId, expiresIn = 3600 }) => {
    const expiresDate = new Date().getTime() + expiresIn * 1000
    localStorage.setItem(userIdKey, localId)
    localStorage.setItem(tokenKey, idToken)
    localStorage.setItem(refreshKey, refreshToken)
    localStorage.setItem(expiresKey, expiresDate)
}
const removeAuthData = () => {
    localStorage.removeItem(userIdKey)
    localStorage.removeItem(tokenKey)
    localStorage.removeItem(refreshKey)
    localStorage.removeItem(expiresKey)
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
const getUserId = () => {
    return localStorage.getItem(userIdKey)
}
const localStorageService = {
    setTokens,
    getAccessToken,
    getRefreshToken,
    getExpiresKey,
    getUserId,
    removeAuthData
}
export default localStorageService
