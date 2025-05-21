"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"

import { GraduationCap, Wrench, FileText } from "lucide-react"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-4 flex items-center gap-2 lg:mr-6">
        <Icons.logo className="h-6 w-6" />
        <span className="hidden font-bold lg:inline-block">
          {siteConfig.name}
        </span>
      </Link>
      <nav className="flex items-center gap-4 text-sm xl:gap-6">
        <Link
          href="/courses"
          className={cn(
            "transition-colors hover:text-foreground/80 flex items-center gap-1",
            pathname?.startsWith("/courses")
              ? "text-foreground"
              : "text-foreground/80"
          )}
        >
          <GraduationCap className="h-4 w-4" />
          课程
        </Link>

        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="flex items-center gap-1">
                <Wrench className="h-4 w-4" />
                工具
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/tools/unit-converter"
                        className={cn(
                          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                          pathname?.startsWith("/tools/unit-converter") && "bg-accent"
                        )}
                      >
                        单位转换
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/tools/mdeditor"
                        className={cn(
                          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                          pathname?.startsWith("/tools/mdeditor") && "bg-accent"
                        )}
                      >
                        Markdown 编辑器
                      </Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <Link
          href="/docs"
          className={cn(
            "transition-colors hover:text-foreground/80 flex items-center gap-1",
            pathname?.startsWith("/docs")
              ? "text-foreground"
              : "text-foreground/80"
          )}
        >
          <FileText className="h-4 w-4" />
          文档
        </Link>
      </nav>
    </div>
  )
}