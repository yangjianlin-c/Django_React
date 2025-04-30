"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { register } from "@/api/auth";

export default function RegisterPage() {
    const router = useRouter()
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        try {
            const response = await register({ username, email, password });
            console.log(response);
            if (response.status === 200) {
                // 注册成功，自动登录
                localStorage.setItem('access_token', response.data.access);
                localStorage.setItem('refresh_token', response.data.refresh);
                router.push("/") // 跳转到主页
            }
        } catch (err: any) {
            console.error(err);
            setError(err?.data?.detail || "注册失败")
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
                                        <h1 className="text-2xl font-bold">注册账户</h1>
                                        <p className="text-sm text-muted-foreground">
                                            探索未知的世界，发现美好事物
                                        </p>
                                    </div>
                                    {error && <div className="text-red-500 text-sm text-center">{error}</div>}
                                    <div className="grid gap-2">
                                        <Label htmlFor="username">用户名</Label>
                                        <Input
                                            type="text"
                                            name="username"
                                            value={username}
                                            onChange={e => setUsername(e.target.value)}
                                            placeholder="请输入用户名"
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">邮箱</Label>
                                        <Input
                                            type="email"
                                            name="email"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            placeholder="请输入邮箱"
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="password">密码</Label>
                                        <Input
                                            type="password"
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            placeholder="请输入密码"
                                            required
                                        />
                                    </div>
                                    <Button type="submit" className="w-full" disabled={loading}>
                                        {loading ? "注册中..." : "注册"}
                                    </Button>
                                    <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                                        <span className="relative z-10 bg-background px-2 text-muted-foreground">
                                            Or
                                        </span>
                                    </div>
                                    <div className="text-center text-sm">
                                        已有账户?
                                        <a href="/auth/login" className="px-2 underline underline-offset-4">
                                            登录
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
