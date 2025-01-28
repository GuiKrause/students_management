import login, { register } from "@/services/auth";
import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import cookie from 'js-cookie';

type AuthContextType = {
    authToken: string | null
    handleLogout: () => void
    handleRegister: (credentials: { email: string, password: string }) => Promise<boolean>
    handleLogin: (credentials: { email: string, password: string }) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = PropsWithChildren;

export default function AuthProvider({ children }: AuthProviderProps) {
    const [authToken, setAuthToken] = useState<string | null>(null)

    useEffect(() => {
        const token = cookie.get('token')
        if (token) {
            setAuthToken(token)
        }
    }, [])

    async function handleLogin(credentials: any) {
        try {
            const response = await login(credentials)
            setAuthToken(response)
            cookie.set('token', response)
            return true;
        } catch (error) {
            setAuthToken(null)
            return false;
        }
    }

    async function handleRegister(credentials: any) {
        const { email, password } = credentials;
        try {
            const response = await register({ email: email, password: password });
            return response;
        } catch (error) {
            return false;
        }
    }

    function handleLogout() {
        setAuthToken(null)
        cookie.remove('token')
    }

    return <AuthContext.Provider value={{ authToken, handleLogout, handleLogin, handleRegister }}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext)

    if (context === undefined) {
        throw new Error('useAuth must be used inside of a AuthProvider')
    }

    return context
}