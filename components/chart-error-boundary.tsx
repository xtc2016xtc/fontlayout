// 时间戳：MTI-T3[熊天成]---------2024年06月13日星期四,下午 ，18:17:51
"use client"

/**
 * 图表错误边界：任何 ECharts 内部崩溃都不会白屏，只在该图位置显示错误提示。
 *
 * 结构：
 *   ├── 正常渲染（children 图表）
 *   └── 出错时渲染（错误提示 + 重试按钮）
 */
import React from "react"

interface Props {
  children: React.ReactNode
}

interface State {
  hasError: boolean
}

export class ChartErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    console.warn("图表渲染失败，已被 Error Boundary 捕获：", error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-64 items-center justify-center rounded-xl border border-border/60 bg-card/40 text-sm text-muted-foreground">
          图表加载失败，请刷新重试
        </div>
      )
    }
    return this.props.children
  }
}
