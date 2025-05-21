import { siteConfig } from "@/config/site"
import { Container } from "@/components/ui/container"
import Link from "next/link"
import { Icons } from "@/components/icons"

export function SiteFooter() {
    return (
        <footer className="border-t py-12">
            <Container>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {/* 第一列：品牌介绍 */}
                    <div className="flex flex-col space-y-4">
                        <div className="flex items-center space-x-2">
                            <span className="font-bold">{siteConfig.name}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            米克网提供电电子产品散热解决方案，并分享热设计经验，旨在降低能耗，通过技术手段促进人与自然的和谐相处。
                        </p>
                        <div className="flex space-x-4">
                            <Link href="https://space.bilibili.com" className="text-muted-foreground hover:text-foreground" target="_blank" rel="noreferrer">
                                <Icons.bilibili className="h-5 w-5" />
                                <span className="sr-only">BiliBili</span>
                            </Link>
                            <Link href={siteConfig.links.github} className="text-muted-foreground hover:text-foreground" target="_blank" rel="noreferrer">
                                <Icons.gitHub className="h-5 w-5" />
                                <span className="sr-only">GitHub</span>
                            </Link>
                        </div>
                        <div className="text-sm text-muted-foreground">
                            © {siteConfig.name} 2023 - 2024. 浙ICP备100459259-6
                        </div>
                    </div>

                    {/* 第二列：Mekesim */}
                    <div className="flex flex-col space-y-4">
                        <h4 className="font-medium">Mekesim</h4>
                        <nav className="flex flex-col space-y-2">
                            <Link href="/courses" className="text-sm text-muted-foreground hover:text-foreground">
                                在线课程
                            </Link>
                            <Link href="/consulting" className="text-sm text-muted-foreground hover:text-foreground">
                                咨询服务
                            </Link>
                            <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                                联系我们
                            </Link>
                        </nav>
                    </div>

                    {/* 第三列：订阅邮件 */}
                    <div className="flex flex-col space-y-4">
                        <h4 className="font-medium">订阅邮件</h4>
                        <p className="text-sm text-muted-foreground">
                            Join our mailing list. We write rarely, but only the best content.
                        </p>
                        <form className="flex flex-col space-y-2">
                            <input
                                type="email"
                                placeholder="example@company.com"
                                className="rounded-md border px-3 py-2 text-sm"
                            />
                            <button
                                type="submit"
                                className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground hover:bg-primary/90"
                            >
                                订阅
                            </button>
                        </form>
                    </div>
                </div>
            </Container>
        </footer>
    )
}