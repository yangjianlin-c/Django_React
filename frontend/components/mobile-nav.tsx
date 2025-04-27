"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Menu } from "lucide-react"
import { GraduationCap, Wrench, FileText } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"

export function MobileNav() {
    const [open, setOpen] = React.useState(false)

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button
                    variant="ghost"
                    className="h-8 w-8 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
                >
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">打开菜单</span>
                </Button>
            </DrawerTrigger>
            <DrawerContent className="max-h-[80svh] p-0">
                <DrawerHeader>
                    <DrawerTitle>米克网</DrawerTitle>
                </DrawerHeader>
                <div className="overflow-auto p-6">
                    <div className="flex flex-col space-y-3">
                        <MobileLink href="/courses" onOpenChange={setOpen} className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4" />
                            课程
                        </MobileLink>
                        <MobileLink href="/tools" onOpenChange={setOpen} className="flex items-center gap-2">
                            <Wrench className="h-4 w-4" />
                            工具
                        </MobileLink>
                        <MobileLink href="/docs" onOpenChange={setOpen} className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            文档
                        </MobileLink>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    )
}

interface MobileLinkProps {
    href: string
    onOpenChange?: (open: boolean) => void
    children: React.ReactNode
    className?: string
}

function MobileLink({
    href,
    onOpenChange,
    className,
    children,
    ...props
}: MobileLinkProps) {
    const router = useRouter()
    return (
        <Link
            href={href}
            onClick={() => {
                router.push(href)
                onOpenChange?.(false)
            }}
            className={cn(
                "text-foreground/70 transition-colors hover:text-foreground",
                "text-lg font-medium",
                className
            )}
            {...props}
        >
            {children}
        </Link>
    )
}