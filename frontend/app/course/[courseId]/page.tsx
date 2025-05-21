"use client"

import { useEffect, useState } from "react"
import * as React from 'react'
import Link from "next/link"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tag, Video, Unlock, Lock } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/api/user"
import { getCourse, createOrderForCourse } from "@/api/course"

type Lesson = {
  id: number
  title: string
  video_source: string
  video_url: string | null
  content: string
  free_preview: boolean
  created_at: string | null
  updated_at: string | null
  course_id: number
}

interface Tag {
  id: number
  name: string
}

type Course = {
  id: number
  title: string
  description: string
  price: number
  thumbnail: string
  tags: Tag[]
  lessons: Lesson[]
  enrolled_users: any[]
}


export default function CoursePage({ params }) {
  const router = useRouter()
  const [course, setCourse] = useState<Course | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { courseId } = React.use(params)

  useEffect(() => {
    const fetchData = async () => {
      try {

        // 获取课程信息
        if (courseId !== null) { // Use the unwrapped courseId
          const data = await getCourse(courseId);
          console.log("course data:", data.data);
          setCourse(data.data);
        }
      } catch (error) {
        console.error("获取数据失败:", error);
        toast.error("获取数据失败");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  const handlePurchase = async () => {
    const user = await getCurrentUser();
    setCurrentUser(user);
    if (!currentUser) {
      router.push('/auth/login');
      toast.info("请先登录后再购买课程");
      return;
    }

    if (!course) return;

    // 检查是否已购买
    const hasPurchased = course.enrolled_users?.some(user => user.id === currentUser.id);
    if (hasPurchased) {
      toast.info("您已购买此课程，可直接观看");
      return;
    }

    try {
      // 调用购买接口
      await createOrderForCourse(course.id);
      toast.success("课程购买成功！");

      // 刷新课程数据
      const data = await getCourse(course.id);
      setCourse(data);

      // 如果是免费课程，直接跳转到第一个视频
      if (course.price === 0 && course.lessons.length > 0) {
        router.push(`/courses/${course.id}/videos/${course.lessons[0].id}`);
      }
    } catch (error) {
      toast.error("购买失败，请稍后重试");
    }
  }

  if (loading) {
    return <div>加载中...</div>;
  }

  if (!course) {
    return <div>课程不存在</div>;
  }


  const hasPurchased = currentUser && course.enrolled_users?.some(user => user.id === currentUser.id);
  const isFreeCourse = course?.price === 0;

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Container className="py-8 md:py-12">
          <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold">{course.title}</h1>
              <div className="overflow-hidden rounded-lg">
                <Image
                  src={course.thumbnail ? course.thumbnail : `/${course.id}.png`}
                  alt={course.title}
                  width={800}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Tag className="h-4 w-4" />
                <span>￥{course.price}</span>
              </div>
              {course.tags && course.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {course.tags.map((tag) => (
                    <span key={tag.id} className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}
              <p className="text-lg">{course.description}</p>
              <Button
                className="w-full flex items-center justify-center gap-2"
                onClick={handlePurchase}
                disabled={hasPurchased}
                variant={(hasPurchased) ? "outline" : "default"}
              >
                {hasPurchased ? (
                  <>
                    <Unlock className="h-4 w-4" />
                    <span>已购买</span>
                  </>
                ) : isFreeCourse ? (
                  <>
                    <Unlock className="h-4 w-4" />
                    <span>免费加入</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    <span>立即购买</span>
                  </>
                )}
              </Button>
            </div>


            <Card>
              <CardHeader>
                <CardTitle>课程目录</CardTitle>
                <CardDescription>共{course.lessons.length}个章节</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {course.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent"
                  >
                    <div className="flex items-center gap-4">
                      <Video className="h-5 w-5 text-muted-foreground" />
                      <span>{lesson.title}</span>
                      {/* 免费课程不显示“可试看”标签，因为所有都可看 */}
                      {!isFreeCourse && lesson.free_preview && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                          可试看
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <Button
                        size="sm"
                        variant="outline"
                        asChild
                        // 如果课程免费，按钮永远不禁用
                        // 否则，按原来的逻辑：!video.free_preview && !hasPurchased
                        disabled={!isFreeCourse && !lesson.free_preview && !hasPurchased}
                      >
                        <Link href={`/course/lesson/${lesson.id}`}>
                          {/* 如果课程免费，显示“观看” */}
                          {/* 否则，按原来的逻辑 */}
                          {isFreeCourse
                            ? "观看"
                            : lesson.free_preview
                              ? "试看"
                              : hasPurchased
                                ? "观看"
                                : "需购买"}
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </Container>
      </main>
      <SiteFooter />
    </>
  )
}