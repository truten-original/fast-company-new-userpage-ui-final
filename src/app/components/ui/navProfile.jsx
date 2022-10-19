import React, { useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../../../hooks/useAuth"

const NavProfile = () => {
    const { currentUser } = useAuth()
    const [open, setOpen] = useState(false)
    const openMenu = () => {
        setOpen((prev) => !prev)
    }
    return (
        <div className="dropdown" onClick={openMenu}>
            <div className="btn dropdown-toggle d-flex aligm-utems-center">
                <div className="mb-2">{currentUser.name}</div>
                <img src={currentUser.image} />
            </div>
            <div className={"w-100 dropdown-menu" + (open ? "show" : "")}>
                <Link
                    to={`/users/${currentUser._id}`}
                    className="dropdown-item"
                >
                    Profile
                </Link>
                <Link to={`/logout`} className="dropdown-item">
                    Log out
                </Link>
                <h1>some text</h1>
            </div>
        </div>
    )
}

export default NavProfile
