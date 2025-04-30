"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Ruler, Zap, Thermometer, Heater } from "lucide-react"

import { cn } from "@/lib/utils"
import { Container } from "@/components/ui/container"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function ToolsLayout({
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
                            href="/tools/unit-converter/length"
                            className={cn(
                                "flex items-center gap-2 rounded-lg px-3 py-2 text-base transition-all hover:text-foreground",
                                pathname === "/tools/unit-converter/length"
                                    ? "bg-muted font-medium text-foreground"
                                    : "text-muted-foreground"
                            )}
                        >
                            <Ruler className="h-4 w-4" />
                            长度转换
                        </Link>
                        <Link
                            href="/tools/unit-converter/power"
                            className={cn(
                                "flex items-center gap-2 rounded-lg px-3 py-2 text-base transition-all hover:text-foreground",
                                pathname === "/tools/unit-converter/power"
                                    ? "bg-muted font-medium text-foreground"
                                    : "text-muted-foreground"
                            )}
                        >
                            <Zap className="h-4 w-4" />
                            功率转换
                        </Link>
                        <Link
                            href="/tools/unit-converter/temperature"
                            className={cn(
                                "flex items-center gap-2 rounded-lg px-3 py-2 text-base transition-all hover:text-foreground",
                                pathname === "/tools/unit-converter/temperature"
                                    ? "bg-muted font-medium text-foreground"
                                    : "text-muted-foreground"
                            )}
                        >
                            <Thermometer className="h-4 w-4" />
                            温度转换
                        </Link>
                        <Link
                            href="/tools/unit-converter/thermal-resistance"
                            className={cn(
                                "flex items-center gap-2 rounded-lg px-3 py-2 text-base transition-all hover:text-foreground",
                                pathname === "/tools/unit-converter/thermal-resistance"
                                    ? "bg-muted font-medium text-foreground"
                                    : "text-muted-foreground"
                            )}
                        >
                            <Heater className="h-4 w-4" />
                            热阻计算
                        </Link>
                    </nav>
                </aside>
                <main className="flex w-full flex-col overflow-hidden py-6">{children}</main>
            </Container>
            <SiteFooter />
        </>
    )
}