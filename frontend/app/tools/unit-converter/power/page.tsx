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

interface UnitOption {
    value: string
    label: string
    ratio: number
    isDbm?: boolean
}

const unitOptions: UnitOption[] = [
    { value: "w", label: "瓦特 (W)", ratio: 1000 },
    { value: "mw", label: "毫瓦 (mW)", ratio: 1 },
    { value: "dbm", label: "分贝毫瓦 (dBm)", ratio: 1, isDbm: true },
    { value: "kw", label: "千瓦 (kW)", ratio: 1000000 },
    { value: "mw_mega", label: "兆瓦 (MW)", ratio: 1000000000 },
    { value: "hp", label: "马力 (hp)", ratio: 745700 },
    { value: "btu", label: "英热单位/小时 (BTU/h)", ratio: 293.07107 },
    { value: "kcal", label: "千卡/小时 (kcal/h)", ratio: 1.163 },
    { value: "j", label: "焦耳/秒 (J/s)", ratio: 1000 }
]

export default function PowerConverterPage() {
    const [fromValue, setFromValue] = useState<string>("")
    const [fromUnit, setFromUnit] = useState<string>(unitOptions[0].value)
    const [toUnit, setToUnit] = useState<string>(unitOptions[2].value)

    const convert = (value: string, from: string, to: string): string => {
        if (!value || isNaN(Number(value))) return ""

        const fromOption = unitOptions.find(opt => opt.value === from)
        const toOption = unitOptions.find(opt => opt.value === to)

        if (!fromOption || !toOption) return ""

        let result: number
        const numValue = Number(value)

        // 转换为毫瓦作为中间单位
        let mwValue: number
        if (fromOption.isDbm) {
            mwValue = Math.pow(10, numValue / 10)
        } else {
            mwValue = numValue * fromOption.ratio
        }

        // 从毫瓦转换为目标单位
        if (toOption.isDbm) {
            result = 10 * Math.log10(mwValue)
        } else {
            result = mwValue / toOption.ratio
        }

        return result.toFixed(6)
    }

    return (
        <div className="container mx-auto py-6">
            <Card>
                <CardHeader>
                    <CardTitle>功率单位转换</CardTitle>
                    <CardDescription>支持瓦特、千瓦、马力等功率单位之间的转换</CardDescription>
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