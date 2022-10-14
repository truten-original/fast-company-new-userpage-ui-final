import React from "react"
import useMockData from "../utils/mockData"

const Main = () => {
    const { error, initialize, status, progress } = useMockData()
    const handleClick = () => {
        initialize()
    }
    return (
        <div className="container mt-5">
            <h1> Main Page</h1>
            <h3>Инициализация данных в fireBase</h3>
            <ul>
                <li>status: {status} </li>
                <li>progress: {progress}%</li>
                {error && <li>error: {error}</li>}
            </ul>
            <button className="btn btn-primary" onClick={handleClick}>
                инициализировать
            </button>
        </div>
    )
}

export default Main
