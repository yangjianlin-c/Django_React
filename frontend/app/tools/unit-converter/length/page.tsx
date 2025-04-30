"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface UnitOption {
    value: string
    label: string
    ratio: number
}

const unitOptions: UnitOption[] = [
    { value: "m", label: "米 (m)", ratio: 1 },
    { value: "km", label: "千米 (km)", ratio: 1000 },
    { value: "cm", label: "厘米 (cm)", ratio: 0.01 },
    { value: "mm", label: "毫米 (mm)", ratio: 0.001 },
    { value: "in", label: "英寸 (in)", ratio: 0.0254 },
    { value: "ft", label: "英尺 (ft)", ratio: 0.3048 },
    { value: "yd", label: "码 (yd)", ratio: 0.9144 },
    { value: "mi", label: "英里 (mi)", ratio: 1609.344 }
]

export default function LengthConverterPage() {
    const [fromValue, setFromValue] = useState<string>("")
    const [fromUnit, setFromUnit] = useState<string>(unitOptions[3].value)
    const [toUnit, setToUnit] = useState<string>(unitOptions[4].value)

    const convert = (value: string, from: string, to: string): string => {
        if (!value || isNaN(Number(value))) return ""

        const fromOption = unitOptions.find(opt => opt.value === from)
        const toOption = unitOptions.find(opt => opt.value === to)

        if (!fromOption || !toOption) return ""

        const baseValue = Number(value) * fromOption.ratio
        const result = baseValue / toOption.ratio
        return result.toFixed(6)
    }

    return (
        <div className="container mx-auto py-6">
            <Card>
                <CardHeader>
                    <CardTitle>长度单位转换</CardTitle>
                    <CardDescription>支持米、千米、厘米等长度单位之间的转换</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>从</Label>
                            <div className="grid gap-2">
                                <Input
                                    type="number"
                                    value={fromValue}
                                    onChange={(e) => setFromValue(e.target.value)}
                                    placeholder="输入数值"
                                />
                                <Select
                                    value={fromUnit}
                                    onValueChange={setFromUnit}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {unitOptions.map((option) => (
                                            <SelectItem
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>到</Label>
                            <div className="grid gap-2">
                                <Input
                                    type="number"
                                    value={convert(fromValue, fromUnit, toUnit)}
                                    readOnly
                                    placeholder="转换结果"
                                />
                                <Select
                                    value={toUnit}
                                    onValueChange={setToUnit}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {unitOptions.map((option) => (
                                            <SelectItem
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}