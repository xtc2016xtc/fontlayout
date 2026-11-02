/* ==================== shadcn 基础 UI 组件 ==================== */

/* 按钮组件：支持 variant / size 两种变体 */
export { Button } from "@/components/ui/button"

/*
  登录注册 / 确认弹窗组件
      DialogTrigger
          ├── Button
          └── Dialog
              ├── DialogHeader
              │   ├── DialogTitle
              │   └── DialogDescription
              └── DialogFooter
*/
export {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


/* ==================== 业务组件（本项目自研） ==================== */

/*
  顶部导航栏
      ├── Logo（产品名）
      └── NavLink 组（总览 / 角色库）
*/
export { NavBar } from "@/components/nav-bar"

/*
  KPI 指标卡
      ├── Label（指标名）
      ├── Value（大数字，等宽字体）
      ├── Sub（副文案）
      └── Icon（可选 lucide 图标）
*/
export { KpiCard } from "@/components/kpi-card"

/*
  ECharts 图表容器：自动 init / resize / dispose
      ├── 标题（title）
      └── ECharts 实例（按 option 渲染）
*/
export { ChartCard } from "@/components/chart-card"

/*
  键盘可视化组件（核心产品界面）
      ├── Function Row（Esc / F1-F12）
      ├── Number Row（` 1-0 - = Backspace）
      ├── QWERTY Row（Tab Q-P [ ] \）
      ├── Home Row（Caps A-L ; ' Enter）
      ├── Shift Row（Shift Z-M Shift）
      └── Modifier Row（Ctrl Alt Space Ctrl）
  每个物理键根据后端 mappings 渲染彩色技能标注。
*/
export { KeyboardVisualizer } from "@/components/keyboard-visualizer"

/*
  忍者角色选择面板
      ├── 分类 Tab（高招类 / 忍法帖 / 江湖类 / 百战类 / 限定类）
      └── 角色头像网格（当前分类下的所有角色）
          └── 选中态：粉色高亮边框
*/
export { CharacterPicker } from "@/components/character-picker"

/*
  键位热度预测图（数据大屏用）
      ├── 忍者选择下拉
      └── 分组柱状图
          ├── 蓝色柱：近 7 天该键位平均触发次数
          └── 紫色柱：下周预测值（线性外推）
*/
export { KeyForecastChart } from "@/components/key-forecast-chart"

/*
  AI 助手悬浮球（可拖拽）
      ├── 悬浮球（紫色渐变圆形按钮，拖拽到屏幕任意位置）
      └── 聊天面板（点击展开）
          ├── 标题栏（AI 助手 + 关闭）
          ├── 消息列表（用户问题 + AI 模拟回答）
          └── 输入框 + 发送按钮
*/
export { AiAssistant } from "@/components/ai-assistant"
