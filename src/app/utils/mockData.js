import { useEffect, useState } from "react"
import professions from "../mockData/professions.json"
import qualities from "../mockData/qualities.json"
import users from "../mockData/users.json"
import httpService from "../services/http.service"

const useMockData = () => {
    const statusConsts = {
        idle: "Not Started",
        pending: "In Process",
        succes: "Ready",
        error: "Error occured"
    }
    const [error, setError] = useState(null)
    const [status, setStatus] = useState(statusConsts.idle)
    const [progress, setProgress] = useState(0)
    const [count, setCount] = useState(0)
    const summuryCount = professions.length + qualities.length + users.length
    const incrementCount = () => {
        setCount((prev) => prev + 1)
    }
    const updateProgress = () => {
        if (count !== 0 && statusConsts.idle) {
            setStatus(statusConsts.pending)
        }
        const newProgress = Math.floor((count / summuryCount) * 100)
        if (progress < newProgress) {
            setProgress(() => newProgress)
        }
        if (newProgress === 100) {
            setStatus(statusConsts.succes)
        }
    }
    useEffect(() => {
        updateProgress()
    }, [count])
    async function initialize() {
        try {
            for (const prof of professions) {
                await httpService.put("profession/" + prof._id, prof)
                incrementCount()
            }
            for (const qual of qualities) {
                await httpService.put("quality/" + qual._id, qual)
                incrementCount()
            }
            for (const user of users) {
                await httpService.put("user/" + user._id, user)
                incrementCount()
            }
        } catch (error) {
            setError(error)
            setStatus(statusConsts.error)
        }
    }
    return { error, initialize, status, progress }
}

export default useMockData
