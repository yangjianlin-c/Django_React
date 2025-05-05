"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { User } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getCurrentUser, updateProfile, uploadAvatar } from "@/api/user"

const profileFormSchema = z.object({
  username: z.string().min(2, "用户名至少2个字符").max(30, "用户名最多30个字符"),
  email: z.string().email("请输入有效的邮箱地址"),
  bio: z.string().max(160, "个人简介最多160个字符").optional(),
  avatarUrl: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export default function SettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState("")

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: "",
      email: "",
      bio: "",
      avatarUrl: "",
    },
  })

  // 获取用户信息
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userData = await getCurrentUser();
        console.log("用户信息:", userData.data);

        form.reset({
          username: userData.data.username || "",
          email: userData.data.email || "",
          bio: userData.data.bio || "",
        });
        setAvatarUrl(userData.data.avatar_url || "");
      } catch (error) {
        console.error("获取用户信息失败", error);
        // 打印更详细的错误信息
        if (error.response) {
          console.error("错误状态码:", error.response.status);
          console.error("错误详情:", error.response.data);
        }

        toast("获取用户信息失败", {
          description: "请稍后再试",
          type: "error",
        });

        if (error.response?.status === 401) {
          router.push("/auth/login");
        }
      }
    };

    fetchUserProfile();
  }, [form]);

  // 提交表单
  async function onSubmit(data: ProfileFormValues) {
    setLoading(true);
    try {
      await updateProfile(data);
      toast("更新成功", {
        description: "个人信息已更新",
        type: "success",
      });
    } catch (error) {
      console.error("更新用户信息失败", error);
      toast("更新失败", {
        description: "请稍后再试",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // 检查文件大小
      if (file.size > 2 * 1024 * 1024) {
        toast("文件过大", {
          description: "头像文件大小不能超过2MB",
          type: "error",
        });
        return;
      }

      setLoading(true);
      try {
        const response = await uploadAvatar(file);
        const avatarUrl = response.data.avatarUrl;
        // 确保 avatarUrl 是完整的 URL
        const fullAvatarUrl = `http://127.0.0.1:8000/${avatarUrl}`;
        console.log(fullAvatarUrl);
        setAvatarUrl(fullAvatarUrl);
        toast("上传成功", {
          description: "头像已更新",
          type: "success",
        });
      } catch (error) {
        console.error("上传头像失败", error);
        toast("上传失败", {
          description: "请稍后再试",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">个人信息</h3>
        <p className="text-sm text-muted-foreground">
          更新您的个人信息和账户设置
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>头像设置</CardTitle>
          <CardDescription>
            点击头像可以上传新的头像图片
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Avatar className="h-24 w-24 cursor-pointer" onClick={handleAvatarClick}>
              {avatarUrl ? (
                <AvatarImage src={avatarUrl} alt="用户头像" />
              ) : null}
              <AvatarFallback>
                <User className="h-12 w-12" />
              </AvatarFallback>
            </Avatar>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/jpeg,image/png"
              onChange={handleFileChange}
            />
            <div className="space-y-1">
              <h4 className="text-sm font-medium">头像要求</h4>
              <div className="text-sm text-muted-foreground">
                <p>支持JPG、PNG格式</p>
                <p>文件大小不超过2MB</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>基本信息</CardTitle>
            <CardDescription>
              设置您的个人基本信息
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="username">用户名</Label>
              <Input
                id="username"
                {...form.register("username")}
                className="w-[400px]"
                disabled={loading}
              />
              {form.formState.errors.username && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.username.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">邮箱</Label>
              <Input
                id="email"
                type="email"
                {...form.register("email")}
                className="w-[400px]"
                disabled={loading}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bio">个人简介</Label>
              <Textarea
                id="bio"
                {...form.register("bio")}
                className="w-[400px] h-[100px]"
                disabled={loading}
              />
              {form.formState.errors.bio && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.bio.message}
                </p>
              )}
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? "保存中..." : "保存更改"}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
