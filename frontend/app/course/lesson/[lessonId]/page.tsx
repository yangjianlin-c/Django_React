"use client"

import { useEffect, useState } from "react"
import * as React from 'react'
import { useRouter } from "next/navigation"
import { getLesson } from "@/api/course"
import { toast } from "sonner"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

type Lesson = {
  id: number
  title: string
  course: number       // 修改为 number 类型，因为后端只返回 course ID
  free_preview: boolean
  video_source: "bili" | "qiniu"
  video_url: string
  content: string
  created_at: string
  updated_at: string
}

export default function VideoPage({
  params,
}: {
  params: { lessonId: string }
}) {
  const { lessonId } = React.use(params)
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const data = await getLesson(parseInt(lessonId))
        setLesson(data.data)
        console.log("获取课时信息成功:", data.data)
      } catch (error: any) {
        console.error("获取课时信息失败:", error.response?.data || error.message)
        const errorMessage = error.response?.data?.detail || "获取课时信息失败，请稍后重试"
        toast.error(errorMessage)
        if (error.response?.status === 403) {
          router.push(`/course/${lesson?.course}`)  // 修改这里，直接使用 course ID
        }
      } finally {
        setLoading(false)
      }
    }

    fetchLesson()
  }, [lessonId, router])

  if (loading) {
    return <div>加载中...</div>
  }

  if (!lesson) {
    return <div>课时不存在</div>
  }

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Container className="py-8 md:py-12 space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">{lesson.title}</h1>  {/* 移除 course.title 的显示 */}
          </div>

          <div className="aspect-video bg-muted rounded-lg overflow-hidden">
            {lesson.video_source === "bili" ? (
              <iframe
                src={`https://player.bilibili.com/player.html?bvid=${lesson.video_url}&page=1&high_quality=1&danmaku=0`}
                className="w-full h-full"
                allowFullScreen
                frameBorder="0"
                scrolling="no"
              />
            ) : (
              <video controls className="w-full h-full">
                <source src={lesson.video_url} type="video/mp4" />
                您的浏览器不支持视频播放
              </video>
            )}
          </div>

          <div className="flex justify-between">
            <Button variant="outline">
              <Link href={`/course/${lesson.course}`}>返回课程目录</Link>  {/* 修改这里，直接使用 course ID */}
            </Button>
          </div>
        </Container>
      </main>
      <SiteFooter />
    </>
  )
}