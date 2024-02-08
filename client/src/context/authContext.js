import { createContext } from 'react'
export const AuthContextProvider = ({ children }) => {
    return (
        <AuthContext.Provider value={{}}>
            {children}
        </AuthContext.Provider>
    );
};