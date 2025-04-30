"use client"

import Link from "next/link"
import { Container } from "@/components/ui/container"

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Ruler, Zap, Thermometer, Heater } from "lucide-react"

const converters = [
  {
    title: "长度单位转换",
    description: "米、厘米、英寸等长度单位互转",
    icon: Ruler,
    href: "/tools/unit-converter/length",
    image: "/length.png"
  },
  {
    title: "功率单位转换",
    description: "mw, dBm, W 等功率单位互转",
    icon: Zap,
    href: "/tools/unit-converter/power",
    image: "/power.png"
  },
  {
    title: "温度单位转换",
    description: "摄氏度、华氏度、开尔文温度互转",
    icon: Thermometer,
    href: "/tools/unit-converter/temperature",
    image: "/temperature.png"
  },
  {
    title: "热阻计算",
    description: "根据长度、导热系数、面积计算热阻",
    icon: Heater,
    href: "/tools/unit-converter/thermal-resistance",
    image: "/resistance.png"
  },
]

export default function UnitConverterPage() {
  return (
    <>

      <main className="flex-1">
        <Container className="py-8 md:py-12">
          <div className="max-w-[800px] space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-3xl font-bold">单位转换工具</h1>
              <p className="text-muted-foreground">
                提供各种物理量的单位换算，支持国际单位制与英制单位的互相转换
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-4">
              {converters.map((converter) => (
                <Link key={converter.href} href={converter.href}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="flex justify-center items-center p-2">
                      <converter.icon className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-xl">{converter.title}</CardTitle>
                      </div>
                      <CardDescription>{converter.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </main>

    </>
  )
}