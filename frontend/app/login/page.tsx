"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { login } from "@/api/user"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { apiRequest } from "@/api/request";

export default function LoginPage() {
    const router = useRouter()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    interface CheckLoginResponse {
        success: boolean;
        message?: string;
    }
    // 检查用户是否已经登录
    useEffect(() => {
        const checkLogin = async () => {
            try {
                const response = await apiRequest<CheckLoginResponse>('/api/user/check_login', {
                    method: 'GET',
                    credentials: 'include',
                })
                if (response.success) {
                    router.push("/")
                }
            } catch (err) {
                console.log("User not logged in or session expired")
            }
        }
        checkLogin()
    }, [router])


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        try {
            const res = await login({ username, password })
            if (res && res.success) {
                localStorage.setItem('sessionid', res.sessionid)
                localStorage.setItem('csrftoken', res.csrftoken)
                router.push("/")
            } else {
                setError(res?.message || "登录失败")
            }
        } catch (err: any) {
            setError(err?.message || "登录失败")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-3xl">
                <div className="flex flex-col gap-6">
                    <Card className="overflow-hidden py-0">
                        <CardContent className="grid p-0 md:grid-cols-2">
                            <form onSubmit={handleSubmit} className="p-6 md:p-8">
                                <div className="flex flex-col gap-6">
                                    <div className="flex flex-col items-center text-center">
                                        <h1 className="text-2xl font-bold">欢迎登入米克网</h1>
                                        <p className="text-sm text-muted-foreground">
                                            探索未知的世界，发现美好事物
                                        </p>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">用户名</Label>
                                        <Input
                                            type="text"
                                            value={username}
                                            onChange={e => setUsername(e.target.value)}
                                            placeholder="请输入用户名"
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <div className="flex items-center">
                                            <Label htmlFor="password">密码</Label>
                                            <a
                                                href="#"
                                                className="ml-auto text-sm underline-offset-2 hover:underline"
                                            >
                                                忘记密码?
                                            </a>
                                        </div>
                                        <Input
                                            type="password"
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            placeholder="请输入密码"
                                            required
                                        />
                                    </div>
                                    <Button type="submit" className="w-full" disabled={loading}>
                                        {loading ? "登录中..." : "登录"}
                                    </Button>
                                    <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                                        <span className="relative z-10 bg-background px-2 text-muted-foreground">
                                            Or
                                        </span>
                                    </div>
                                    <div className="text-center text-sm">
                                        没有账户?
                                        <a href="#" className="px-2 underline underline-offset-4">
                                            注册
                                        </a>
                                    </div>
                                </div>
                            </form>
                            <div className="relative hidden bg-muted md:block">
                                <img
                                    src="/login.jpg"
                                    className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                                />
                            </div>
                        </CardContent>
                    </Card>
                    <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
                        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
                        and <a href="#">Privacy Policy</a>.
                    </div>
                </div>
            </div>
        </div>
    )
}
