import React from "react"
import { Route, Switch } from "react-router-dom"

import Users from "./layouts/users"
import Login from "./layouts/login"
import Main from "./layouts/main"
import NavBar from "./components/ui/navBar"
import { ToastContainer } from "react-toastify"
import { ProfessionProvider } from "../hooks/useProfession"
import { QualityProvider } from "../hooks/useQuality"
import AuthProvider from "../hooks/useAuth"
// import ProtectedRoute from "./components/common/protectedRoute"
import LogOut from "./layouts/logOut"
import ProtectedRoute from "./components/common/protectedRoute"

function App() {
    return (
        <div>
            <AuthProvider>
                <NavBar />
                <Switch>
                    <ProfessionProvider>
                        <QualityProvider>
                            <ProtectedRoute
                                path="/users/:userId?/:edit?"
                                component={Users}
                            />
                            <Route path="/login/:type?" component={Login} />
                            <Route path="/logout" component={LogOut} />
                        </QualityProvider>
                        <Route path="/" exact component={Main} />
                    </ProfessionProvider>
                </Switch>
            </AuthProvider>
            <ToastContainer />
        </div>
    )
}

export default App
