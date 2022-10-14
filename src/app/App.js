import React from "react"
import { Route, Switch, Redirect } from "react-router-dom"

import Users from "./layouts/users"
import Login from "./layouts/login"
import Main from "./layouts/main"
import NavBar from "./components/ui/navBar"
import { ToastContainer } from "react-toastify"
import { ProfessionProvider } from "../hooks/useProfession"
import { QualityProvider } from "../hooks/useQuality"
import AuthProvider from "../hooks/useAuth"

function App() {
    return (
        <div>
            <AuthProvider>
            <NavBar />
            <Switch>
                <ProfessionProvider>
                    <QualityProvider>
                        <Route
                            path="/users/:userId?/:edit?"
                            component={Users}
                        />
                        <Route path="/login/:type?" component={Login} />
                    </QualityProvider>
                    <Route path="/" exact component={Main} />
                    <Redirect to="/" />
                </ProfessionProvider>
            </Switch>
            </AuthProvider>
            <ToastContainer />
        </div>
    )
}

export default App
