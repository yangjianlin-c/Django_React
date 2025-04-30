"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface UnitOption {
    value: string
    label: string
    toBase: (value: number) => number
    fromBase: (value: number) => number
}

const unitOptions: UnitOption[] = [
    {
        value: "c",
        label: "摄氏度 (°C)",
        toBase: (value: number) => value,
        fromBase: (value: number) => value
    },
    {
        value: "f",
        label: "华氏度 (°F)",
        toBase: (value: number) => (value - 32) * 5 / 9,
        fromBase: (value: number) => value * 9 / 5 + 32
    },
    {
        value: "k",
        label: "开尔文 (K)",
        toBase: (value: number) => value - 273.15,
        fromBase: (value: number) => value + 273.15
    },
    {
        value: "r",
        label: "兰氏度 (°R)",
        toBase: (value: number) => (value - 491.67) * 5 / 9,
        fromBase: (value: number) => value * 9 / 5 + 491.67
    }
]

export default function TemperatureConverterPage() {
    const [fromValue, setFromValue] = useState<string>("")
    const [fromUnit, setFromUnit] = useState<string>(unitOptions[0].value)
    const [toUnit, setToUnit] = useState<string>(unitOptions[2].value)

    const convert = (value: string, from: string, to: string): string => {
        if (!value || isNaN(Number(value))) return ""

        const fromOption = unitOptions.find(opt => opt.value === from)
        const toOption = unitOptions.find(opt => opt.value === to)

        if (!fromOption || !toOption) return ""

        const baseValue = fromOption.toBase(Number(value))
        const result = toOption.fromBase(baseValue)
        return result.toFixed(2)
    }

    return (
        <div className="container mx-auto py-6">
            <Card>
                <CardHeader>
                    <CardTitle>温度单位转换</CardTitle>
                    <CardDescription>支持摄氏度、华氏度、开尔文等温度单位之间的转换</CardDescription>
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