import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import {
    Store as GlobalStore,
    useReduxHook as useGlobalReduxHook,
} from './hook.redux/global';
import Home from './pages/Home';

function GlobalProvider({ children }) {
    const [state, dispatch] = useGlobalReduxHook();
    return (
        <GlobalStore.Provider value={{ state, dispatch }}>
            {children}
        </GlobalStore.Provider>
    );
}

const App = () => {
    return (
        <GlobalProvider>
            <HashRouter>
                <Switch>
                    <Route exact path="/" component={Home} />
                </Switch>
            </HashRouter>
        </GlobalProvider>
    );
};

export default App;
