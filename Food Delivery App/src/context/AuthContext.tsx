import { createContext, useContext, useState, ReactNode } from 'react';

type AuthCtx = {
    isLoggedIn: boolean;
    userName: string;
    login: (name: string) => void;
    logout: () => void;
};

export const AuthContext = createContext<AuthCtx>({
    isLoggedIn: false,
    userName: '',
    login: () => {},
    logout: () => {},
});

let persistedName = '';

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isLoggedIn, setIsLoggedIn] = useState(!!persistedName);
    const [userName, setUserName] = useState(persistedName);

    function login(name: string) {
        persistedName = name || 'Guest User';
        setUserName(persistedName);
        setIsLoggedIn(true);
    }

    function logout() {
        persistedName = '';
        setUserName('');
        setIsLoggedIn(false);
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn, userName, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
