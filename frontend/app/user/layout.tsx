"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Settings, BookOpen, ShoppingBag } from "lucide-react"
import { Toaster } from "sonner";

import { cn } from "@/lib/utils"
import { Container } from "@/components/ui/container"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function userLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()

    return (
        <>
            <SiteHeader />
            <Container className="flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
                <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r md:sticky md:block">
                    <nav className="grid items-start px-4 py-4 text-sm font-medium">
                        <Link
                            href="/user/settings"
                            className={cn(
                                "flex items-center gap-2 rounded-lg px-3 py-2 text-base transition-all hover:text-foreground",
                                pathname === "/user/settings"
                                    ? "bg-muted font-medium text-foreground"
                                    : "text-muted-foreground"
                            )}
                        >
                            <Settings className="h-4 w-4" />
                            用户设置
                        </Link>
                        <Link
                            href="/user/courses"
                            className={cn(
                                "flex items-center gap-2 rounded-lg px-3 py-2 text-base transition-all hover:text-foreground",
                                pathname === "/user/courses"
                                    ? "bg-muted font-medium text-foreground"
                                    : "text-muted-foreground"
                            )}
                        >
                            <BookOpen className="h-4 w-4" />
                            我的课程
                        </Link>
                        <Link
                            href="/user/orders"
                            className={cn(
                                "flex items-center gap-2 rounded-lg px-3 py-2 text-base transition-all hover:text-foreground",
                                pathname === "/user/orders"
                                    ? "bg-muted font-medium text-foreground"
                                    : "text-muted-foreground"
                            )}
                        >
                            <ShoppingBag className="h-4 w-4" />
                            订单列表
                        </Link>
                    </nav>
                </aside>
                <main className="flex w-full flex-col overflow-hidden  py-6">{children}</main>
            </Container>
            <SiteFooter />
            <Toaster position="top-right" />
        </>
    )
}