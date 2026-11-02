// 时间戳：MTI-T3[熊天成]---------2024年03月16日星期六,下午 ，17:05:37
import { Geist_Mono, Inter } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { NavBar } from "@/components/ui"
import { AiAssistant } from "@/components/ai-assistant"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="zh-CN"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", inter.variable)}
    >
      <body>
        <ThemeProvider>
          <NavBar />
          <main className="mx-auto max-w-7xl px-6 py-6">{children}</main>
          <AiAssistant />
        </ThemeProvider>
      </body>
    </html>
  )
}
