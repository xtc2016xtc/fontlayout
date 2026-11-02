"use client"

/**
 * 展示前端首页：纯数据大屏（面试讲产品用）
 *
 * 布局：
 *   ├── 标题区
 *   ├── KPI 指标卡组（总用户 / DAU / 今日触发 / 留存）
 *   ├── 主趋势图（DAU + 新用户 + 触发次数 三线 30 天）
 *   └── 副图区（角色热度 Top10 横向条形图 + 留存率曲线）
 */
import { Activity, Gamepad2, MousePointerClick, Users } from "lucide-react"
import * as echarts from "echarts"
import { useEffect, useState } from "react"

import { ChartCard, KpiCard } from "@/components/ui"
import { KeyForecastChart } from "@/components/key-forecast-chart"
import {
  api,
  formatWan,
  type Character,
  type Overview,
  type RetentionPoint,
  type TrendPoint,
} from "@/lib/api"

export default function HomePage() {
  const [overview, setOverview] = useState<Overview | null>(null)
  const [trend, setTrend] = useState<TrendPoint[]>([])
  const [characters, setCharacters] = useState<Character[]>([])
  const [retention, setRetention] = useState<RetentionPoint[]>([])

  useEffect(() => {
    Promise.all([api.overview(), api.trend(30), api.characters(), api.retention(30)])
      .then(([o, t, cs, r]) => {
        setOverview(o)
        setTrend(t)
        setCharacters(cs)
        setRetention(r)
      })
      .catch(console.error)
  }, [])

  const loaded = trend.length > 0 && characters.length > 0 && retention.length > 0

  const mainTrendOption: echarts.EChartsOption = {
    backgroundColor: "transparent",
    tooltip: { trigger: "axis" },
    legend: { data: ["DAU", "新用户", "触发次数"], textStyle: { color: "oklch(0.7 0.02 240)" }, top: 0 },
    grid: { left: 55, right: 55, top: 40, bottom: 30 },
    xAxis: {
      type: "category",
      data: trend.map((t) => t.date.slice(5)),
      axisLabel: { color: "oklch(0.7 0.02 240)" },
      axisLine: { lineStyle: { color: "oklch(0.4 0.02 264)" } },
    },
    yAxis: [
      { type: "value", axisLabel: { color: "oklch(0.7 0.02 240)", formatter: (v: number) => formatWan(v) }, splitLine: { lineStyle: { color: "oklch(0.3 0.02 264)" } } },
      { type: "value", axisLabel: { color: "oklch(0.7 0.02 240)", formatter: (v: number) => formatWan(v) }, splitLine: { show: false } },
    ],
    series: [
      { name: "DAU", type: "line", smooth: true, data: trend.map((t) => t.active_users), itemStyle: { color: "oklch(0.82 0.17 195)" }, areaStyle: { opacity: 0.2 } },
      { name: "新用户", type: "bar", data: trend.map((t) => t.new_users), itemStyle: { color: "oklch(0.72 0.2 295)" } },
      { name: "触发次数", type: "line", smooth: true, yAxisIndex: 1, data: trend.map((t) => t.key_events), itemStyle: { color: "oklch(0.78 0.18 60)" } },
    ],
  }

  const sorted = [...characters].sort((a, b) => b.usage_count - a.usage_count).slice(0, 10)
  const hotOption: echarts.EChartsOption = {
    backgroundColor: "transparent",
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
    grid: { left: 110, right: 40, top: 10, bottom: 20 },
    xAxis: { type: "value", axisLabel: { color: "oklch(0.7 0.02 240)", formatter: (v: number) => formatWan(v) }, splitLine: { lineStyle: { color: "oklch(0.3 0.02 264)" } } },
    yAxis: {
      type: "category",
      inverse: true,
      data: sorted.map((c) => c.name),
      axisLabel: { color: "oklch(0.85 0.01 240)" },
    },
    series: [{
      type: "bar",
      data: sorted.map((c) => c.usage_count),
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
          { offset: 0, color: "oklch(0.55 0.15 195)" },
          { offset: 1, color: "oklch(0.82 0.17 195)" },
        ]),
        borderRadius: [0, 6, 6, 0],
      },
      label: { show: true, position: "right", color: "oklch(0.85 0.01 240)", formatter: (p: any) => formatWan(Number(p.value)) },
    }],
  }

  const retentionOption: echarts.EChartsOption = {
    backgroundColor: "transparent",
    tooltip: { trigger: "axis", valueFormatter: (v) => `${v}%` },
    legend: { data: ["D1 留存", "D7 留存"], textStyle: { color: "oklch(0.7 0.02 240)" }, top: 0 },
    grid: { left: 40, right: 20, top: 40, bottom: 30 },
    xAxis: { type: "category", data: retention.map((r) => r.date.slice(5)), axisLabel: { color: "oklch(0.7 0.02 240)" } },
    yAxis: { type: "value", max: 60, axisLabel: { color: "oklch(0.7 0.02 240)", formatter: "{value}%" }, splitLine: { lineStyle: { color: "oklch(0.3 0.02 264)" } } },
    series: [
      { name: "D1 留存", type: "line", smooth: true, data: retention.map((r) => +(r.d1 * 100).toFixed(1)), itemStyle: { color: "oklch(0.78 0.18 60)" } },
      { name: "D7 留存", type: "line", smooth: true, data: retention.map((r) => +(r.d7 * 100).toFixed(1)), itemStyle: { color: "oklch(0.75 0.19 350)" } },
    ],
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">忍者键位 · 数据大屏</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          上线 180 天运营数据 · 32w 累计用户 · {characters.length} 套忍者方案
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="累计用户" value={overview ? formatWan(overview.total_users) : "--"} sub="腾讯应用宝上架" icon={Users} />
        <KpiCard label="今日 DAU" value={overview ? formatWan(overview.today_active) : "--"} sub="日活跃" icon={Activity} />
        <KpiCard label="今日触发" value={overview ? formatWan(overview.today_events) : "--"} sub="键位被触发次数" icon={MousePointerClick} />
        <KpiCard label="已上线方案" value={overview ? `${overview.total_keys}` : "--"} sub={`D1/D7 ${overview ? (overview.retention_d1*100).toFixed(1)+'% / '+(overview.retention_d7*100).toFixed(1)+'%' : '--'}`} icon={Gamepad2} />
      </div>

      <ChartCard title="近 30 天 DAU · 新用户 · 触发次数" option={mainTrendOption} loading={!loaded} className="h-80 w-full" />

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="热门忍者方案 Top 10" option={hotOption} loading={!loaded} className="h-96 w-full" />
        <ChartCard title="D1 / D7 留存率" option={retentionOption} loading={!loaded} className="h-96 w-full" />
      </div>

      <KeyForecastChart />
    </div>
  )
}
