# 忍者键位设计平台 · 展示前端

火影忍者手游键位设计优化产品的数据展示端，面向面试官和用户展示产品运营数据。

## 技术栈

- Next.js 16.3.6 App Router
- React 19
- Tailwind CSS v4
- shadcn/ui (aria-nova)
- ECharts 数据可视化
- lucide-react 图标

## 功能模块

- 数据大屏：KPI 指标卡 + 30 天趋势图 + 热门忍者 Top10 + D1/D7 留存曲线
- 键位热度预测：选忍者，柱状图对比近 7 天均值 vs 下周预测
- AI 助手：可拖拽悬浮球，点击展开聊天问答

## 启动

```bash
npm install
npm run dev
# http://localhost:3000
```

## 目录结构

```
app/
  page.tsx              # 数据大屏首页
  layout.tsx            # 全局布局
components/
  ui/                   # shadcn 基础组件（带块注释导出）
  chart-card.tsx        # ECharts 容器
  kpi-card.tsx          # KPI 指标卡
  key-forecast-chart.tsx # 键位预测图
  ai-assistant.tsx      # AI 助手悬浮球
lib/
  api.ts                # API 客户端
```
