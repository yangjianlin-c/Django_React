'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/lib/auth-context'
const schema = z.object({
    username: z.string().min(3, '用户名至少为3个字符'),
    email: z.string().email('请输入有效的电子邮箱地址'),
    password: z.string().min(6, '密码至少为6个字符'),
})

type FormData = z.infer<typeof schema>

export default function RegisterPage() {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
    })
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { login } = useAuth()

    const onSubmit = async (data: FormData) => {
        setLoading(true)
        setError(null)

        try {
            await api.post('/auth/register', data)

            // 注册成功后，使用用户名和密码登录
            const loginResponse = await api.post('/auth/login', {
                username: data.username,
                password: data.password
            })

            login(loginResponse.data.access, loginResponse.data.refresh)

            router.push('/dashboard')
        } catch (error: any) {
            setError(error.response?.data?.detail || '注册失败，请稍后重试')
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
                            <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8" autoComplete="on">
                                <div className="flex flex-col gap-6">
                                    <div className="flex flex-col items-center text-center">
                                        <h1 className="text-2xl font-bold">注册米克网账户</h1>
                                        <p className="text-sm text-muted-foreground">
                                            加入我们，开启学习之旅
                                        </p>
                                    </div>
                                    {error && <div className="text-red-500 text-sm text-center">{error}</div>}
                                    <div className="grid gap-2">
                                        <Label htmlFor="username">用户名</Label>
                                        <Input
                                            id="username"
                                            type="text"
                                            autoComplete="username"
                                            {...register('username')}
                                        />
                                        {errors.username && <p className="text-sm text-red-500">{errors.username.message}</p>}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">电子邮箱</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            autoComplete="email"
                                            {...register('email')}
                                        />
                                        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="password">密码</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            autoComplete="new-password"
                                            {...register('password')}
                                        />
                                        {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
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
                                    alt="注册页面背景图"
                                />
                            </div>
                        </CardContent>
                    </Card>
                    <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
                        点击注册，即表示您同意我们的 <a href="#">服务条款</a>{" "}
                        和 <a href="#">隐私政策</a>。
                    </div>
                </div>
            </div>
        </div>
    )
}
