// 时间戳：MTI-T3[熊天成]---------2024年04月04日星期四,下午 ，12:32:38
"use client"

/**
 * AI 助手悬浮球（可拖拽）
 *
 * 结构：
 *   ├── 悬浮球（紫色圆形按钮，可拖拽到屏幕任意位置）
 *   └── 点击展开的聊天面板
 *       ├── 标题栏（AI 助手 + 关闭）
 *       ├── 消息列表（用户问题 + AI 回答）
 *       └── 输入框 + 发送按钮
 *
 * AI 回答用关键词匹配模拟（面试演示用），不接真实 LLM。
 */
import { Bot, Send, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"

interface Message {
  role: "user" | "ai"
  text: string
}

// 模拟 AI 回答
function mockReply(q: string): string {
  const s = q.toLowerCase()
  if (s.includes("波风水门") || s.includes("水门")) {
    return "波风水门（高招类）推荐键位：W/E/R 移动+通灵，I/O 二技能/奥义，J/K 一技能/普攻，空格替身。该方案上周使用量 9.8w，预计下周环比增长 12%。"
  }
  if (s.includes("预测") || s.includes("下周")) {
    return "根据近 7 天数据预测：下周 DAU 预计 4.2w（+8%），热门键位 Top3 是 J（一技能）、I（二技能）、空格（替身），留存 D1 预计 42%。"
  }
  if (s.includes("方案") || s.includes("键位")) {
    return "当前共上线 20 套忍者方案，分 5 大类：高招类 8 个、忍法帖 4 个、江湖类 3 个、百战类 3 个、限定类 2 个。最热门是波风水门（9.8w 使用）。"
  }
  if (s.includes("留存") || s.includes("用户")) {
    return "当前产品 32w 累计用户，D1 留存 42%，D7 留存 28%，日触发次数约 120w。新用户主要来自腾讯应用宝自然流量。"
  }
  return "我是忍者键位 AI 助手，你可以问我：\n· 某忍者的推荐键位方案\n· 下周使用量预测\n· 当前热门忍者排行\n· 用户留存数据"
}

export function AiAssistant() {
  const [pos, setPos] = useState({ x: window.innerWidth - 80, y: window.innerHeight - 80 })
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", text: "你好！我是忍者键位 AI 助手，可以问我推荐方案、预测数据、热门排行。" },
  ])
  const [input, setInput] = useState("")
  const dragRef = useRef<{ startX: number; startY: number; baseX: number; baseY: number } | null>(null)

  // 拖拽逻辑
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!dragRef.current) return
      const dx = e.clientX - dragRef.current.startX
      const dy = e.clientY - dragRef.current.startY
      setPos({
        x: Math.max(0, Math.min(window.innerWidth - 60, dragRef.current.baseX + dx)),
        y: Math.max(0, Math.min(window.innerHeight - 60, dragRef.current.baseY + dy)),
      })
    }
    const onUp = () => {
      dragRef.current = null
    }
    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", onUp)
    return () => {
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onUp)
    }
  }, [])

  function send() {
    if (!input.trim()) return
    const q = input.trim()
    setMessages((m) => [...m, { role: "user", text: q }])
    setInput("")
    setTimeout(() => {
      setMessages((m) => [...m, { role: "ai", text: mockReply(q) }])
    }, 300)
  }

  return (
    <>
      {/* 悬浮球 */}
      <button
        onPointerDown={(e) => {
          dragRef.current = { startX: e.clientX, startY: e.clientY, baseX: pos.x, baseY: pos.y }
        }}
        onClick={() => setOpen(true)}
        className="fixed z-50 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-xl shadow-purple-500/40 transition-transform hover:scale-110"
        style={{ left: pos.x, top: pos.y }}
        title="AI 助手"
      >
        <Bot className="h-6 w-6" />
      </button>

      {/* 聊天面板 */}
      {open ? (
        <div
          className="fixed z-50 flex w-80 flex-col rounded-xl border border-border bg-card shadow-2xl"
          style={{
            left: Math.min(pos.x - 300, window.innerWidth - 340),
            top: Math.max(20, pos.y - 400),
            height: 420,
          }}
        >
          {/* 标题栏 */}
          <div className="flex items-center justify-between border-b border-border/60 p-3">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                <Bot className="h-3.5 w-3.5" />
              </span>
              <span className="text-sm font-medium">键位 AI 助手</span>
            </div>
            <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* 消息列表 */}
          <div className="flex-1 space-y-3 overflow-y-auto p-3">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                <div
                  className={
                    m.role === "user"
                      ? "max-w-[80%] rounded-lg bg-pink-500 px-3 py-1.5 text-sm text-white"
                      : "max-w-[80%] whitespace-pre-wrap rounded-lg bg-muted px-3 py-1.5 text-sm"
                  }
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* 输入框 */}
          <div className="flex gap-2 border-t border-border/60 p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="问我键位方案..."
              className="flex-1 rounded-md border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-primary"
            />
            <button onClick={send} className="rounded-md bg-primary p-1.5 text-primary-foreground">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : null}
    </>
  )
}
