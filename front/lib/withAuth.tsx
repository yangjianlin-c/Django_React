'use client'

import { useAuth } from './auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export const withAuth = (Component: React.FC) => {
    return function AuthenticatedComponent(props: any) {
        const { accessToken } = useAuth()
        const router = useRouter()

        useEffect(() => {
            if (!accessToken) {
                router.push('/auth/login')
            }
        }, [accessToken])

        if (!accessToken) {
            return <p className="text-center mt-10">正在验证权限...</p>
        }

        return <Component {...props} />
    }
}
