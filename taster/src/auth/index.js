import { createContext, useState, useEffect } from 'react'
import api from '../api'

export const AuthContext = createContext();

function AuthContextProvider(props) {
    const [auth, setAuth] = useState({
        user: null,
        loggedIn: false
    });
    const history = useHistory();

    auth.registerUser = async function(userData, store) {
        try {
            const response = await api.register(userData);      
            if (response.status === 200) {
                history.push("/");
                // store.loadIdNamePairs();
            }
        }
        catch (err) {
            try {
                // store.showAlert(err.response.data.errorMessage);
                console.error(err);
            }
            catch (error) {
                console.error(error);
            }
        }
    }

    auth.loginUser = async function(userData, store) {
        try {
            const response = await api.login(userData);
            if (response.status === 200) {
                history.push("/");
                // store.loadIdNamePairs();
            }
        }
        catch (err) {
            try {
                // store.showAlert(err.response.data.errorMessage);
                console.log(err)
            }
            catch (error) {
                console.error(error);
            }
        }
    }

    auth.logoutUser = async function(store) {
        try {
            await api.logout();
        }
        catch {}

        authReducer({
            type: AuthActionType.LOGOUT_USER,
            payload: null
        });
        // store.logout();
        document.cookie = '';
        history.push("/");
    }

    return (
        <AuthContext.Provider value={{
            auth
        }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
export { AuthContextProvider };