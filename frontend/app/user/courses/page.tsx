"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "@/api/request";

interface Course {
  id: number // API 返回的是 number
  title: string
  description: string
  price: number // API 包含 price
  image: string // API 包含 image
  tags: string[] // API 包含 tags
  // 注意：API 响应中没有 progress 和 lastStudyTime
}


export default function CoursesPage() {
  // 使用 useState 管理课程数据、加载状态和错误状态
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 使用 useEffect 在组件挂载时获取数据
  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true) // 开始加载
      setError(null) // 重置错误状态
      try {
        const response = await api.get<Course[]>('/user/my_courses')
        setCourses(response.data)
      } catch (e: any) {
        console.error("获取课程失败:", e)
        if (e.response) {
          setError(`加载课程失败: ${e.response.data.detail || e.message}`)
        } else {
          setError("无法加载您的课程，请检查网络连接或稍后再试。")
        }
      } finally {
        setIsLoading(false) // 结束加载
      }
    }

    fetchCourses()
  }, []) // 空依赖数组表示仅在组件挂载时运行

  // 处理加载状态
  if (isLoading) {
    return <div>正在加载课程...</div>
  }

  // 处理错误状态
  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">我的课程</h3>
        <p className="text-sm text-muted-foreground">
          查看您已购买的课程
        </p>
      </div>
      <div className="grid gap-4">
        {/* 检查是否有课程 */}
        {courses.length === 0 ? (
          <p>您还没有购买任何课程。</p>
        ) : (
          courses.map((course) => (
            <Card key={course.id}>
              <CardHeader>
                <CardTitle>{course.title}</CardTitle>
                <CardDescription>{course.description}</CardDescription>
              </CardHeader>
              {/* CardContent 可以根据需要保留或移除，因为 progress 和 lastStudyTime 不再可用 */}
              {/*
              <CardContent>
                <div className="space-y-2">
                  // 移除进度条和最近学习时间相关代码
                </div>
              </CardContent>
              */}
            </Card>
          ))
        )}
      </div>
    </div>
  )
}