"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export default function ThermalResistancePage() {
  const [conductivity, setConductivity] = useState<string>("")
  const [thickness, setThickness] = useState<string>("")
  const [area, setArea] = useState<string>("")
  const [heatFlow, setHeatFlow] = useState<string>("")

  const calculateResistance = (k: number, l: number, a: number): number => {
    const lInMeters = l / 1000
    const aInSquareMeters = a / 1000000
    return lInMeters / (k * aInSquareMeters)
  }

  const calculateTemperatureDiff = (q: number, k: number, l: number, a: number): number => {
    const lInMeters = l / 1000
    const aInSquareMeters = a / 1000000
    return (q * lInMeters) / (k * aInSquareMeters)
  }

  const getResistanceResult = (): string => {
    const k = Number(conductivity)
    const l = Number(thickness)
    const a = Number(area)

    if (isNaN(k) || isNaN(l) || isNaN(a)) {
      return ""
    }

    if (k <= 0 || l <= 0 || a <= 0) {
      return "输入值必须大于0"
    }

    try {
      const resistance = calculateResistance(k, l, a)
      return resistance.toFixed(4) + " K/W"
    } catch (error) {
      return "计算错误"
    }
  }

  const getTemperatureDiffResult = (): string => {
    const k = Number(conductivity)
    const l = Number(thickness)
    const a = Number(area)
    const q = Number(heatFlow)

    if (isNaN(k) || isNaN(l) || isNaN(a) || isNaN(q)) {
      return ""
    }

    if (k <= 0 || l <= 0 || a <= 0 || q < 0) {
      return "输入值必须大于0"
    }

    try {
      const deltaT = calculateTemperatureDiff(q, k, l, a)
      return deltaT.toFixed(2) + " °C"
    } catch (error) {
      return "计算错误"
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>热阻计算</CardTitle>
            <CardDescription>计算给定条件下的热阻值</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>导热系数 k (W/mK)</Label>
                  <Input
                    type="number"
                    value={conductivity}
                    onChange={(e) => setConductivity(e.target.value)}
                    placeholder="输入导热系数"
                  />
                </div>

                <div className="space-y-2">
                  <Label>平面厚度 L (mm)</Label>
                  <Input
                    type="number"
                    value={thickness}
                    onChange={(e) => setThickness(e.target.value)}
                    placeholder="输入平面厚度"
                  />
                </div>

                <div className="space-y-2">
                  <Label>平面面积 A (mm²)</Label>
                  <Input
                    type="number"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="输入平面面积"
                  />
                </div>

                <div className="space-y-2">
                  <Label>热阻</Label>
                  <Input
                    type="text"
                    value={getResistanceResult()}
                    readOnly
                    placeholder="热阻 (K/W)"
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 text-sm text-muted-foreground">
              <p className="mb-2">计算公式说明：</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>热阻 (R) = L / (k × A)，其中L为厚度(m)，k为导热系数(W/mK)，A为面积(m²)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>温差计算</CardTitle>
            <CardDescription>计算给定条件下的温差值</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>导热系数 k (W/mK)</Label>
                  <Input
                    type="number"
                    value={conductivity}
                    onChange={(e) => setConductivity(e.target.value)}
                    placeholder="输入导热系数"
                  />
                </div>

                <div className="space-y-2">
                  <Label>平面厚度 L (mm)</Label>
                  <Input
                    type="number"
                    value={thickness}
                    onChange={(e) => setThickness(e.target.value)}
                    placeholder="输入平面厚度"
                  />
                </div>

                <div className="space-y-2">
                  <Label>平面面积 A (mm²)</Label>
                  <Input
                    type="number"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="输入平面面积"
                  />
                </div>

                <div className="space-y-2">
                  <Label>热量 Q (W)</Label>
                  <Input
                    type="number"
                    value={heatFlow}
                    onChange={(e) => setHeatFlow(e.target.value)}
                    placeholder="输入热量"
                  />
                </div>

                <div className="space-y-2">
                  <Label>温差</Label>
                  <Input
                    type="text"
                    value={getTemperatureDiffResult()}
                    readOnly
                    placeholder="温差 (°C)"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 text-sm text-muted-foreground">
              <p className="mb-2">计算公式说明：</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>温差 (ΔT) = Q × L / (k × A)，其中Q为热量(W)</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}