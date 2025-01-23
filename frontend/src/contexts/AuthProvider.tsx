import login from "@/services/auth";
import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import cookie from 'js-cookie';

type AuthContextType = {
    authToken: string | null
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

    return <AuthContext.Provider value={{ authToken, handleLogin }}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext)

    if (context === undefined) {
        throw new Error('useAuth must be used inside of a AuthProvider')
    }

    return context
}