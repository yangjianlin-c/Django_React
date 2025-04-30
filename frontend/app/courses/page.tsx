"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tag } from "lucide-react"

import { listCourses } from "@/api/course"

const title = "在线课程"
const description = "米克网提供的电子产品热管理在线课程"


interface Tag {
    id: number
    name: string
}

type Course = {
    id: number
    title: string
    description: string
    price: number
    image: string
    tags: Tag[]
}

interface CoursesPageProps {
    params?: { [key: string]: string | string[] | undefined }
    searchParams?: { [key: string]: string | string[] | undefined }
}

export default function CoursesPage({ params, searchParams }: CoursesPageProps) {
    const [courses, setCourses] = useState<Course[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedCategory, setSelectedCategory] = useState<string>("")

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await listCourses()
                setCourses(Array.isArray(response.items) ? response.items : [])
            } catch (error) {
                console.error("获取课程列表失败:", error)
                setCourses([])
            } finally {
                setLoading(false)
            }
        }

        fetchCourses()
    }, [])

    // Only calculate categories and filtered courses if courses is an array
    const categories = Array.isArray(courses)
        ? [...new Set(courses.flatMap(course => course.tags?.map(tag => tag.name) || []))]
        : []
    const filteredCourses = Array.isArray(courses)
        ? (selectedCategory
            ? courses.filter(course => course.tags?.some(tag => tag.name === selectedCategory))
            : courses)
        : []

    return (
        <>
            <SiteHeader />
            <main className="flex-1">
                <Container className="space-y-6 py-8 md:py-12">
                    <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
                        <h1 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
                            在线课程
                        </h1>
                        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                            米克网提供的电子产品热管理在线课程
                        </p>
                    </div>

                    {loading ? (
                        <div className="text-center">加载中...</div>
                    ) : (
                        <>
                            <div className="flex justify-center space-x-2 pb-8">
                                <Button
                                    key="all-categories"
                                    variant={!selectedCategory ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setSelectedCategory("")}
                                >
                                    全部
                                </Button>
                                {categories.map((category) => (
                                    <Button
                                        key={category}
                                        variant={selectedCategory === category ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setSelectedCategory(category)}
                                    >
                                        {category}
                                    </Button>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                {filteredCourses.map((course) => (
                                    <Card key={course.id} className="pt-0">
                                        <Link href={`/courses/${course.id}`}>
                                            <div className="overflow-hidden rounded-t-lg">
                                                <Image
                                                    src={course.image || "/placeholder.png"}
                                                    alt={course.title}
                                                    width={400}
                                                    height={200}
                                                    className="h-auto w-auto object-cover transition-all hover:scale-105 aspect-[2/1]"
                                                />
                                            </div>
                                        </Link>
                                        <CardHeader>
                                            <div className="text-sm text-muted-foreground pb-2 flex items-center gap-2">
                                                <Tag className="h-4 w-4" />
                                                ￥{course.price}
                                            </div>
                                            <CardTitle>{course.title}</CardTitle>
                                            <CardDescription>{course.description}</CardDescription>
                                        </CardHeader>
                                        <CardFooter>
                                            <Button size="sm" asChild>
                                                <Link href={`/courses/${course.id}`}>查看详情</Link>
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        </>
                    )}
                </Container>
            </main>
            <SiteFooter />
        </>
    )
}