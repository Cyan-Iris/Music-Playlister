import './App.css';
import { React } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { AuthContextProvider } from './auth';
import { GlobalStoreContextProvider } from './store'
import AppBanner from './components/AppBanner'
import HomeWrapper from './components/HomeWrapper'
import LoginScreen from './components/LoginScreen'
import RegisterScreen from './components/RegisterScreen'
import WorkspaceScreen from './components/WorkSpace'

const App = () => {   
    return (
        <BrowserRouter>
            <AuthContextProvider>
                <GlobalStoreContextProvider>              
                    <AppBanner />
                    <Switch>
                        <Route path="/" exact component={HomeWrapper} />
                        <Route path="/login/" exact component={LoginScreen} />
                        <Route path="/register/" exact component={RegisterScreen} />
                        {/* <Route path="/playlist/:id" exact component={WorkspaceScreen} /> */}
                    </Switch>
                    {/* <Statusbar /> */}
                </GlobalStoreContextProvider>
            </AuthContextProvider>
        </BrowserRouter>
    )
}

export default App