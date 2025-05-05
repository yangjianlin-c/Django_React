"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getVideo } from "@/api/course"
import { toast } from "sonner"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

type Video = {
  id: number
  title: string
  duration: string
  url: string
  source_type: "bilibili" | "qiniu"
  course_title: string
}

export default function VideoPage({
  params,
}: {
  params: { courseId: string; videoId: string }
}) {
  const [video, setVideo] = useState<Video | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const data = await getVideo(parseInt(params.courseId), parseInt(params.videoId))
        setVideo(data)
      } catch (error: any) {
        console.error("获取视频信息失败:", error.response?.data || error.message); // 添加日志方便调试
        const errorMessage = error.response?.data?.detail || "获取视频信息失败，请稍后重试";
        toast.error(errorMessage);
        if (error.response?.status === 403) {
          router.push(`/courses/${params.courseId}`); // 如果仍需跳转，保留此行
        }
      } finally {
        setLoading(false)
      }
    }

    fetchVideo()
  }, [params.courseId, params.videoId, router]); // 将 router 加入依赖项

  if (loading) {
    return <div>加载中...</div>
  }

  if (!video) {
    return <div>视频不存在</div>
  }

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Container className="py-8 md:py-12 space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">{video.course_title}</h1>
            <h2 className="text-xl text-muted-foreground">{video.title}</h2>
          </div>

          <div className="aspect-video bg-muted rounded-lg overflow-hidden">
            {video.source_type === "bilibili" ? (
              <iframe
                src={`https://player.bilibili.com/player.html?bvid=${video.url}&page=1&high_quality=1&danmaku=0`}
                className="w-full h-full"
                allowFullScreen
                frameBorder="0"
                scrolling="no"
              />
            ) : (
              <video controls className="w-full h-full">
                <source src={video.url} type="video/mp4" />
                您的浏览器不支持视频播放
              </video>
            )}
          </div>

          <div className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href={`/courses/${params.courseId}`}>返回课程目录</Link>
            </Button>
          </div>
        </Container>
      </main>
      <SiteFooter />
    </>
  )
}