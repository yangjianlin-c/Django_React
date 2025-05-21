'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'


type AuthContextType = {
    accessToken: string | null
    refreshToken: string | null
    login: (accessToken: string, refreshToken: string) => void
    logout: () => void
}

const AuthContext = createContext<AuthContextType>({
    accessToken: null,
    refreshToken: null,
    login: () => { },
    logout: () => { },
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [accessToken, setAccessToken] = useState<string | null>(null)
    const [refreshToken, setRefreshToken] = useState<string | null>(null)

    const router = useRouter()

    useEffect(() => {
        const storedAccessToken = localStorage.getItem('accessToken')
        const storedRefreshToken = localStorage.getItem('refreshToken')
        if (storedAccessToken && storedRefreshToken) {
            setAccessToken(storedAccessToken)
            setRefreshToken(storedRefreshToken)
        }
    }, [])

    const login = (newAccessToken: string, newRefreshToken: string) => {
        localStorage.setItem('accessToken', newAccessToken)
        localStorage.setItem('refreshToken', newRefreshToken)
        setAccessToken(newAccessToken)
        setRefreshToken(newRefreshToken)
    }

    const logout = () => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        setAccessToken(null)
        setRefreshToken(null)
        router.push('/auth/login')
    }

    return (
        <AuthContext.Provider value={{ accessToken, refreshToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
