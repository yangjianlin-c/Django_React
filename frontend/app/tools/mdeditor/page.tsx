"use client"

import { useEffect, useState } from "react"
import Vditor from "vditor"
import "vditor/dist/index.css"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Container } from "@/components/ui/container"

export default function MarkdownEditorPage() {
  const [vd, setVd] = useState<Vditor | null>(null)

  useEffect(() => {
    const vditor = new Vditor("vditor", {
      height: 500,
      mode: "sv",
      cache: {
        enable: true,
      },
      upload: {
        accept: "image/*",
        handler: async (files: File[]) => {
          // TODO: 实现图片上传功能
          console.log("上传文件：", files)
          return "图片上传功能开发中"
        },
      },
      preview: {
        hljs: {
          enable: true,
          style: "github",
        },
        math: {
          engine: "KaTeX",
        },
      },
      after: () => {
        // 编辑器初始化完成后的回调
        setVd(vditor)
      },
    })

  }, [])

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Container className="py-6 md:py-8">
          <div className="mx-auto max-w-[1200px]">
            <h1 className="mb-6 text-2xl font-semibold tracking-tight">Markdown 在线编辑器</h1>
            <div id="vditor" className="vditor" />
          </div>
        </Container>
      </main>
      <SiteFooter />
    </>
  )
}