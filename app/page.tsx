// 时间戳：MTI-T3[熊天成]---------2024年03月21日星期四,上午 ，9:01:05
"use client"

/**
 * 展示前端首页：纯数据大屏（面试讲产品用）
 *
 * 布局：
 *   ├── 标题区
 *   ├── KPI 指标卡组（总用户 / DAU / 今日触发 / 留存）
 *   ├── 主趋势图（DAU + 新用户 + 触发次数 三线 30 天）
 *   └── 副图区（角色热度 Top10 横向条形图 + 留存率曲线 + 键位预测）
 */
import { Activity, Gamepad2, MousePointerClick, Users } from "lucide-react"
import * as echarts from "echarts"
import { useEffect, useState } from "react"

import { ChartCard, KpiCard } from "@/components/ui"
import { ChartErrorBoundary } from "@/components/chart-error-boundary"
import { KeyForecastChart } from "@/components/key-forecast-chart"
import {
  api,
  formatWan,
  type Character,
  type Overview,
  type RetentionPoint,
  type TrendPoint,
} from "@/lib/api"

// 统一颜色（hex，ECharts LinearGradient 只认 hex/rgb）
const C = {
  cyan: "#22d3ee",
  purple: "#a855f7",
  amber: "#f59e0b",
  grid: "#334155",
  text: "#94a3b8",
}

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
    animation: false,
    backgroundColor: "transparent",
    tooltip: { trigger: "axis" },
    legend: { data: ["DAU", "新用户", "触发次数"], textStyle: { color: C.text }, top: 0 },
    grid: { left: 55, right: 55, top: 40, bottom: 30 },
    xAxis: {
      type: "category",
      data: trend.map((t) => t.date.slice(5)),
      axisLabel: { color: C.text },
      axisLine: { lineStyle: { color: C.grid } },
    },
    yAxis: [
      { type: "value", axisLabel: { color: C.text, formatter: (v: number) => formatWan(v) }, splitLine: { lineStyle: { color: C.grid } } },
      { type: "value", axisLabel: { color: C.text, formatter: (v: number) => formatWan(v) }, splitLine: { show: false } },
    ],
    series: [
      { name: "DAU", type: "line", smooth: true, data: trend.map((t) => t.active_users), itemStyle: { color: C.cyan }, areaStyle: { opacity: 0.2 } },
      { name: "新用户", type: "bar", data: trend.map((t) => t.new_users), itemStyle: { color: C.purple } },
      { name: "触发次数", type: "line", smooth: true, yAxisIndex: 1, data: trend.map((t) => t.key_events), itemStyle: { color: C.amber } },
    ],
  }

  const sorted = [...characters].sort((a, b) => b.usage_count - a.usage_count).slice(0, 10)
  const hotOption: echarts.EChartsOption = {
    animation: false,
    backgroundColor: "transparent",
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
    grid: { left: 110, right: 40, top: 10, bottom: 20 },
    xAxis: { type: "value", axisLabel: { color: C.text, formatter: (v: number) => formatWan(v) }, splitLine: { lineStyle: { color: C.grid } } },
    yAxis: {
      type: "category",
      inverse: true,
      data: sorted.map((c) => c.name),
      axisLabel: { color: "#cbd5e1" },
    },
    series: [{
      type: "bar",
      data: sorted.map((c) => c.usage_count),
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
          { offset: 0, color: "#0891b2" },
          { offset: 1, color: C.cyan },
        ]),
        borderRadius: [0, 6, 6, 0],
      },
      label: { show: true, position: "right", color: "#cbd5e1", formatter: (p: any) => formatWan(Number(p.value)) },
    }],
  }

  const retentionOption: echarts.EChartsOption = {
    animation: false,
    backgroundColor: "transparent",
    tooltip: { trigger: "axis", valueFormatter: (v: any) => `${v}%` },
    legend: { data: ["D1 留存", "D7 留存"], textStyle: { color: C.text }, top: 0 },
    grid: { left: 40, right: 20, top: 40, bottom: 30 },
    xAxis: { type: "category", data: retention.map((r) => r.date.slice(5)), axisLabel: { color: C.text } },
    yAxis: { type: "value", max: 60, axisLabel: { color: C.text, formatter: "{value}%" }, splitLine: { lineStyle: { color: C.grid } } },
    series: [
      { name: "D1 留存", type: "line", smooth: true, data: retention.map((r) => +(r.d1 * 100).toFixed(1)), itemStyle: { color: C.amber } },
      { name: "D7 留存", type: "line", smooth: true, data: retention.map((r) => +(r.d7 * 100).toFixed(1)), itemStyle: { color: C.purple } },
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

      <ChartErrorBoundary>
        <ChartCard title="近 30 天 DAU · 新用户 · 触发次数" option={mainTrendOption} loading={!loaded} className="h-80 w-full" />
      </ChartErrorBoundary>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartErrorBoundary>
          <ChartCard title="热门忍者方案 Top 10" option={hotOption} loading={!loaded} className="h-96 w-full" />
        </ChartErrorBoundary>
        <ChartErrorBoundary>
          <ChartCard title="D1 / D7 留存率" option={retentionOption} loading={!loaded} className="h-96 w-full" />
        </ChartErrorBoundary>
      </div>

      <ChartErrorBoundary>
        <KeyForecastChart />
      </ChartErrorBoundary>
    </div>
  )
}
